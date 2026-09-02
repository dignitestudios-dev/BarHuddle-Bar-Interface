# Frontend Integration Guide — Backend Changes

This document is written for **frontend developers (web + mobile)**. It explains what changed in the backend, what the new API shapes are, and what you must update in the UI/integration code. It is organized per change with: **Changes (previous vs new)**, **API Endpoints**, **Request Payload**, **Response Structure**, **Business Logic**, **Error Responses**, **Deprecated fields**, and **Migration notes**.

Backend changelog (non-FE detail): see the project README / version docs.

---

# PART 1 — Shared with Mobile & Web

## 1. Promotion View

### Changes (previous vs new)

| | Previous | New |
|---|---|---|
| Soft-deleted promotion | Could still be "viewed" | Returns **404 "Promotion not found"** |
| `viewers` data structure | array of user IDs | array of `{ user, viewedAt }` objects |
| View recording | pushed raw user ID | pushes `{ user, viewedAt: new Date() }`, deduped by user |

### API Endpoint

- **Endpoint:** `POST /promotions/:id/view`
- **Method:** POST
- **Purpose:** Increment the promotion `viewCount` by 1 (used for analytics).
- **Auth:** Required (Bearer token). The authenticated user ID is used to dedupe viewers.
- **Body:** none.

### Response Structure

```json
{
  "success": true,
  "message": "Promotion viewed",
  "data": {
    "viewCount": 5
  }
}
```

### Business Logic
- Every call (+1) increments `viewCount` on `viewCount` on **one** call (anonymous, no auth) or deduped per user.
- If the promotion is soft-deleted → 404.

### Error Responses
- **404** `{ "success": false, "message": "Promotion not found" }` — promotion ID is invalid or the promotion is soft-deleted.

### Migration / Integration Notes
- No request payload change. Just wire the button/action to `POST /promotions/:id/view`.
- Do not send a body.

---

## 2. Promotion Redeem

### Changes (previous vs new)

| | Previous | New |
|---|---|---|
| Deleted promotion | No explicit check | **404 "Promotion not found"** |
| `status != active` | Allowed redemption | **400 "Promotion is not active"** |
| Before `startAt` | Allowed | **400 "Promotion has not started yet"** |
| After `endAt` | Allowed | **400 "Promotion has expired"** |
| Already redeemed | Graceful (already worked) | Same (returns 200 with existing count) |

### API Endpoint

- **Endpoint:** `POST /promotions/:id/redeem`
- **Method:** POST
- **Purpose:** Redeem a promotion for the authenticated user.
- **Auth:** Required (Bearer token). `userId` is taken from the token.
- **Body:** none.

### Response Structure

**Success:**
```json
{
  "success": true,
  "message": "Promotion redeemed successfully",
  "data": { "redeemedCount": 3 }
}
```

**Already redeemed (NOT an error — 200):**
```json
{
  "success": true,
  "message": "Promotion already redeemed",
  "data": { "redeemedCount": 3 }
}
```

### Business Logic the FE must handle
Redeem is now validated before applying. Trigger points for UI:
- **Not active:** Show disabled state / "not available" for `draft`, `cancelled`, `expired` statuses.
- **Not started yet:** Show "starts on <startAt>".
- **Expired:** Show "expired" state, prevent redemption.
- **Already redeemed:** Show "Already redeemed" confirmation or disable the button.

### Error Responses

| Status | Message | When | FE handling |
|---|---|---|---|
| 404 | `Promotion not found` | invalid ID or soft-deleted | Show "no longer available" |
| 400 | `Promotion is not active` | status not `active` | Disable redeem, show status |
| 400 | `Promotion has not started yet` | now < `startAt` | Show "starts on <date>" |
| 400 | `Promotion has expired` | now > `endAt` | Show expired, disable |

---

## 3. Promotion `viewers` field — schema change ⚠️ MIGRATION REQUIRED

If your frontend reads `viewers` from `GET /promotions/:id` or list responses, this is a breaking change.

### Before
```json
"viewers": ["64f0c...", "64f1a..."]
```

### After
```json
"viewers": [
  { "user": "64f0c...", "viewedAt": "2026-09-01T10:00:00.000Z" },
  { "user": "64f1a...", "viewedAt": "2026-09-02T15:30:00.000Z" }
]
```

### Migration Notes
- Change any code that treats `viewers` as `string[]` (e.g. `viewers.map(id => ...)`) to map `viewers.map(v => v.user)`.
- Counts are still available via the `viewCount` field (a single number) — prefer that for display instead of `viewers.length` if you want unique impressions.

---

## 4. Image Uploads — new endpoints + validation

### Changes (previous vs new)

| | Previous | New |
|---|---|---|
| Accepted formats | any file | **PNG, JPG, WEBP only** for image routes |
| Max size | 50MB default | **20MB** per image for image routes |
| Error on bad type | none (uploaded anyway) | `INVALID_IMAGE_TYPE` |
| Endpoints | `/files/upload`, `/files/upload-multiple` | added `/files/upload-image`, `/files/upload-multiple-images` |

### API Endpoints

**Single image**
- **Endpoint:** `POST /files/upload-image`
- **Method:** POST
- **Purpose:** Upload a single image (event banner, promotion banner, venue gallery, profile).
- **Auth:** Required (Bearer token).
- **Content-Type:** `multipart/form-data`
- **Form field:** `file`

**Multiple images**
- **Endpoint:** `POST /files/upload-multiple-images`
- **Method:** POST
- **Purpose:** Upload up to 5 images in one request.
- **Auth:** Required (Bearer token).
- **Content-Type:** `multipart/form-data`
- **Form field:** `files`

### Request Payload (multipart)
- `file` or `files` (binary). No other body fields required.

### Response Structure
Same shape as existing `/files/upload`:
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "_id": "64...",
    "url": "...",
    "mimetype": "image/png",
    "size": 12345,
    "filename": "file.png"
  }
}
```

### Business Logic / Validation
- Allowed MIME types: `image/png`, `image/jpeg`, `image/jpg`, `image/webp`.
- Max size: **20MB** per file.
- The existing generic `/files/upload` and `/files/upload-multiple` remain for other file types.

### Error Responses

| Status | Message / code | When | FE handling |
|---|---|---|---|
| 400 | `Invalid image type. Allowed formats: PNG, JPG, WEBP` (code `INVALID_IMAGE_TYPE`) | wrong extension/mime | Show format error; block submit |
| 413 / multer size error | file exceeded 20MB | file too large | Show size error |
| 400 | `file not Found` | no file sent | Prompt to attach file |

### Migration / Integration Notes
- Point image pickers to the new image-only endpoints so clients get validation early.
- Enforce 20MB + allowed formats on the client as well for a better UX (mirror the server rules).
- The `banner` fields in events/promotions and venue `gallery`/profile images expect the returned file ID / URL from these endpoints.

---

# PART 2 — Web-only (Analytics dashboards)

The following change **only** the owner analytics web dashboards. Mobile apps do **not** consume these.

## 5. Performance Summary — `satisfaction` → `sentimentScore` ⚠️ MIGRATION REQUIRED (web)

### API Endpoint
- **Endpoint:** `GET /analytics/performance-summary`
- **Method:** GET
- **Auth:** Required (Bearer token, venue-owner/admin).
- **Query params:** `filter` (`yearly` | `monthly` | `weekly` | `custom`), optional `startDate`/`endDate` for custom, optional `venueId`.

### Changes (previous vs new)

| Field | Previous | New |
|---|---|---|
| `satisfaction` | `{ totalReviews, score }` | **renamed `sentimentScore`** |
| `satisfaction`/`sentimentScore` value | rating-derived `"0/100"` | same structure |

### Response Structure (new)
```json
{
  "success": true,
  "data": {
    "bestPerformingEvent": {},
    "peakHours": "...",
    "peakDay": "...",
    "topSegment": { "ageRange": null, "count": 0, "percentage": 0 },
    "bestDay": { "day": null, "avgVisitors": 0 },
    "sentimentScore": { "totalReviews": 0, "score": "0/100" }
  }
}
```

### Migration Notes
- Web FE must rename the consumed field from `satisfaction` to `sentimentScore`. Remove any reference to `data.satisfaction`.

---

## 6. Visitors Graph — `visitors` meaning + `retention` removed

### API Endpoint
- **GET `/analytics/overview/vistors-graph`** (note the custom path spelling `vistors`)
- **Method:** GET
- **Auth:** Required (Bearer token).
- **Query params:** `filter`, optional `startDate`/`endDate`, optional `venueId`.

### Changes (previous vs new)

| | Previous | New |
|---|---|---|
| `visitors` | check-ins that fell inside a published **event window** | **distinct unique users** who checked in |
| `retention` field | present per bucket | **removed** |

### Response Structure (new — monthly/yearly)
```json
{
  "success": true,
  "data": [
    {
      "year": 2026,
      "month": 8,
      "visitors": 120,
      "checkIns": 340
    }
  ]
}
```

### Response Structure (new — daily/custom)
```json
{
  "success": true,
  "data": [
    {
      "date": "2026-08-01T00:00:00.000Z",
      "visitors": 34,
      "checkIns": 96
    }
  ]
}
```

### Migration Notes
- `retention` field is **gone** — remove it from graph rendering.
- `visitors` means **unique users**, `checkIns` means **total check-ins** — label charts accordingly; do not compare them as equivalent.

---

## 7. Time-of-Day buckets — boundary change

### API Endpoint
- **GET `/analytics/overview/time-of-day-graph`**
- **Method:** GET
- **Auth:** Required (Bearer token).
- **Query params:** `filter`, optional dates, optional `venueId`.

### Changes (previous vs new)

| Bucket | Previous (local hour) | New (local hour) |
|---|---|---|
| morning | 05:00–11:59 | **06:00–11:59** |
| afternoon | 12:00–16:59 | **12:00–17:59** |
| evening | 17:00–20:59 | **18:00–19:59** |
| latenight | 21:00–04:59 | **20:00–05:59** |

### Business Logic
- Bucketing uses the visit's **local** time (venue UTC offset), so hours align with local day/night — not server UTC.

### Migration Notes
- If the FE renders fixed bucket labels/ranges (e.g. tooltips or axis labels "17:00–21:00" etc.), update them to the new ranges above. Data returned is already bucketed under the new boundaries.

---

## 8. Event Attendance — distinct users

### API Endpoint
- **GET `/analytics/events/attendance`** (and any consumer of attendance)
- **Method:** GET
- **Auth:** Required (Bearer token).

### Changes (previous vs new)
- Attendance previously counted **total check-in records** during an event window.
- Now counts **distinct users** whose check-in fell inside a published event window.

### Migration Notes
- Understand that attendance is now **unique attendees**, not total check-ins. Adjust labels/tooltips if they implied check-ins.

---

# PART 3 — Owner Web operations (non-analytics)

## 9. Operating Hours — multiple intervals per day

### API Endpoint
- **Endpoint:** `PUT /venue-owner/venues/:id/hours`
- **Method:** PUT
- **Auth:** Required (Bearer token). Requires approved venue ownership.
- **Content-Type:** `application/json`

### Request Payload (new — `intervals` optional)
```json
{
  "hours": [
    {
      "day": 1,
      "isClosed": false,
      "intervals": [
        { "open": "11:00", "close": "15:00" },
        { "open": "18:00", "close": "23:30" }
      ]
    },
    {
      "day": 2,
      "open": "11:00",
      "close": "23:30",
      "isClosed": false
    }
  ]
}
```

### Fields
| Field | Type | Required | Notes |
|---|---|---|---|
| `day` | number (0–6) | Yes | 0 = Sunday |
| `isClosed` | boolean | No | default false |
| `open` | string `HH:MM` | No (legacy single interval) | still supported |
| `close` | string `HH:MM` | No (legacy single interval) | still supported |
| `intervals` | array `{open, close}` | No (new) | supports multiple open/close per day |

### Response Structure
```json
{
  "success": true,
  "message": "Operating hours updated",
  "data": [
    {
      "day": 1,
      "isClosed": false,
      "intervals": [ { "open": "11:00", "close": "15:00" } ]
    }
  ]
}
```

### Business Logic the FE must handle
- **New** `intervals` array allows multiple open/close segments per day (e.g. lunch + dinner). If the FE hours editor assumes one `open`/`close` per day, update it to render multiple intervals.
- `open`/`close` are still accepted for backward compatibility, but the editor should prefer `intervals` going forward.
- `GET /venue-owner/venues/:id/hours` returns the same shape.

### Error Responses
- **400** `hours must be an array` — payload not an array.
- **404** `Venue not found` — venue missing/inactive.
- Validation errors from zod for invalid `day`, malformed `interval`, etc.

---

# PART 4 — Dashboard total growth (owner web)

## 10. Dashboard growth values — now real data (was hardcoded `+18.4%`)

### API Endpoint
- **GET /venue-owner/dashboard** and the `/analytics` overview
- **Method:** GET
- **Auth:** Required (Bearer token).

### Changes
- Growth percentages for avg stay duration, new/repeat/lost customers, event attendance previously returned a **hardcoded `+18.4%`**.
- Now computed from real previous-period vs current-period data. When there is no previous data but current is nonzero, growth = `+100%`.

### Migration Notes
- Treat growth values as **dynamic** — do not hardcode mocking, do not assume they stay `+18.4%`.
- Format the returned percent and sign (`+`/`-`) already included in `text`/`growthPercent` fields.

---

# PART 5 — Sensitive/Backend-only (no FE action)

| Change | Why no FE action |
|---|---|
| Analytics ownership filters | Server-side authorization fix only; behavior appears identical to FE (rejects venues user doesn't own). |
| Sentiment from `visitFeedback` instead of Google rating (venue-owner) | Server-side; the `sentimentScore` output object is unchanged in shape. |
| EventBoost expiration cron | Internal server job; `expired` status may simply surface in existing boost lists. |
| Promotion/redeem `isDeleted` checks | Already covered under Promotions above. |

---

# Summary of mandatory FE migrations

| # | Area | Action |
|---|---|---|
| 1 | Promotions `viewers` | Expect `[{ user, viewedAt }]`, not `string[]` |
| 2 | Promotion redeem | Handle `400` "not active / not started / expired" + already-redeemed state |
| 3 | Image upload | Use `/files/upload-image` (PNG/JPG/WEBP, ≤20MB) |
| 4 | Performance summary | Rename `satisfaction` → `sentimentScore` |
| 5 | Visitors graph | `retention` removed; `visitors` = unique users |
| 6 | Time-of-day | Update bucket boundaries/labels |
| 7 | Operating hours | Support multiple `intervals` per day |
| 8 | Growth values | Treat as dynamic, not hardcoded `+18.4%` |

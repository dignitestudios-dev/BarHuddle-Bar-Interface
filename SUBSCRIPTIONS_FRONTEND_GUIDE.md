# Subscriptions & Boosts — Frontend Guide

Practical reference for wiring up plans, checkout, and boost purchases. For a
request-by-request Postman collection, ask backend for
`BarHuddle - Subscriptions & Boosts.postman_collection.json`. This doc covers
the parts that aren't obvious from the endpoint list alone.

## The core gotcha: activation is asynchronous

Purchasing anything (a subscription **or** a one-time product) is a two-step
flow, not a single request-response:

1. You call `POST /subscriptions/purchase/:planId` → you get back a
   `checkoutUrl` (a Stripe-hosted page). **Nothing is paid for yet.**
2. The user pays on Stripe's page, then gets redirected to whatever
   `successUrl`/`cancelUrl` you sent. **The redirect does not mean the
   purchase is confirmed in our system.** Confirmation happens separately,
   whenever Stripe's webhook reaches our backend — which is usually fast
   (seconds) but is not guaranteed to land before the user's browser finishes
   redirecting.

**What this means for the UI:** on the success page, don't read
`user.isSubscribed` from a stale token/cache and declare victory. Poll
`GET /subscriptions/my` (or refetch the user) for a few seconds after landing
on the success page until `isActive`/`isSubscribed` flips, or show a
"finishing up..." state. If it never flips within ~10–15s, something's wrong
(bad Stripe config, webhook down) — surface an error rather than spinning
forever.

## Who sees which plans

Plans are filtered server-side by the caller's role — you never need to
filter client-side:

- `role: "bar_owner"` → venue plans (`venue_free`, `venue_premium`,
  `venue_executive`) + `event_boost`
- `role: "user"` → `vip` (if seeded)

`GET /subscriptions/plans` reads the role off the auth token automatically.
Optional query param to narrow further:

```
GET /subscriptions/plans?billingMode=subscription   # recurring plans only
GET /subscriptions/plans?billingMode=one_time        # one-time products only
GET /subscriptions/plans                             # everything for the role
```

Each plan object looks like:

```jsonc
{
  "_id": "...",
  "key": "venue_premium",           // stable machine identifier, use this in UI logic — not the label
  "billingMode": "subscription",    // "subscription" | "one_time"
  "label": "Premium (Venue)",       // display name
  "displayPrice": 199,              // dollars, not cents
  "currency": "usd",
  "features": ["Claim and verify venue", "..."],
  "trialDays": 0,
  "limitations": { "flyers": null },
  "sortOrder": 3
}
```

`key` is the value to branch on in code (`venue_free` / `venue_premium` /
`venue_executive` / `event_boost` / `vip`) — `label` is presentation text only
and can change.

## Buying a plan

```
POST /subscriptions/purchase/:planId
Body: { "successUrl": "<your app's post-checkout URL>", "cancelUrl": "<your app's cancel URL>" }
```

- Both URLs are **required** — the backend no longer has a hardcoded
  fallback. Pass wherever you want Stripe to send the user back to (a deep
  link for mobile, a route for web).
- Response: `{ "data": { "checkoutUrl": "https://checkout.stripe.com/..." } }`
  — redirect/open the browser to this URL. Don't try to build your own
  payment form; it's Stripe Checkout (hosted page).
- Works the same call shape for both `subscription` and `one_time` plans —
  you don't need different logic per `billingMode` on the client, the backend
  picks Stripe's `subscription` vs `payment` mode internally.

**Test card** (Stripe test mode): `4242 4242 4242 4242`, any future expiry,
any CVC, any ZIP.

## Reading subscription state

```
GET /subscriptions/my
→ { "data": { "subscription": { ... } | null, "isActive": true | false } }
```

`subscription` is `null` if the user has never subscribed. `isActive` is the
one field to trust for gating UI — it correctly accounts for `trialing` as
active and `canceled`/`past_due`/`unpaid` as not active (don't re-derive this
from `status` yourself).

The user object itself (from `/auth/me`, login, etc.) also carries:

| Field | Type | Notes |
|---|---|---|
| `isSubscribed` | `boolean` | Kept in sync by the webhook. Quick check without an extra call. |
| `subscriptionPlan` | `string \| null` | The plan `key` the user is currently on (e.g. `"venue_premium"`), or `null` if not subscribed. |
| `boostsCount` | `number` | Running total of boosts the venue owner has purchased. Only meaningful for `bar_owner`. |

## Canceling / changing plan / payment issues

```
POST /subscriptions/cancel              # cancel at period end (not immediate) — user keeps access until periodEnd
POST /subscriptions/change-plan         # body: { "newPlanId": "..." } — must already have an active subscription
PATCH /subscriptions/update-payment-method   # body: { "paymentMethodId": "pm_..." } — needs a Stripe PaymentMethod created client-side (Stripe.js/Elements), not a raw card number
POST /subscriptions/retry-payment       # retries the last failed invoice, for past_due subscriptions
```

- `cancel` sets `cancel_at_period_end` — the subscription stays `isActive`
  until `periodEnd`, it does not deactivate instantly. Show "cancels on
  {periodEnd}" rather than treating it as already gone.
- `change-plan` and `retry-payment` both **require an existing active
  subscription** — calling them with none returns a 400
  (`"No active subscription found"` / `"No active subscription found to
  change"`). Gate these buttons on `isActive`.
- `update-payment-method` needs a real Stripe PaymentMethod ID from
  Stripe.js/Elements on the client — you cannot pass a raw card number to
  this endpoint.

## Boosts — two separate systems, don't mix them up

There are currently **two different ways** boosts show up in the API, and
they are not the same flow:

1. **`POST /venue-owner/boosts`** — the real boost-creation flow, tied to a
   specific event (`{ "eventId": "..." }`). Price and 7-day duration are
   computed server-side from the venue owner's active plan
   (`venue_premium`/`venue_executive` → discounted; anything else → $29.99
   base). **This is the endpoint the "Boost this event" button should call.**
2. **`POST /subscriptions/purchase/event_boost-plan-id`** — a generic
   Stripe purchase of the `event_boost` *product*, with the same tiered
   discount applied to the actual charge. It is **not** linked to any event —
   it just records a `Purchase`. Don't wire a "Boost this event" button to
   this one; it won't create a boost on the event.

If product wants boosting to go through real Stripe payment (not just a
server-side price calculation), that merge hasn't happened yet — check with
backend before building UI that assumes it has.

## Error shape

All errors come back as:

```jsonc
{ "success": false, "message": "..." }
```

with a matching HTTP status — `400` for bad input/state (e.g. "You already
have an active subscription", "No active subscription found"), `404` for an
unknown/inactive `planId`, `403` (`SubscriptionRequired`) on any route gated
behind an active subscription. Show `message` directly; it's already
user-presentable, not a debug string.

# Bar Huddle - Venue Owner API Responses

Yeh file tamaam Venue Owner APIs aur unke expected dummy responses ki list hai.

## 1. Analytics APIs

### GET `/venue-owner/analytics/visitors`
```json
{
  "success": true,
  "message": "Visitor analytics fetched",
  "data": {
    "totalVisits": 12840,
    "uniqueVisitors": 9300,
    "currentlyGoing": 45,
    "byDay": [
      { "date": "2026-08-25", "count": 120 },
      { "date": "2026-08-26", "count": 150 }
    ],
    "visitorTrends": [
      {
        "month": "Jan",
        "checkIns": 1200,
        "visitors": 900,
        "retention": 35
      }
    ]
  }
}
```

### GET `/venue-owner/analytics/retention`
```json
{
  "success": true,
  "message": "Retention analytics fetched",
  "data": {
    "totalUsers": 9300,
    "returningUsers": 4557,
    "oneTimeUsers": 3441,
    "lostCustomers": 1302,
    "retentionRate": 49,
    "customerBreakdown": {
      "now": 37,
      "repeat": 49,
      "lost": 14
    }
  }
}
```

### GET `/venue-owner/analytics/sentiment`
```json
{
  "success": true,
  "message": "Sentiment analytics fetched",
  "data": {
    "avgDwellMinutes": 145,
    "avgRating": 4.5,
    "sentimentScore": {
      "score": 87,
      "worthIt": 62,
      "mid": 25,
      "notWorthIt": 13
    }
  }
}
```

### GET `/venue-owner/analytics/events`
```json
{
  "success": true,
  "message": "Event analytics fetched",
  "data": {
    "totalEvents": 15,
    "totalReach": 25000,
    "avgBoostedReach": 5000,
    "eventAttendance": 12840,
    "eventPerformance": [
      {
        "title": "Ladies Night",
        "date": "2026-08-30T20:00:00.000Z",
        "attendees": 345,
        "engagement": 80
      }
    ]
  }
}
```

## 2. Venues & Claims

### GET `/venue-owner/venues`
```json
{
  "success": true,
  "message": "Owned venues fetched successfully",
  "data": [
    {
      "ownershipId": "60d5ecb8b3f2c...",
      "status": "approved",
      "venue": {
        "_id": "6a8564724e...",
        "name": "Thirsty The Soda Shop",
        "address": "DHA Phase 5, Karachi",
        "coverImage": "https://..."
      }
    }
  ],
  "pagination": {
    "itemsPerPage": 10,
    "currentPage": 1,
    "totalItems": 1,
    "totalPages": 1
  }
}
```

### POST `/venue-owner/claim`
```json
{
  "success": true,
  "message": "Venue claim submitted",
  "data": {
    "user": "6a8d4f0a...",
    "venue": "6a856472...",
    "status": "pending",
    "claimedAt": "2026-08-26T12:00:00.000Z"
  }
}
```

## 3. Events

### GET `/venue-owner/events`
```json
{
  "success": true,
  "message": "Events fetched",
  "data": [
    {
      "_id": "6a8ed372...",
      "title": "Ladies Night",
      "description": "Special night with free drinks for ladies",
      "startAt": "2026-08-10T20:00:00.000Z",
      "endAt": "2026-08-11T02:00:00.000Z",
      "status": "published",
      "views": 450,
      "isBoosted": true,
      "activeBoosts": 1,
      "organicPerformance": 345
    }
  ],
  "pagination": {
    "itemsPerPage": 10,
    "currentPage": 1,
    "totalItems": 1,
    "totalPages": 1
  }
}
```

### POST `/venue-owner/events`
```json
{
  "success": true,
  "message": "Event created",
  "data": {
    "_id": "6a8ed372...",
    "title": "Ladies Night",
    "venue": "6a856472...",
    "status": "draft"
  }
}
```

## 4. Event Boosting

### GET `/venue-owner/boosts`
```json
{
  "success": true,
  "message": "Boosts fetched",
  "data": [
    {
      "_id": "6a8ed372...",
      "title": "Ladies Night",
      "startAt": "2026-08-10T20:00:00.000Z",
      "endAt": "2026-08-11T02:00:00.000Z",
      "views": 1500,
      "isBoosted": true,
      "organicPerformance": 345,
      "boostDetails": {
        "_id": "6a8ed385...",
        "status": "active",
        "amount": 19.99
      }
    }
  ],
  "pagination": {
    "itemsPerPage": 10,
    "currentPage": 1,
    "totalItems": 1,
    "totalPages": 1
  },
  "totalReach": 25000,
  "avgBoostedReach": 5000,
  "attendRateLift": 25,
  "roiVsOrganic": 3.2,
  "totalEvents": 15,
  "boostedEvents": 3
}
```

### POST `/venue-owner/boosts/:id/checkout`
```json
{
  "success": true,
  "message": "Boost activated",
  "data": {
    "_id": "6a8ed385...",
    "status": "active",
    "stripePaymentId": "manual_1693050201000"
  }
}
```

## 5. Promotions

### GET `/venue-owner/promotions`
```json
{
  "success": true,
  "message": "Promotions fetched",
  "data": [
    {
      "_id": "6a8ed399...",
      "title": "Happy Hour 50% Off",
      "status": "active",
      "startAt": "2026-08-10T16:00:00.000Z",
      "endAt": "2026-08-10T20:00:00.000Z"
    }
  ],
  "pagination": {
    "itemsPerPage": 10,
    "currentPage": 1,
    "totalItems": 1,
    "totalPages": 1
  }
}
```

## 6. Profile & Notifications

### GET `/venue-owner/profile`
```json
{
  "success": true,
  "message": "Profile updated",
  "data": {
    "id": "6a8d4f0a...",
    "name": "John Doe",
    "email": "owner@bar.com",
    "role": "bar_owner",
    "isProfileCompleted": true
  }
}
```

### GET `/venue-owner/notifications`
```json
{
  "success": true,
  "message": "Notifications fetched",
  "data": [
    {
      "_id": "6a8ed500...",
      "isRead": false,
      "notificationContent": {
        "title": "Claim Approved",
        "body": "Your venue claim for Thirsty The Soda Shop has been approved."
      },
      "createdAt": "2026-08-26T12:00:00.000Z"
    }
  ],
  "pagination": {
    "itemsPerPage": 10,
    "currentPage": 1,
    "totalItems": 1,
    "totalPages": 1
  }
}
```

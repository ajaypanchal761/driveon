# Guarantor Points System - Complete Test Plan

## Test Environment Setup

### Prerequisites
1. Backend server running on port 5000
2. Frontend server running
3. MongoDB database connected
4. Postman or similar API testing tool
5. At least 3 test users (1 booking user + 2 guarantors)

---

## Test Scenario 1: Basic Points Allocation (Single Guarantor)

### Step 1: Create Booking
**Endpoint:** `POST /api/bookings`
**Headers:** `Authorization: Bearer <user_token>`
**Body:**
```json
{
  "carId": "<car_id>",
  "tripStart": {
    "location": "Indore",
    "date": "2025-01-20",
    "time": "10:00"
  },
  "tripEnd": {
    "location": "Indore",
    "date": "2025-01-22",
    "time": "18:00"
  },
  "paymentOption": "full"
}
```

**Expected:** Booking created with `bookingId` and `_id`

### Step 2: Admin Adds Guarantor
**Endpoint:** `POST /api/admin/guarantor-requests`
**Headers:** `Authorization: Bearer <admin_token>`
**Body:**
```json
{
  "bookingId": "<booking_mongodb_id>",
  "guarantorId": "<guarantor_id_1>"
}
```

**Expected:** 
- Status: 201
- Response: `{ success: true, message: "Guarantor request sent successfully" }`

### Step 3: Guarantor Accepts Request
**Endpoint:** `POST /api/user/guarantor-requests/<request_id>/accept`
**Headers:** `Authorization: Bearer <guarantor_1_token>`

**Expected:**
- Status: 200
- Points calculated: 10% of booking amount
- Points allocated to guarantor

### Step 4: Verify Points Allocation
**Endpoint:** `GET /api/user/guarantor-points`
**Headers:** `Authorization: Bearer <guarantor_1_token>`

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "points": 100,  // If booking was ₹1000
    "activePoints": 100,
    "totalPointsEarned": 100,
    "history": [
      {
        "id": "...",
        "bookingId": "...",
        "userName": "...",
        "bookingAmount": 1000,
        "totalPoolAmount": 100,
        "totalGuarantors": 1,
        "pointsEarned": 100,
        "status": "active",
        "bookingStatus": "pending"
      }
    ]
  }
}
```

**Verification:**
- ✅ Points = 10% of booking amount
- ✅ totalGuarantors = 1
- ✅ pointsEarned = totalPoolAmount (since only 1 guarantor)

---

## Test Scenario 2: Dynamic Calculation (Multiple Guarantors)

### Step 1: Create Booking (₹1000)
Same as Scenario 1, Step 1

### Step 2: Admin Adds First Guarantor
**Endpoint:** `POST /api/admin/guarantor-requests`
**Body:**
```json
{
  "bookingId": "<booking_id>",
  "guarantorId": "<guarantor_1_id>"
}
```

### Step 3: First Guarantor Accepts
**Endpoint:** `POST /api/user/guarantor-requests/<request_1_id>/accept`
**Headers:** `Authorization: Bearer <guarantor_1_token>`

**Expected:**
- Points allocated: ₹100 (10% of ₹1000)
- Guarantor 1 balance: ₹100

### Step 4: Admin Adds Second Guarantor
**Endpoint:** `POST /api/admin/guarantor-requests`
**Body:**
```json
{
  "bookingId": "<same_booking_id>",
  "guarantorId": "<guarantor_2_id>"
}
```

### Step 5: Second Guarantor Accepts
**Endpoint:** `POST /api/user/guarantor-requests/<request_2_id>/accept`
**Headers:** `Authorization: Bearer <guarantor_2_token>`

**Expected:**
- Points recalculated: ₹100 / 2 = ₹50 each
- Guarantor 1 balance updated: ₹50 (₹100 - ₹50)
- Guarantor 2 balance: ₹50

### Step 6: Verify Dynamic Recalculation
**Check Guarantor 1 Points:**
**Endpoint:** `GET /api/user/guarantor-points`
**Headers:** `Authorization: Bearer <guarantor_1_token>`

**Expected:**
```json
{
  "data": {
    "points": 50,
    "history": [{
      "pointsEarned": 50,
      "totalGuarantors": 2,
      "totalPoolAmount": 100
    }]
  }
}
```

**Check Guarantor 2 Points:**
**Endpoint:** `GET /api/user/guarantor-points`
**Headers:** `Authorization: Bearer <guarantor_2_token>`

**Expected:**
```json
{
  "data": {
    "points": 50,
    "history": [{
      "pointsEarned": 50,
      "totalGuarantors": 2
    }]
  }
}
```

**Verification:**
- ✅ Both guarantors have ₹50 each
- ✅ Total pool: ₹100 (10% of ₹1000)
- ✅ Points divided equally: ₹50 + ₹50 = ₹100

---

## Test Scenario 3: Maximum 5 Guarantors Limit

### Step 1-5: Add 5 Guarantors
Add 5 guarantors one by one using:
**Endpoint:** `POST /api/admin/guarantor-requests`

### Step 6: Try Adding 6th Guarantor
**Endpoint:** `POST /api/admin/guarantor-requests`
**Body:**
```json
{
  "bookingId": "<booking_id>",
  "guarantorId": "<guarantor_6_id>"
}
```

**Expected:**
- Status: 400
- Message: "Maximum 5 guarantors can be linked to a booking. This booking already has 5 guarantors."

**Verification:**
- ✅ 6th guarantor cannot be added
- ✅ Error message is clear

---

## Test Scenario 4: Points Reversal on Cancellation

### Step 1: Setup Booking with Guarantors
- Create booking (₹1000)
- Add 2 guarantors
- Both accept (each gets ₹50)

### Step 2: Verify Initial Points
**Check both guarantors have ₹50 each**

### Step 3: Cancel Booking (User)
**Endpoint:** `PATCH /api/bookings/<booking_id>/status`
**Headers:** `Authorization: Bearer <user_token>`
**Body:**
```json
{
  "status": "cancelled",
  "cancellationReason": "User cancelled"
}
```

**Expected:**
- Status: 200
- Booking status: "cancelled"

### Step 4: Verify Points Reversal
**Check Guarantor 1:**
**Endpoint:** `GET /api/user/guarantor-points`
**Headers:** `Authorization: Bearer <guarantor_1_token>`

**Expected:**
```json
{
  "data": {
    "points": 0,  // ₹50 reversed
    "history": [{
      "pointsEarned": 50,
      "status": "reversed",
      "reversedAt": "...",
      "reversalReason": "User cancelled"
    }]
  }
}
```

**Check Guarantor 2:**
Same verification - points should be 0

**Verification:**
- ✅ Both guarantors' points reversed
- ✅ Points balance = 0
- ✅ History shows status: "reversed"
- ✅ Reversal reason recorded

### Step 5: Cancel Booking (Admin)
Repeat with admin cancellation:
**Endpoint:** `PATCH /api/admin/bookings/<booking_id>`
**Headers:** `Authorization: Bearer <admin_token>`
**Body:**
```json
{
  "status": "cancelled",
  "cancellationReason": "Admin cancelled"
}
```

**Expected:** Same reversal behavior

---

## Test Scenario 5: Admin View Guarantor Points

### Step 1: Setup
- Booking with guarantors and points allocated

### Step 2: Get Booking Guarantor Points
**Endpoint:** `GET /api/admin/bookings/<booking_id>/guarantor-points`
**Headers:** `Authorization: Bearer <admin_token>`

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "bookingId": "...",
    "bookingAmount": 1000,
    "totalPoolAmount": 100,
    "totalGuarantors": 2,
    "activeGuarantors": 2,
    "totalAllocated": 100,
    "totalReversed": 0,
    "guarantors": [
      {
        "guarantorName": "...",
        "guarantorEmail": "...",
        "pointsAllocated": 50,
        "status": "active",
        "totalGuarantors": 2
      },
      {
        "guarantorName": "...",
        "pointsAllocated": 50,
        "status": "active"
      }
    ]
  }
}
```

**Verification:**
- ✅ Admin can see all guarantors
- ✅ Points per guarantor visible
- ✅ Total pool amount shown
- ✅ Status of each guarantor visible

---

## Test Scenario 6: Edge Cases

### Test 6.1: Accept Request for Cancelled Booking
1. Create booking
2. Add guarantor
3. Cancel booking
4. Try to accept request

**Expected:**
- Status: 400
- Message: "Cannot accept guarantor request for cancelled booking"

### Test 6.2: Points Calculation with Odd Amounts
**Booking:** ₹999
**Expected Pool:** ₹99.9 → ₹100 (rounded)
**2 Guarantors:** ₹50 each

### Test 6.3: Multiple Bookings
- Create 3 bookings
- Add guarantors to each
- Verify points accumulate correctly

### Test 6.4: Reject Request
- Add guarantor
- Reject request
- Verify no points allocated

---

## Frontend Testing

### Test 1: Guarantor Points Page
1. Login as guarantor
2. Navigate to Guarantor page
3. Check points wallet section

**Expected:**
- ✅ Points balance displayed
- ✅ Points history shown
- ✅ Transaction details visible
- ✅ Reversed points marked

### Test 2: Points History Display
**Verify:**
- ✅ Booking ID shown
- ✅ User name shown
- ✅ Points earned shown
- ✅ Date formatted correctly
- ✅ Status badges (active/reversed)
- ✅ Reversal reason (if reversed)

### Test 3: Admin Booking Details
1. Login as admin
2. View booking details
3. Check guarantor points section

**Expected:**
- ✅ Guarantor points visible
- ✅ Points breakdown shown
- ✅ All guarantors listed

---

## Database Verification

### Check GuarantorPoints Collection
```javascript
// MongoDB Query
db.guarantorpoints.find({ booking: ObjectId("...") })
```

**Verify:**
- ✅ Records created for each guarantor
- ✅ Points allocated correctly
- ✅ Status updated on reversal
- ✅ Timestamps correct

### Check User Collection
```javascript
// MongoDB Query
db.users.find({ _id: ObjectId("<guarantor_id>") })
```

**Verify:**
- ✅ Points balance updated
- ✅ totalPointsEarned updated

---

## Performance Testing

### Test: Multiple Guarantors Accept Simultaneously
1. Add 5 guarantors
2. All accept within 1 second
3. Verify all points calculated correctly

**Expected:**
- ✅ No race conditions
- ✅ All points allocated correctly
- ✅ Final division correct

---

## Summary Checklist

- [ ] Single guarantor points allocation
- [ ] Multiple guarantors dynamic calculation
- [ ] Maximum 5 guarantors limit
- [ ] Points reversal on cancellation
- [ ] Admin view guarantor points
- [ ] Frontend points display
- [ ] Edge cases handled
- [ ] Database records correct
- [ ] API responses correct
- [ ] Error handling working

---

## Postman Collection Structure

```
Guarantor Points Tests/
├── 1. Create Booking
├── 2. Admin Add Guarantor 1
├── 3. Guarantor 1 Accept
├── 4. Verify Points (Guarantor 1)
├── 5. Admin Add Guarantor 2
├── 6. Guarantor 2 Accept
├── 7. Verify Points (Both Guarantors)
├── 8. Cancel Booking
├── 9. Verify Points Reversal
├── 10. Admin View Points
└── 11. Get User Points (Frontend)
```

---

## Expected Results Summary

| Scenario | Expected Result | Status |
|----------|----------------|--------|
| Single Guarantor | 10% points allocated | ✅ |
| 2 Guarantors | 10% / 2 = 5% each | ✅ |
| 5 Guarantors | 10% / 5 = 2% each | ✅ |
| 6th Guarantor | Error: Max limit | ✅ |
| Cancellation | All points reversed | ✅ |
| Admin View | All points visible | ✅ |
| Frontend Display | Points shown correctly | ✅ |


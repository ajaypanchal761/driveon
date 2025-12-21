# Guarantor Points System - Step by Step Testing Guide

## 🚀 पूरा System Test करने का Step-by-Step Guide

---

## 📋 Prerequisites (पहले ये करें)

### 1. Backend Start करें
```bash
cd backend
npm install  # अगर पहली बार
npm run dev  # या npm start
```
**Check:** `http://localhost:5000` पर server चल रहा हो

### 2. Frontend Start करें
```bash
cd frontend
npm install  # अगर पहली बार
npm start
```
**Check:** `http://localhost:3000` पर frontend खुल रहा हो

### 3. MongoDB Check करें
- Database connected होना चाहिए
- Collections create होने चाहिए

### 4. Test Users तैयार करें
आपको चाहिए:
- 1 User (जो booking करेगा)
- 2-3 Guarantors (जो guarantor बनेंगे)
- 1 Admin (जो guarantors add करेगा)

---

## 🧪 TEST 1: Basic Flow - Single Guarantor

### Step 1.1: User Login करें
1. Frontend खोलें: `http://localhost:3000`
2. User account se login करें
3. Token save करें (Postman के लिए)

### Step 1.2: Booking Create करें
**Postman में:**
```
POST http://localhost:5000/api/bookings
Headers:
  Authorization: Bearer <user_token>
  Content-Type: application/json

Body (JSON):
{
  "carId": "<car_mongodb_id>",
  "tripStart": {
    "location": "Indore",
    "date": "2025-01-25",
    "time": "10:00"
  },
  "tripEnd": {
    "location": "Indore",
    "date": "2025-01-27",
    "time": "18:00"
  },
  "paymentOption": "full"
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "booking": {
      "_id": "<booking_id>",
      "bookingId": "BK123456",
      "pricing": {
        "finalPrice": 1000,
        "totalPrice": 1000
      }
    }
  }
}
```

**✅ Save करें:**
- `booking._id` (MongoDB ID)
- `booking.bookingId`
- `booking.pricing.finalPrice` (₹1000 मान लें)

---

### Step 1.3: Admin Login करें
1. Admin account se login करें
2. Admin token save करें

### Step 1.4: Guarantor 1 का ID लें
**Guarantor 1 login करें और:**
1. Profile page जाएं
2. Guarantor ID copy करें (जैसे: `GURN123456ABC`)
3. Guarantor 1 का token भी save करें

### Step 1.5: Admin Guarantor Add करे
**Postman में:**
```
POST http://localhost:5000/api/admin/guarantor-requests
Headers:
  Authorization: Bearer <admin_token>
  Content-Type: application/json

Body (JSON):
{
  "bookingId": "<booking_mongodb_id>",
  "guarantorId": "GURN123456ABC"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Guarantor request sent successfully",
  "data": {
    "request": {
      "_id": "<request_id>",
      "status": "pending"
    }
  }
}
```

**✅ Save करें:**
- `request._id` (request ID)

---

### Step 1.6: Guarantor 1 Request Accept करे
**Postman में:**
```
POST http://localhost:5000/api/user/guarantor-requests/<request_id>/accept
Headers:
  Authorization: Bearer <guarantor_1_token>
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Guarantor request accepted successfully"
}
```

**✅ Check करें:**
- Server logs में points calculation दिखना चाहिए
- Console में: `💰 Calculating guarantor points`

---

### Step 1.7: Guarantor 1 के Points Check करें
**Postman में:**
```
GET http://localhost:5000/api/user/guarantor-points
Headers:
  Authorization: Bearer <guarantor_1_token>
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "points": 100,  // ₹1000 का 10% = ₹100
    "activePoints": 100,
    "totalPointsEarned": 100,
    "history": [
      {
        "id": "...",
        "bookingId": "BK123456",
        "userName": "User Name",
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

**✅ Verification:**
- `points` = ₹100 (10% of ₹1000) ✅
- `totalGuarantors` = 1 ✅
- `pointsEarned` = ₹100 ✅

---

## 🧪 TEST 2: Dynamic Calculation - 2 Guarantors

### Step 2.1: Guarantor 2 का ID लें
1. Guarantor 2 login करें
2. Guarantor ID copy करें
3. Guarantor 2 token save करें

### Step 2.2: Admin Second Guarantor Add करे
**Postman में:**
```
POST http://localhost:5000/api/admin/guarantor-requests
Headers:
  Authorization: Bearer <admin_token>
  Content-Type: application/json

Body (JSON):
{
  "bookingId": "<same_booking_id>",
  "guarantorId": "<guarantor_2_id>"
}
```

**✅ Save करें:**
- `request_2_id`

---

### Step 2.3: Guarantor 2 Request Accept करे
**Postman में:**
```
POST http://localhost:5000/api/user/guarantor-requests/<request_2_id>/accept
Headers:
  Authorization: Bearer <guarantor_2_token>
```

**Expected:**
- Server logs में recalculation दिखना चाहिए
- Console: `✅ Updated points for existing guarantor`

---

### Step 2.4: Guarantor 1 के Updated Points Check करें
**Postman में:**
```
GET http://localhost:5000/api/user/guarantor-points
Headers:
  Authorization: Bearer <guarantor_1_token>
```

**Expected Response:**
```json
{
  "data": {
    "points": 50,  // Updated from ₹100 to ₹50
    "history": [{
      "pointsEarned": 50,  // Updated
      "totalGuarantors": 2,  // Updated
      "totalPoolAmount": 100
    }]
  }
}
```

**✅ Verification:**
- Points reduced: ₹100 → ₹50 ✅
- `totalGuarantors` = 2 ✅
- `pointsEarned` = ₹50 ✅

---

### Step 2.5: Guarantor 2 के Points Check करें
**Postman में:**
```
GET http://localhost:5000/api/user/guarantor-points
Headers:
  Authorization: Bearer <guarantor_2_token>
```

**Expected Response:**
```json
{
  "data": {
    "points": 50,  // Same as Guarantor 1
    "history": [{
      "pointsEarned": 50,
      "totalGuarantors": 2
    }]
  }
}
```

**✅ Verification:**
- Both guarantors have ₹50 each ✅
- Total = ₹100 (10% of ₹1000) ✅
- Equal division working ✅

---

## 🧪 TEST 3: Maximum 5 Guarantors Limit

### Step 3.1: 3 More Guarantors Add करें
Repeat Step 2.2 for guarantors 3, 4, 5

### Step 3.2: Try 6th Guarantor Add करना
**Postman में:**
```
POST http://localhost:5000/api/admin/guarantor-requests
Headers:
  Authorization: Bearer <admin_token>
  Content-Type: application/json

Body (JSON):
{
  "bookingId": "<booking_id>",
  "guarantorId": "<guarantor_6_id>"
}
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Maximum 5 guarantors can be linked to a booking. This booking already has 5 guarantors."
}
```

**✅ Verification:**
- Status: 400 ✅
- Error message clear ✅
- 6th guarantor cannot be added ✅

---

## 🧪 TEST 4: Points Reversal on Cancellation

### Step 4.1: Current Points Note करें
**Guarantor 1:**
```
GET /api/user/guarantor-points
→ Note: points = ₹50 (or current amount)
```

**Guarantor 2:**
```
GET /api/user/guarantor-points
→ Note: points = ₹50 (or current amount)
```

---

### Step 4.2: Booking Cancel करें (User)
**Postman में:**
```
PATCH http://localhost:5000/api/bookings/<booking_id>/status
Headers:
  Authorization: Bearer <user_token>
  Content-Type: application/json

Body (JSON):
{
  "status": "cancelled",
  "cancellationReason": "Test cancellation"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Booking status updated",
  "data": {
    "booking": {
      "status": "cancelled"
    }
  }
}
```

**✅ Check Server Logs:**
- Console में: `🔄 Reversing guarantor points`
- Console में: `✅ Points reversed` (for each guarantor)

---

### Step 4.3: Guarantor 1 के Points Check करें
**Postman में:**
```
GET http://localhost:5000/api/user/guarantor-points
Headers:
  Authorization: Bearer <guarantor_1_token>
```

**Expected Response:**
```json
{
  "data": {
    "points": 0,  // ₹50 reversed
    "history": [{
      "pointsEarned": 50,
      "status": "reversed",  // ✅ Changed
      "reversedAt": "2025-01-20T...",
      "reversalReason": "Test cancellation"
    }]
  }
}
```

**✅ Verification:**
- Points = 0 (reversed) ✅
- Status = "reversed" ✅
- Reversal reason saved ✅

---

### Step 4.4: Guarantor 2 के Points Check करें
Same check - points should be 0

**✅ Verification:**
- Both guarantors' points reversed ✅
- Status shows "reversed" ✅

---

## 🧪 TEST 5: Admin View Guarantor Points

### Step 5.1: Admin Booking Points देखे
**Postman में:**
```
GET http://localhost:5000/api/admin/bookings/<booking_id>/guarantor-points
Headers:
  Authorization: Bearer <admin_token>
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "bookingId": "BK123456",
    "bookingAmount": 1000,
    "totalPoolAmount": 100,
    "totalGuarantors": 2,
    "activeGuarantors": 0,  // All reversed
    "totalAllocated": 100,
    "totalReversed": 100,
    "guarantors": [
      {
        "guarantorName": "Guarantor 1",
        "guarantorEmail": "...",
        "pointsAllocated": 50,
        "status": "reversed"
      },
      {
        "guarantorName": "Guarantor 2",
        "pointsAllocated": 50,
        "status": "reversed"
      }
    ]
  }
}
```

**✅ Verification:**
- All guarantors visible ✅
- Points per guarantor shown ✅
- Status visible ✅
- Total pool amount shown ✅

---

## 🧪 TEST 6: Frontend Testing

### Step 6.1: Guarantor Login करें
1. Frontend: `http://localhost:3000`
2. Guarantor account se login
3. Navigate to: Guarantor page (या `/module/guarantor`)

### Step 6.2: Points Wallet Check करें
**Expected:**
- ✅ Points balance displayed
- ✅ "Guarantor Points Wallet" section visible
- ✅ Points amount shown (actual from API)

### Step 6.3: Points History Check करें
**Expected:**
- ✅ History section visible
- ✅ Transaction list shown
- ✅ Each transaction shows:
  - Booking ID
  - User name
  - Points earned
  - Date
  - Status (active/reversed)

### Step 6.4: Reversed Points Check करें
**Expected:**
- ✅ Reversed transactions marked
- ✅ Reversal reason shown (if available)
- ✅ Status badge shows "Reversed"

---

## 🧪 TEST 7: Edge Cases

### Test 7.1: Cancelled Booking Request Accept
1. Create booking
2. Cancel booking
3. Add guarantor
4. Try to accept request

**Expected:**
- Status: 400
- Message: "Cannot accept guarantor request for cancelled booking"

### Test 7.2: Odd Amount Calculation
**Booking:** ₹999
**Expected:**
- Pool: ₹99.9 → ₹100 (rounded)
- 2 Guarantors: ₹50 each

### Test 7.3: Multiple Bookings
1. Create 3 different bookings
2. Add guarantors to each
3. Check points accumulate correctly

---

## 📊 Expected Results Summary

| Test | Expected Result | Status |
|------|----------------|--------|
| Single Guarantor | ₹100 points (10%) | ✅ |
| 2 Guarantors | ₹50 each (equal) | ✅ |
| 5 Guarantors | ₹20 each | ✅ |
| 6th Guarantor | Error: Max limit | ✅ |
| Cancellation | All points reversed | ✅ |
| Admin View | All points visible | ✅ |
| Frontend Display | Points shown correctly | ✅ |

---

## 🐛 Troubleshooting

### Issue 1: Points Not Allocated
**Check:**
- Booking has `pricing.finalPrice` or `pricing.totalPrice`
- Server logs में calculation दिख रहा है?
- Database में `GuarantorPoints` record create हुआ?

### Issue 2: Recalculation Not Working
**Check:**
- Server logs में "Updated points for existing guarantor" दिख रहा है?
- Database में existing guarantors के records हैं?

### Issue 3: Points Not Reversed
**Check:**
- Server logs में "Reversing guarantor points" दिख रहा है?
- Booking status = "cancelled"?
- Points records status = "active" before cancellation?

### Issue 4: Frontend Not Showing Points
**Check:**
- API call successful?
- Browser console में errors?
- Network tab में response check करें

---

## ✅ Final Checklist

- [ ] Single guarantor points allocated correctly
- [ ] 2 guarantors get equal points
- [ ] Dynamic recalculation works
- [ ] Max 5 guarantors limit enforced
- [ ] Points reversed on cancellation
- [ ] Admin can view all points
- [ ] Frontend displays points correctly
- [ ] History shows all transactions
- [ ] Reversed points marked correctly
- [ ] All edge cases handled

---

## 🎯 Success Criteria

System working correctly if:
- ✅ All test scenarios pass
- ✅ Points calculated correctly
- ✅ Dynamic recalculation works
- ✅ Reversal works on cancellation
- ✅ Admin can view points
- ✅ Frontend displays correctly
- ✅ No errors in console/logs

---

## 📝 Notes

- Points are rounded using `Math.round()`
- Pool is always 10% of booking amount
- Division is equal among all guarantors
- Maximum 5 guarantors enforced
- Cancellation reverses all points
- Points only for active/completed bookings

---

**Happy Testing! 🚀**


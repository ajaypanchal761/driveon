# Guarantor Points System - Step by Step Testing Guide (हिंदी में)

## 🚀 पूरा System Test करने का Complete Guide

---

## 📋 पहले ये Setup करें

### Step 1: Backend Start करें
```bash
# Terminal 1 में
cd backend
npm run dev
```
**Check करें:** `http://localhost:5000` पर server चल रहा हो

### Step 2: Frontend Start करें
```bash
# Terminal 2 में
cd frontend
npm start
```
**Check करें:** `http://localhost:3000` पर frontend खुल रहा हो

### Step 3: Test Users तैयार करें
आपको चाहिए:
- **1 User** (जो booking करेगा)
- **2 Guarantors** (जो guarantor बनेंगे और points मिलेंगे)
- **1 Admin** (जो guarantors add करेगा)

**Note:** अगर users नहीं हैं तो पहले register करें।

---

## 🧪 TEST 1: Single Guarantor - Basic Flow

### Step 1.1: User Login करें
1. Browser में `http://localhost:3000` खोलें
2. User account se login करें
3. **Important:** Browser console open करें (F12) - logs देखने के लिए

### Step 1.2: Booking Create करें
**Option A: Frontend से (आसान)**
1. Home page से कोई car select करें
2. Booking form fill करें:
   - Pickup Date: आज से 2 दिन बाद
   - Drop Date: आज से 4 दिन बाद
   - Payment Option: Full Payment
3. "Proceed to Payment" click करें
4. Payment complete करें
5. **Save करें:** Booking ID (जैसे: BK123456)

**Option B: Postman से (Advanced)**
```
POST http://localhost:5000/api/bookings
Headers:
  Authorization: Bearer <user_token>
  Content-Type: application/json

Body:
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
**Response से save करें:**
- `booking._id` (MongoDB ID)
- `booking.bookingId`
- `booking.pricing.finalPrice` (amount)

---

### Step 1.3: Admin Login करें
1. New tab में `http://localhost:3000/admin/login` खोलें
2. Admin account se login करें
3. Admin dashboard पर जाएं

### Step 1.4: Guarantor 1 का ID लें
1. **Guarantor 1** के account se login करें
2. Profile page जाएं या Guarantor section
3. **Guarantor ID** copy करें (जैसे: `GURN123456ABC`)
4. **Save करें:** Guarantor 1 ID और token

### Step 1.5: Admin Guarantor Add करे
**Frontend से:**
1. Admin panel में "Guarantors" section जाएं
2. Booking find करें (जो Step 1.2 में create की थी)
3. "+ Add Guarantor" button click करें
4. Guarantor ID enter करें (Step 1.4 से)
5. "Send Request" click करें

**Postman से:**
```
POST http://localhost:5000/api/admin/guarantor-requests
Headers:
  Authorization: Bearer <admin_token>
  Content-Type: application/json

Body:
{
  "bookingId": "<booking_mongodb_id>",
  "guarantorId": "GURN123456ABC"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Guarantor request sent successfully"
}
```

**✅ Check करें:**
- Request successfully create हुई
- Request ID save करें

---

### Step 1.6: Guarantor 1 Request Accept करे
**Frontend से:**
1. **Guarantor 1** के account में login करें
2. Guarantor page जाएं (या Profile → Guarantor section)
3. "Guarantor Requests" section में request दिखेगी
4. Request पर click करें
5. "Accept" button click करें
6. Confirm करें

**Postman से:**
```
POST http://localhost:5000/api/user/guarantor-requests/<request_id>/accept
Headers:
  Authorization: Bearer <guarantor_1_token>
```

**✅ Check Backend Terminal:**
आपको ये logs दिखने चाहिए:
```
💰 Calculating guarantor points: {
  bookingAmount: 1000,
  totalPoolAmount: 100,
  totalAcceptedGuarantors: 1,
  pointsPerGuarantor: 100
}
✅ Points allocated: {
  guarantorId: '...',
  pointsAllocated: 100,
  newBalance: 100
}
```

---

### Step 1.7: Guarantor 1 के Points Check करें
**Frontend से:**
1. Guarantor 1 के account में
2. Guarantor page पर जाएं
3. "Guarantor Points Wallet" section देखें
4. **Expected:** Points = ₹100 (अगर booking ₹1000 की थी)

**Postman से:**
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
    "points": 100,
    "activePoints": 100,
    "history": [{
      "bookingId": "BK123456",
      "pointsEarned": 100,
      "totalGuarantors": 1,
      "status": "active"
    }]
  }
}
```

**✅ Verification:**
- Points = ₹100 ✅ (10% of ₹1000)
- `totalGuarantors` = 1 ✅
- Status = "active" ✅

---

## 🧪 TEST 2: Dynamic Calculation - 2 Guarantors

### Step 2.1: Guarantor 2 का ID लें
1. **Guarantor 2** के account se login करें
2. Guarantor ID copy करें
3. **Save करें:** Guarantor 2 ID

### Step 2.2: Admin Second Guarantor Add करे
**Same booking में:**
1. Admin panel में same booking find करें
2. "+ Add Guarantor" click करें
3. **Guarantor 2** का ID enter करें
4. "Send Request" click करें

**Postman:**
```
POST http://localhost:5000/api/admin/guarantor-requests
Body:
{
  "bookingId": "<same_booking_id>",
  "guarantorId": "<guarantor_2_id>"
}
```

---

### Step 2.3: Guarantor 2 Request Accept करे
1. **Guarantor 2** login करें
2. Guarantor Requests में accept करें

**✅ Check Backend Terminal:**
आपको ये logs दिखने चाहिए:
```
💰 Calculating guarantor points: {
  totalAcceptedGuarantors: 2,  // ✅ Updated
  pointsPerGuarantor: 50      // ✅ Recalculated
}
✅ Points allocated: {
  pointsAllocated: 50
}
✅ Updated points for existing guarantor: {  // ✅ RECALCULATION
  oldPoints: 100,
  newPoints: 50,
  difference: -50
}
```

---

### Step 2.4: Guarantor 1 के Updated Points Check करें
**Frontend:**
1. Guarantor 1 login करें
2. Guarantor page पर points check करें

**Postman:**
```
GET http://localhost:5000/api/user/guarantor-points
Headers: Authorization: Bearer <guarantor_1_token>
```

**Expected:**
```json
{
  "data": {
    "points": 50,  // ✅ Updated from ₹100 to ₹50
    "history": [{
      "pointsEarned": 50,  // ✅ Updated
      "totalGuarantors": 2  // ✅ Updated
    }]
  }
}
```

**✅ Verification:**
- Points reduced: ₹100 → ₹50 ✅
- `totalGuarantors` = 2 ✅

---

### Step 2.5: Guarantor 2 के Points Check करें
**Same check:**
```
GET /api/user/guarantor-points
Headers: Authorization: Bearer <guarantor_2_token>
```

**Expected:**
```json
{
  "data": {
    "points": 50,  // ✅ Same as Guarantor 1
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

## 🧪 TEST 3: Points Reversal on Cancellation

### Step 3.1: Current Points Note करें
**Guarantor 1:**
- Current points: ₹50 (note करें)

**Guarantor 2:**
- Current points: ₹50 (note करें)

---

### Step 3.2: Booking Cancel करें
**Frontend से:**
1. User account में login करें
2. Bookings page जाएं
3. Booking find करें
4. "Cancel Booking" click करें
5. Reason enter करें
6. Confirm करें

**Postman से:**
```
PATCH http://localhost:5000/api/bookings/<booking_id>/status
Headers:
  Authorization: Bearer <user_token>
  Content-Type: application/json

Body:
{
  "status": "cancelled",
  "cancellationReason": "Test cancellation"
}
```

**✅ Check Backend Terminal:**
आपको ये logs दिखने चाहिए:
```
🔄 Reversing guarantor points for booking: ...
📊 Found 2 active points records to reverse
✅ Points reversed: {
  guarantorId: '...',
  pointsReversed: 50,
  oldBalance: 50,
  newBalance: 0
}
✅ Points reversed: {
  guarantorId: '...',
  pointsReversed: 50,
  oldBalance: 50,
  newBalance: 0
}
✅ All guarantor points reversed successfully
```

---

### Step 3.3: Guarantor 1 के Points Check करें
**Frontend:**
1. Guarantor 1 login करें
2. Points wallet check करें

**Postman:**
```
GET http://localhost:5000/api/user/guarantor-points
Headers: Authorization: Bearer <guarantor_1_token>
```

**Expected:**
```json
{
  "data": {
    "points": 0,  // ✅ Reversed
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

### Step 3.4: Guarantor 2 के Points Check करें
Same check - points should be 0

**✅ Verification:**
- Both guarantors' points reversed ✅

---

## 🧪 TEST 4: Admin View Guarantor Points

### Step 4.1: Admin Booking Points देखे
**Frontend:**
1. Admin login करें
2. Bookings page जाएं
3. Booking details open करें
4. Guarantor points section check करें

**Postman:**
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
    "guarantors": [
      {
        "guarantorName": "Guarantor 1",
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

---

## 🧪 TEST 5: Maximum 5 Guarantors

### Step 5.1: 5 Guarantors Add करें
1. Same booking में
2. 5 different guarantors add करें
3. सभी accept करवाएं

### Step 5.2: 6th Guarantor Add करने की कोशिश करें
**Expected:**
- Error: "Maximum 5 guarantors can be linked to a booking"
- Status: 400

**✅ Verification:**
- 6th guarantor cannot be added ✅

---

## 📊 Expected Results Summary

| Booking Amount | Guarantors | Pool (10%) | Each Gets |
|----------------|------------|------------|-----------|
| ₹1000 | 1 | ₹100 | ₹100 |
| ₹1000 | 2 | ₹100 | ₹50 |
| ₹1000 | 3 | ₹100 | ₹33 |
| ₹1000 | 5 | ₹100 | ₹20 |

---

## ✅ Complete Checklist

### Backend Testing:
- [ ] Single guarantor points allocated (₹100)
- [ ] 2 guarantors get equal points (₹50 each)
- [ ] Dynamic recalculation works
- [ ] Max 5 guarantors limit enforced
- [ ] Points reversed on cancellation
- [ ] Server logs show all operations

### Frontend Testing:
- [ ] Points balance displayed correctly
- [ ] Points history visible
- [ ] Transaction details shown
- [ ] Reversed points marked
- [ ] Status badges correct

### Admin Testing:
- [ ] Can view all guarantor points
- [ ] Points breakdown visible
- [ ] All guarantors listed

---

## 🐛 Troubleshooting

### Points नहीं मिल रहे?
1. Check: Booking has `pricing.finalPrice`
2. Check: Backend terminal में logs दिख रहे हैं?
3. Check: Database में `GuarantorPoints` record create हुआ?

### Recalculation नहीं हो रहा?
1. Check: Backend terminal में "Updated points" log दिख रहा है?
2. Check: Database में existing guarantor के records हैं?

### Reversal नहीं हो रहा?
1. Check: Backend terminal में "Reversing points" log दिख रहा है?
2. Check: Booking status = "cancelled"?

### Frontend में points नहीं दिख रहे?
1. Check: Browser console में errors?
2. Check: Network tab में API call successful?
3. Check: API response में data है?

---

## 🎯 Quick Test Summary

**Minimum Test (5 minutes):**
1. Create booking
2. Add 1 guarantor → Accept
3. Check points (₹100)
4. Add 2nd guarantor → Accept
5. Check both (₹50 each)
6. Cancel booking
7. Check points (0, reversed)

**Full Test (15 minutes):**
- All above steps
- Add 5 guarantors
- Try 6th (should fail)
- Admin view points
- Frontend display check

---

## 📝 Important Notes

- Points are **rounded** using `Math.round()`
- Pool is **always 10%** of booking amount
- Division is **equal** among all guarantors
- Maximum **5 guarantors** per booking
- Cancellation **reverses all points**
- Points only for **active/completed** bookings

---

**Happy Testing! 🚀**

Test करें और बताएं कि सब काम कर रहा है या नहीं!


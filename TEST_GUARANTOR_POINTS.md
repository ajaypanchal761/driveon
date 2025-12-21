# Guarantor Points System - Quick Test Guide

## 🚀 Quick Start Testing

### Prerequisites
1. Backend running: `npm run dev` (port 5000)
2. Frontend running: `npm start`
3. MongoDB connected
4. Postman installed

---

## 📋 Test Flow (Step by Step)

### **Test 1: Single Guarantor - Basic Flow**

#### Step 1.1: Create Booking
```bash
POST http://localhost:5000/api/bookings
Headers: Authorization: Bearer <user_token>
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
**Save:** `booking_id` from response

#### Step 1.2: Admin Adds Guarantor
```bash
POST http://localhost:5000/api/admin/guarantor-requests
Headers: Authorization: Bearer <admin_token>
Body:
{
  "bookingId": "<booking_mongodb_id>",
  "guarantorId": "<guarantor_id_1>"
}
```
**Save:** `request_id` from response

#### Step 1.3: Guarantor Accepts
```bash
POST http://localhost:5000/api/user/guarantor-requests/<request_id>/accept
Headers: Authorization: Bearer <guarantor_1_token>
```

#### Step 1.4: Check Points
```bash
GET http://localhost:5000/api/user/guarantor-points
Headers: Authorization: Bearer <guarantor_1_token>
```

**Expected:**
- `points` = 10% of booking amount
- `history[0].pointsEarned` = same as points
- `history[0].totalGuarantors` = 1

---

### **Test 2: Dynamic Calculation - 2 Guarantors**

#### Step 2.1: Use Same Booking from Test 1

#### Step 2.2: Admin Adds Second Guarantor
```bash
POST http://localhost:5000/api/admin/guarantor-requests
Headers: Authorization: Bearer <admin_token>
Body:
{
  "bookingId": "<same_booking_id>",
  "guarantorId": "<guarantor_id_2>"
}
```

#### Step 2.3: Second Guarantor Accepts
```bash
POST http://localhost:5000/api/user/guarantor-requests/<request_2_id>/accept
Headers: Authorization: Bearer <guarantor_2_token>
```

#### Step 2.4: Verify Both Guarantors
**Check Guarantor 1:**
```bash
GET http://localhost:5000/api/user/guarantor-points
Headers: Authorization: Bearer <guarantor_1_token>
```
**Expected:** Points reduced to 50% of original

**Check Guarantor 2:**
```bash
GET http://localhost:5000/api/user/guarantor-points
Headers: Authorization: Bearer <guarantor_2_token>
```
**Expected:** Points = same as Guarantor 1

**Verification:**
- ✅ Both have equal points
- ✅ Total = 10% of booking
- ✅ `totalGuarantors` = 2 in history

---

### **Test 3: Maximum 5 Guarantors**

#### Step 3.1: Add 5 Guarantors
Repeat Step 2.2 five times with different guarantor IDs

#### Step 3.2: Try 6th Guarantor
```bash
POST http://localhost:5000/api/admin/guarantor-requests
Body:
{
  "bookingId": "<booking_id>",
  "guarantorId": "<guarantor_6_id>"
}
```

**Expected:**
- Status: 400
- Message: "Maximum 5 guarantors can be linked..."

---

### **Test 4: Points Reversal on Cancellation**

#### Step 4.1: Setup
- Booking with 2 guarantors (both accepted)
- Both have points allocated

#### Step 4.2: Cancel Booking
```bash
PATCH http://localhost:5000/api/bookings/<booking_id>/status
Headers: Authorization: Bearer <user_token>
Body:
{
  "status": "cancelled",
  "cancellationReason": "Test cancellation"
}
```

#### Step 4.3: Verify Reversal
**Check Both Guarantors:**
```bash
GET http://localhost:5000/api/user/guarantor-points
```

**Expected:**
- `points` = 0 (or reduced by allocated amount)
- `history[0].status` = "reversed"
- `history[0].reversalReason` = "Test cancellation"

---

### **Test 5: Admin View Points**

#### Step 5.1: Get Booking Points
```bash
GET http://localhost:5000/api/admin/bookings/<booking_id>/guarantor-points
Headers: Authorization: Bearer <admin_token>
```

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
    "guarantors": [
      {
        "guarantorName": "...",
        "pointsAllocated": 50,
        "status": "active"
      }
    ]
  }
}
```

---

## 🔍 Frontend Testing

### Test 1: Guarantor Points Page
1. Login as guarantor
2. Navigate to: `/module/guarantor` or Guarantor section
3. Check:
   - ✅ Points balance displayed
   - ✅ Points history visible
   - ✅ Transaction details shown
   - ✅ Dates formatted correctly

### Test 2: Points History
**Verify:**
- ✅ Booking ID shown
- ✅ User name shown  
- ✅ Points earned amount
- ✅ Status badge (active/reversed)
- ✅ Reversal reason (if reversed)

---

## 🐛 Common Issues to Check

### Issue 1: Points Not Allocated
**Check:**
- Booking has `pricing.finalPrice` or `pricing.totalPrice`
- Guarantor request status = "accepted"
- Booking status ≠ "cancelled"

### Issue 2: Points Not Reversed
**Check:**
- Booking status = "cancelled"
- Points record status = "active" before cancellation
- Check server logs for errors

### Issue 3: Dynamic Calculation Not Working
**Check:**
- All guarantors accepted
- Points recalculated for existing guarantors
- Check `totalGuarantors` in history

---

## 📊 Expected Results Table

| Booking Amount | Guarantors | Pool (10%) | Each Gets |
|----------------|------------|------------|-----------|
| ₹1000 | 1 | ₹100 | ₹100 |
| ₹1000 | 2 | ₹100 | ₹50 |
| ₹1000 | 3 | ₹100 | ₹33 |
| ₹1000 | 4 | ₹100 | ₹25 |
| ₹1000 | 5 | ₹100 | ₹20 |

---

## ✅ Final Verification Checklist

- [ ] Single guarantor gets 10% points
- [ ] 2 guarantors get 5% each (equal division)
- [ ] 5 guarantors get 2% each
- [ ] 6th guarantor cannot be added
- [ ] Points reversed on cancellation
- [ ] Admin can view all points
- [ ] Frontend displays points correctly
- [ ] History shows all transactions
- [ ] Reversed points marked correctly

---

## 🚨 Error Scenarios to Test

1. **Accept cancelled booking request**
   - Expected: Error 400, "Cannot accept for cancelled booking"

2. **Add guarantor to cancelled booking**
   - Expected: Should work (request created)
   - But: Points not allocated if booking cancelled

3. **Cancel booking with no guarantors**
   - Expected: No error, no points to reverse

4. **Invalid booking ID**
   - Expected: Error 404, "Booking not found"

5. **Invalid guarantor ID**
   - Expected: Error 404, "Guarantor not found"

---

## 📝 Notes

- Points are rounded using `Math.round()`
- Pool is 10% of `pricing.finalPrice` or `pricing.totalPrice`
- Points only allocated for active/completed bookings
- Cancelled bookings reverse all points automatically
- Maximum 5 guarantors per booking enforced

---

## 🔗 Postman Collection

Create a Postman collection with:
1. Environment variables for tokens
2. All endpoints pre-configured
3. Tests for each scenario
4. Automatic token refresh

---

## 🎯 Success Criteria

System is working correctly if:
- ✅ All test scenarios pass
- ✅ Points calculated correctly
- ✅ Dynamic recalculation works
- ✅ Reversal works on cancellation
- ✅ Admin can view points
- ✅ Frontend displays correctly
- ✅ No errors in console/logs


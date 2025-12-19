# Guarantor Points - Quick Test Reference Card

## 🚀 Quick Start (5 Minutes)

### 1️⃣ Setup
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm start
```

### 2️⃣ Test Users चाहिए
- 1 User (booking करेगा)
- 2 Guarantors (points मिलेंगे)
- 1 Admin (guarantors add करेगा)

---

## 📝 Quick Test Flow

### TEST 1: Single Guarantor (2 minutes)

```
1. POST /api/bookings
   → Save: booking_id

2. POST /api/admin/guarantor-requests
   Body: { bookingId, guarantorId }
   → Save: request_id

3. POST /api/user/guarantor-requests/:id/accept
   → Points allocated

4. GET /api/user/guarantor-points
   → Check: points = 10% of booking
```

**Expected:** ₹1000 booking → ₹100 points ✅

---

### TEST 2: Dynamic Calculation (3 minutes)

```
5. POST /api/admin/guarantor-requests (2nd guarantor)
   → Save: request_2_id

6. POST /api/user/guarantor-requests/:id/accept (2nd)
   → Recalculation happens

7. GET /api/user/guarantor-points (both guarantors)
   → Check: Both have ₹50 each
```

**Expected:** ₹1000 booking → ₹50 each ✅

---

### TEST 3: Cancellation (2 minutes)

```
8. PATCH /api/bookings/:id/status
   Body: { status: "cancelled" }
   → Points reversed

9. GET /api/user/guarantor-points
   → Check: points = 0, status = "reversed"
```

**Expected:** All points reversed ✅

---

## 🎯 Key Endpoints

| Action | Method | Endpoint |
|--------|--------|----------|
| Create Booking | POST | `/api/bookings` |
| Add Guarantor | POST | `/api/admin/guarantor-requests` |
| Accept Request | POST | `/api/user/guarantor-requests/:id/accept` |
| Get Points | GET | `/api/user/guarantor-points` |
| Cancel Booking | PATCH | `/api/bookings/:id/status` |
| Admin View | GET | `/api/admin/bookings/:id/guarantor-points` |

---

## ✅ Expected Results

| Booking | Guarantors | Each Gets |
|---------|------------|-----------|
| ₹1000 | 1 | ₹100 |
| ₹1000 | 2 | ₹50 |
| ₹1000 | 3 | ₹33 |
| ₹1000 | 5 | ₹20 |

---

## 🐛 Quick Fixes

**Points नहीं मिल रहे?**
- Check: Booking has `pricing.finalPrice`
- Check: Server logs में calculation दिख रहा है?

**Recalculation नहीं हो रहा?**
- Check: Server logs में "Updated points" दिख रहा है?
- Check: Database में existing records हैं?

**Reversal नहीं हो रहा?**
- Check: Server logs में "Reversing points" दिख रहा है?
- Check: Booking status = "cancelled"?

---

## 📋 Full Guide

Detailed guide: `STEP_BY_STEP_TESTING_GUIDE.md`

---

**Happy Testing! 🚀**


# Guarantor Points Testing - Quick Start Guide

## 🚀 5 मिनट में Test करें

---

## Step 1: Setup (1 minute)

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm start
```

---

## Step 2: Basic Test (3 minutes)

### 2.1: Booking Create करें
- User login करें
- Car select करें
- Booking complete करें
- **Note:** Booking ID और amount

### 2.2: Guarantor Add करें
- Admin login करें
- Guarantors page → Add Guarantor
- Guarantor ID enter करें
- Request send करें

### 2.3: Guarantor Accept करे
- Guarantor login करें
- Guarantor Requests → Accept
- **Check:** Points मिले (10% of booking)

### 2.4: Points Verify करें
- Guarantor page → Points Wallet
- **Expected:** Points = 10% of booking amount

---

## Step 3: Dynamic Test (2 minutes)

### 3.1: 2nd Guarantor Add करें
- Same booking में
- 2nd guarantor add करें
- Accept करवाएं

### 3.2: Check Both Guarantors
- Guarantor 1: Points = 50% of original
- Guarantor 2: Points = 50% of original
- **Expected:** Both have equal points

---

## Step 4: Cancellation Test (1 minute)

### 4.1: Booking Cancel करें
- User login करें
- Booking cancel करें

### 4.2: Check Points
- Both guarantors: Points = 0
- Status = "reversed"

---

## ✅ Success Criteria

- ✅ Single guarantor gets 10% points
- ✅ 2 guarantors get 5% each (equal)
- ✅ Points reversed on cancellation
- ✅ Frontend shows points correctly

---

## 📋 Complete Guide

Detailed guide: `GUARANTOR_POINTS_TESTING_STEPS.md`

---

**Test करें और verify करें! 🎯**


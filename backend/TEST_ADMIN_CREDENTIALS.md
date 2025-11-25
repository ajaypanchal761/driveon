# 🧪 Test Admin Credentials

## ✅ Test Admin Account Created Successfully!

### Login Credentials

```
📧 Email: admin@test.com
🔑 Password: admin123
```

### Admin Details

- **Name**: Test Admin
- **Role**: admin
- **Status**: Active
- **Permissions**: All permissions enabled
  - users.manage, users.view
  - cars.manage, cars.view
  - bookings.manage, bookings.view
  - payments.manage, payments.view
  - kyc.manage, kyc.view
  - reports.view
  - settings.manage

## 🚀 How to Test

### Option 1: Test via Frontend (Recommended)

1. **Start Backend Server**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend Server**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Navigate to Admin Login**:
   - Open browser: `http://localhost:5173/admin/login`
   - Enter credentials:
     - Email: `admin@test.com`
     - Password: `admin123`
   - Click "Login"

### Option 2: Test via API (Using curl or Postman)

1. **Start Backend Server**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Test Login API**:
   ```bash
   curl -X POST http://localhost:5000/api/admin/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@test.com",
       "password": "admin123"
     }'
   ```

3. **Expected Response**:
   ```json
   {
     "success": true,
     "message": "Login successful",
     "data": {
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
       "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
       "admin": {
         "id": "...",
         "name": "Test Admin",
         "email": "admin@test.com",
         "role": "admin",
         "permissions": [...],
         "lastLogin": "..."
       }
     }
   }
   ```

### Option 3: Test via Script

1. **Start Backend Server**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Run Test Script** (in a new terminal):
   ```bash
   cd backend
   npm run test:admin
   ```

## 📝 Scripts Available

### Create Test Admin
```bash
npm run seed:admin
```
- Creates a test admin account if it doesn't exist
- Safe to run multiple times (won't create duplicates)

### Test Admin Login
```bash
npm run test:admin
```
- Tests the admin login API endpoint
- Requires backend server to be running

## ✅ What's Working

1. ✅ **Admin Signup** - `/admin/signup` endpoint working
2. ✅ **Admin Login** - `/admin/login` endpoint working
3. ✅ **JWT Token** - Access token generated on login
4. ✅ **Refresh Token** - Refresh token generated on login
5. ✅ **Token Refresh** - `/admin/refresh-token` endpoint working
6. ✅ **Auto Token Refresh** - API interceptor automatically refreshes expired tokens
7. ✅ **Redirect After Signup** - Redirects to login page after signup

## 🔐 Security Notes

- Test credentials are for **development only**
- Change password in production
- Never commit test credentials to version control
- Use environment variables for production credentials

## 🐛 Troubleshooting

### Issue: "No response from server"
- **Solution**: Make sure backend server is running on port 5000

### Issue: "Invalid email or password"
- **Solution**: Run `npm run seed:admin` to create the test admin account

### Issue: "Token expired"
- **Solution**: The refresh token should automatically refresh. If it fails, login again.

### Issue: "Admin not found"
- **Solution**: Run `npm run seed:admin` to create the test admin account


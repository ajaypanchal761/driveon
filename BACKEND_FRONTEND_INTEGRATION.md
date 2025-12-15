# Backend-Frontend Integration Analysis

## Backend API Structure

### Base Configuration
- **Base URL**: `/api`
- **Port**: `5000` (default) or `process.env.PORT`
- **CORS**: Configured for frontend origin
- **Response Format**: `{ success: boolean, message: string, data: object }`

### Authentication Routes (`/api/auth/*`)

#### 1. Register (POST `/api/auth/register`)
**Request Body:**
```json
{
  "email": "user@example.com",
  "phone": "7610416911",
  "fullName": "User Name",
  "referralCode": "optional"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "phone": "7610416911",
    "email": "user@example.com",
    "otpSent": true
  }
}
```

#### 2. Verify OTP (POST `/api/auth/verify-otp`)
**Request Body:**
```json
{
  "email": "user@example.com",
  "phone": "7610416911",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "data": {
    "token": "jwt_access_token",
    "refreshToken": "jwt_refresh_token",
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "phone": "7610416911",
      "name": "User Name",
      "age": null,
      "gender": null,
      "address": null,
      "profilePhoto": null,
      "role": "user",
      "isEmailVerified": true,
      "isPhoneVerified": true,
      "referralCode": "DRIVEXXXXX",
      "profileComplete": 43
    }
  }
}
```

#### 3. Send Login OTP (POST `/api/auth/send-login-otp`)
**Request Body:**
```json
{
  "emailOrPhone": "user@example.com" // or "7610416911"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "phone": "7610416911",
    "email": "user@example.com",
    "otpSent": true
  }
}
```

### User Routes (`/api/user/*`) - All Require Authentication

#### 1. Get Profile (GET `/api/user/profile`)
**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "_id": "user_id",
      "name": "User Name",
      "email": "user@example.com",
      "phone": "7610416911",
      "age": null,
      "gender": null,
      "address": null,
      "profilePhoto": null,
      "role": "user",
      "isEmailVerified": true,
      "isPhoneVerified": true,
      "referralCode": "DRIVEXXXXX",
      "guarantorId": "GURNXXXXX",
      "profileComplete": 43,
      "createdAt": "2025-12-10T18:54:35.016Z",
      "updatedAt": "2025-12-10T18:54:54.598Z"
    }
  }
}
```

#### 2. Update Profile (PUT `/api/user/profile`)
**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "age": 25,
  "gender": "male",
  "address": "Complete Address"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "Updated Name",
      "email": "user@example.com",
      "phone": "7610416911",
      "age": 25,
      "gender": "male",
      "address": "Complete Address",
      "profilePhoto": null,
      "profileComplete": 71,
      "role": "user",
      "isEmailVerified": true,
      "isPhoneVerified": true,
      "referralCode": "DRIVEXXXXX"
    }
  }
}
```

## Frontend Integration Points

### 1. API Service Layer (`frontend/src/services/auth.service.js`)

**verifyOTP Method:**
```javascript
// Backend returns: { success: true, data: { token, refreshToken, user } }
// Axios wraps: response.data = { success: true, data: { token, refreshToken, user } }
// Service returns: response.data.data = { token, refreshToken, user }
verifyOTP: async (data) => {
  const response = await api.post(API_ENDPOINTS.AUTH.VERIFY_OTP, data);
  if (response.data && response.data.data) {
    return response.data.data; // Returns { token, refreshToken, user }
  }
  return response.data;
}
```

### 2. Register Page (`frontend/src/module/pages/RegisterPage.jsx`)

**After OTP Verification:**
```javascript
const response = await authService.verifyOTP({ phone, email, otp });
// response = { token, refreshToken, user: {...} }

const token = response?.token;
const refreshToken = response?.refreshToken;
const userData = response?.user;

// Store in Redux
dispatch(loginSuccess({ token, refreshToken, userRole: userData?.role }));
dispatch(setUser(userData));

// Redirect to profile page
navigate('/profile/complete', { replace: true });
```

### 3. User Service (`frontend/src/services/user.service.js`)

**getProfile Method:**
```javascript
// Backend returns: { success: true, data: { user: {...} } }
// Axios wraps: response.data = { success: true, data: { user: {...} } }
// Service returns: response.data
getProfile: async () => {
  const response = await api.get(API_ENDPOINTS.USER.PROFILE);
  return response.data; // Returns { success: true, data: { user: {...} } }
}
```

**In Component:**
```javascript
const response = await userService.getProfile();
// response = { success: true, data: { user: {...} } }
const userData = response.data.user; // Extract user object
```

## Authentication Flow

### Signup Flow:
1. User fills registration form → `POST /api/auth/register`
2. OTP sent to phone → SMS via SMS India Hub
3. User enters OTP → `POST /api/auth/verify-otp`
4. Backend returns tokens and user data
5. Frontend stores in Redux and localStorage
6. Redirect to `/profile/complete`

### Login Flow:
1. User enters email/phone → `POST /api/auth/send-login-otp`
2. OTP sent to phone → SMS via SMS India Hub
3. User enters OTP → `POST /api/auth/verify-otp`
4. Backend returns tokens and user data
5. Frontend stores in Redux and localStorage
6. Redirect to intended page or home

### Protected Routes:
- All `/api/user/*` routes require `Authorization: Bearer <token>` header
- Token is verified by `authenticate` middleware
- User object attached to `req.user`

## Key Points

1. **Response Structure**: Always `{ success, message, data }`
2. **Token Storage**: JWT token in `Authorization: Bearer <token>` header
3. **User Data**: Extracted from `response.data.data.user` (verifyOTP) or `response.data.user` (getProfile)
4. **Error Handling**: Check `response.success` and `response.message` for errors
5. **Phone Normalization**: Backend normalizes phone to 10 digits (removes non-digits)


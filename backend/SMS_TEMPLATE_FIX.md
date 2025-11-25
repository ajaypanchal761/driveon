# SMS Template Error Fix Guide

## Current Error
```
ErrorCode: '006'
ErrorMessage: 'error:Invalid template text'
```

## Problem
SMSIndia Hub requires **DLT (Distributed Ledger Technology) registered templates** for transactional SMS in India. Your current message format doesn't match a registered template.

## Solutions

### Solution 1: Register DLT Template (Recommended for Production)

1. **Log in to SMSIndia Hub Dashboard**
   - Go to your SMSIndia Hub account dashboard
   - Navigate to **"DLT Templates"** or **"Template Management"**

2. **Register a New Template**
   - Click **"Add Template"** or **"Register Template"**
   - Template Type: **Transactional**
   - Template Category: **OTP**
   - Template Content: 
     ```
     Your DriveOn OTP is {#} Valid for 10 minutes. Do not share.
     ```
   - Or use a simpler format:
     ```
     Your OTP is {#} for DriveOn registration.
     ```
   - Fill in all required fields (company name, purpose, etc.)
   - Submit for approval (usually takes 24-48 hours)

3. **Get Template ID**
   - Once approved, you'll receive a **Template ID** (also called Principal Entity ID or PEID)
   - Note down this Template ID

4. **Update .env File**
   ```env
   SMSINDIAHUB_TEMPLATE_ID=your_template_id_here
   ```

5. **Restart Backend Server**
   ```bash
   npm run dev
   ```

### Solution 2: Use Promotional SMS (Temporary Workaround)

⚠️ **Warning**: Promotional SMS is not recommended for OTP as it may:
- Have delivery delays
- Be filtered by some carriers
- Not comply with TRAI regulations for OTP

If you need a quick workaround for testing:

1. **Update SMS Service** (temporary change):
   - Change `gwid` parameter from `"2"` (transactional) to `"1"` (promotional)
   - This is in `backend/services/smsIndiaHubService.js` line ~125

2. **Use Simple Message Format**:
   - Keep message simple and under 160 characters
   - Avoid special characters that might cause issues

### Solution 3: Contact SMSIndia Hub Support

1. **Contact Support**
   - Email: support@smsindiahub.in (check their website for correct email)
   - Phone: Check SMSIndia Hub dashboard for support contact

2. **Request Template Registration**
   - Ask them to register a template for your OTP messages
   - Provide your sender ID and message format
   - They can guide you through the DLT registration process

### Solution 4: Use Alternative SMS Provider

If SMSIndia Hub template registration is taking too long, consider:

1. **Twilio** (International, supports India)
2. **MSG91** (India-specific, good DLT support)
3. **TextLocal** (India-specific)
4. **Fast2SMS** (India-specific)

## Current Message Format

The current message format is:
```
Your DriveOn OTP is {OTP}. Valid for 10 minutes. Do not share.
```

## DLT Template Format Requirements

When registering your template, use placeholders:
- `{#}` for OTP code
- `{variable}` for dynamic content
- Keep message under 160 characters
- No special characters that aren't approved

Example approved template format:
```
Your OTP for DriveOn is {#}. Valid for 10 minutes. - DRIVEON
```

## Testing

After registering template:

1. **Test with a real phone number** (not test numbers)
2. **Check SMS delivery** in SMSIndia Hub dashboard
3. **Verify OTP is received** correctly
4. **Check delivery reports** for any issues

## Environment Variables

Add to your `.env` file:
```env
# SMSIndia Hub Configuration
SMSINDIAHUB_API_KEY=your_api_key
SMSINDIAHUB_SENDER_ID=your_sender_id
SMSINDIAHUB_TEMPLATE_ID=your_template_id  # Add this after template registration
```

## Quick Fix for Development

For development/testing, you can:
1. Use test phone numbers (already configured)
2. Check console logs for OTP (development mode shows OTP in logs)
3. Use email OTP as alternative (when implemented)

## Need Help?

If you're stuck:
1. Check SMSIndia Hub dashboard for template status
2. Review SMSIndia Hub API documentation
3. Contact SMSIndia Hub support
4. Check backend logs for detailed error messages


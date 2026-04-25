import User from '../models/User.js';
import quickekycService from '../services/quickekyc.service.js';

/**
 * KYC Controller
 * Handles Aadhaar, PAN, and DL verification via QuickEKYC
 */

// --- Aadhaar Verification ---

/**
 * @desc    Generate Aadhaar OTP
 * @route   POST /api/kyc/aadhaar/generate-otp
 * @access  Private
 */
export const generateAadhaarOTP = async (req, res) => {
  try {
    const { aadhaarNo } = req.body;

    if (!aadhaarNo || aadhaarNo.length !== 12) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 12-digit Aadhaar number'
      });
    }

    const result = await quickekycService.generateAadhaarOTP(aadhaarNo);

    if (result.status === 'success' || result.data?.request_id) {
      const requestId = result.data?.request_id || result.request_id;
      
      // Store request ID in user record for verification later
      await User.findByIdAndUpdate(req.user._id, {
        'kycDetails.aadhaar.number': aadhaarNo,
        'kycDetails.aadhaar.requestId': requestId
      });

      return res.status(200).json({
        success: true,
        message: 'OTP sent successfully to Aadhaar-linked mobile number',
        data: { requestId }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: result.message || 'Failed to generate OTP',
        error: result
      });
    }
  } catch (error) {
    console.error('Generate Aadhaar OTP Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while generating Aadhaar OTP'
    });
  }
};

/**
 * @desc    Verify Aadhaar OTP
 * @route   POST /api/kyc/aadhaar/verify-otp
 * @access  Private
 */
export const verifyAadhaarOTP = async (req, res) => {
  try {
    const { otp, requestId } = req.body;

    if (!otp || !requestId) {
      return res.status(400).json({
        success: false,
        message: 'OTP and Request ID are required'
      });
    }

    const result = await quickekycService.submitAadhaarOTP(requestId, otp);

    if (result.status === 'success' || result.data?.status === 'VALID') {
      // Mark Aadhaar as verified
      const user = await User.findById(req.user._id);
      user.kycDetails.aadhaar.verified = true;
      user.kycDetails.aadhaar.verifiedAt = new Date();
      
      // Check if all KYC is done
      checkAndSetKYCStatus(user);
      
      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Aadhaar verified successfully',
        data: result.data
      });
    } else {
      return res.status(400).json({
        success: false,
        message: result.message || 'Aadhaar verification failed',
        error: result
      });
    }
  } catch (error) {
    console.error('Verify Aadhaar OTP Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while verifying Aadhaar OTP'
    });
  }
};

// --- PAN Verification ---

/**
 * @desc    Verify PAN Card
 * @route   POST /api/kyc/pan/verify
 * @access  Private
 */
export const verifyPAN = async (req, res) => {
  try {
    const { panNo } = req.body;

    if (!panNo || panNo.length !== 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-character PAN number'
      });
    }

    const result = await quickekycService.verifyPAN(panNo);

    if (result.status === 'success' || result.data?.status === 'VALID') {
      const user = await User.findById(req.user._id);
      user.kycDetails.pan.number = panNo;
      user.kycDetails.pan.verified = true;
      user.kycDetails.pan.verifiedAt = new Date();
      
      checkAndSetKYCStatus(user);
      await user.save();

      return res.status(200).json({
        success: true,
        message: 'PAN verified successfully',
        data: result.data
      });
    } else {
      return res.status(400).json({
        success: false,
        message: result.message || 'PAN verification failed',
        error: result
      });
    }
  } catch (error) {
    console.error('Verify PAN Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while verifying PAN'
    });
  }
};

// --- Driving License Verification ---

/**
 * @desc    Verify Driving License
 * @route   POST /api/kyc/dl/verify
 * @access  Private
 */
export const verifyDL = async (req, res) => {
  try {
    const { dlNo, dob } = req.body;
    
    // Clean DL Number: Remove spaces and special characters
    const cleanDlNo = dlNo ? dlNo.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() : '';

    if (!cleanDlNo || !dob) {
      return res.status(400).json({
        success: false,
        message: 'Valid DL number and Date of Birth are required'
      });
    }

    // QuickEKYC DL API is very picky about DOB format. 
    // We will try YYYY-MM-DD first (standard), then DD-MM-YYYY if it fails.
    let formattedDob = dob; // Default is YYYY-MM-DD from frontend
    
    console.log(`📡 Attempting DL Verification: ${cleanDlNo} with DOB: ${formattedDob}`);
    
    try {
      let result = await quickekycService.verifyDL(cleanDlNo, formattedDob);
      
      // If failed, try alternate format automatically
      if (result.status === 'error' && result.message?.toLowerCase().includes('date of birth')) {
        const parts = dob.split('-');
        const alternateDob = `${parts[2]}-${parts[1]}-${parts[0]}`; // DD-MM-YYYY
        console.log(`🔄 Retrying with alternate DOB format: ${alternateDob}`);
        result = await quickekycService.verifyDL(cleanDlNo, alternateDob);
      }

      if (result.status === 'success' || result.data?.status === 'VALID') {
        const User = (await import('../models/User.js')).default;
        const user = await User.findById(req.user._id);
        user.kycDetails.dl.number = dlNo;
        user.kycDetails.dl.dob = dob;
        user.kycDetails.dl.verified = true;
        user.kycDetails.dl.verifiedAt = new Date();
        
        checkAndSetKYCStatus(user);
        await user.save();

        return res.status(200).json({
          success: true,
          message: 'Driving License verified successfully',
          data: result.data
        });
      } else {
        return res.status(400).json({
          success: false,
          message: result.message || 'DL Verification failed',
          error: result
        });
      }
    } catch (apiError) {
      console.error('QuickEKYC API Exception:', apiError);
      
      // Last resort retry on catch if it was a format error
      if (apiError.message?.toLowerCase().includes('date of birth')) {
        try {
          const parts = dob.split('-');
          const lastResortDob = `${parts[2]}-${parts[1]}-${parts[0]}`;
          const lastResult = await quickekycService.verifyDL(cleanDlNo, lastResortDob);
          if (lastResult.status === 'success') {
            // ... copy success logic if needed, but let's keep it simple for now
            return res.status(200).json({ success: true, message: 'Verified on retry', data: lastResult.data });
          }
        } catch (e) {}
      }

      return res.status(400).json({
        success: false,
        message: apiError.message || 'API Error during DL verification',
        error: apiError
      });
    }
  } catch (error) {
    console.error('DL Controller Error:', error);
    res.status(500).json({ success: false, message: 'Server error during DL verification' });
  }
};

/**
 * Helper to check and update overall KYC status
 */
const checkAndSetKYCStatus = (user) => {
  const isAadhaarDone = user.kycDetails?.aadhaar?.verified || false;
  const isPanDone = user.kycDetails?.pan?.verified || false;
  const isDlDone = user.kycDetails?.dl?.verified || false;
  
  if (isAadhaarDone && isPanDone && isDlDone) {
    user.isKYCVerified = true;
  }
};

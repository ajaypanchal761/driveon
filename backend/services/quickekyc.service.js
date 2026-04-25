import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const QUICKEKYC_API_KEY = process.env.QUICKEKYC_API_KEY;
const BASE_URL = 'https://api.quickekyc.com/api/v1';

/**
 * QuickEKYC Service for Aadhaar, PAN, and DL verification
 */
class QuickEKYCService {
  /**
   * Aadhaar - Generate OTP
   * @param {string} aadhaarNo - 12 digit Aadhaar number
   */
  async generateAadhaarOTP(aadhaarNo) {
    try {
      const response = await axios.post(`${BASE_URL}/aadhaar-v2/generate-otp`, {
        key: QUICKEKYC_API_KEY,
        id_number: aadhaarNo
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data;
    } catch (error) {
      console.error('QuickEKYC Aadhaar OTP Generation Error:', error.response?.data || error.message);
      throw error.response?.data || error;
    }
  }

  /**
   * Aadhaar - Submit OTP
   * @param {string} requestId - Request ID from generateAadhaarOTP
   * @param {string} otp - 6 digit OTP
   */
  async submitAadhaarOTP(requestId, otp) {
    try {
      const response = await axios.post(`${BASE_URL}/aadhaar-v2/submit-otp`, {
        key: QUICKEKYC_API_KEY,
        request_id: requestId,
        otp: otp
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data;
    } catch (error) {
      console.error('QuickEKYC Aadhaar OTP Submission Error:', error.response?.data || error.message);
      throw error.response?.data || error;
    }
  }

  /**
   * PAN Verification
   * @param {string} panNo - PAN number
   */
  async verifyPAN(panNo) {
    try {
      const response = await axios.post(`${BASE_URL}/pan/pan`, {
        key: QUICKEKYC_API_KEY,
        id_number: panNo
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data;
    } catch (error) {
      console.error('QuickEKYC PAN Verification Error:', error.response?.data || error.message);
      throw error.response?.data || error;
    }
  }

  /**
   * Driving License Verification
   * @param {string} dlNo - DL number
   * @param {string} dob - Date of birth in YYYY-MM-DD format
   */
  async verifyDL(dlNo, dob) {
    try {
      const response = await axios.post(`${BASE_URL}/driving-license/driving-license`, {
        key: QUICKEKYC_API_KEY,
        id_number: dlNo,
        dob: dob
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data;
    } catch (error) {
      console.error('QuickEKYC DL Verification Error:', error.response?.data || error.message);
      throw error.response?.data || error;
    }
  }
}

export default new QuickEKYCService();

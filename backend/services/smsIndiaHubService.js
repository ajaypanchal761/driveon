import axios from "axios";
import dotenv from "dotenv";

// Load environment variables if not already loaded
dotenv.config();

/**
 * SMSIndia Hub SMS Service for DriveOn
 * Handles OTP sending via SMSIndia Hub API
 * Same service as CreateBharat project
 */
class SMSIndiaHubService {
  constructor() {
    // Load credentials from environment variables
    this.apiKey = process.env.SMSINDIAHUB_API_KEY?.trim();
    this.senderId = process.env.SMSINDIAHUB_SENDER_ID?.trim();
    this.baseUrl = "http://cloud.smsindiahub.in/vendorsms/pushsms.aspx";

    // Log configuration status (only in development)
    if (process.env.NODE_ENV === "development") {
      if (!this.apiKey || !this.senderId) {
        console.warn(
          "⚠️ SMSIndia Hub credentials not configured. SMS functionality will be disabled."
        );
        console.warn(
          "   Please check SMSINDIAHUB_API_KEY and SMSINDIAHUB_SENDER_ID in .env file"
        );
      } else {
        console.log("✅ SMSIndia Hub credentials loaded successfully");
      }
    }
  }

  /**
   * Check if SMSIndia Hub is properly configured
   * @returns {boolean}
   */
  isConfigured() {
    // Load credentials dynamically in case they weren't available during construction
    const apiKey = (this.apiKey || process.env.SMSINDIAHUB_API_KEY)?.trim();
    const senderId = (
      this.senderId || process.env.SMSINDIAHUB_SENDER_ID
    )?.trim();

    return !!(apiKey && senderId);
  }

  /**
   * Normalize phone number to Indian format with country code
   * @param {string} phone - Phone number to normalize
   * @returns {string} - Normalized phone number with country code (91XXXXXXXXXX)
   */
  normalizePhoneNumber(phone) {
    // Remove all non-digit characters
    const digits = phone.replace(/[^0-9]/g, "");

    // If it already has country code 91 and is 12 digits, return as is
    if (digits.startsWith("91") && digits.length === 12) {
      return digits;
    }

    // If it's 10 digits, add country code 91
    if (digits.length === 10) {
      return "91" + digits;
    }

    // If it's 11 digits and starts with 0, remove the 0 and add country code
    if (digits.length === 11 && digits.startsWith("0")) {
      return "91" + digits.substring(1);
    }

    // Return with country code as fallback
    return "91" + digits.slice(-10);
  }

  /**
   * Send OTP via SMS using SMSIndia Hub
   * @param {string} phone - Phone number to send SMS to
   * @param {string} otp - OTP code to send
   * @param {string} purpose - Purpose of OTP (register, login, reset_password) - optional
   * @returns {Promise<Object>} - Response object
   */
  async sendOTP(phone, otp, purpose = 'register') {
    try {
      // Load credentials dynamically (with trim to remove whitespace)
      const apiKey = (this.apiKey || process.env.SMSINDIAHUB_API_KEY)?.trim();
      const senderId = (
        this.senderId || process.env.SMSINDIAHUB_SENDER_ID
      )?.trim();

      if (!apiKey || !senderId) {
        console.error("❌ SMSIndia Hub Configuration Error:");
        console.error(
          "   SMSINDIAHUB_API_KEY:",
          apiKey ? "✓ Set" : "✗ Missing"
        );
        console.error(
          "   SMSINDIAHUB_SENDER_ID:",
          senderId ? "✓ Set" : "✗ Missing"
        );
        throw new Error(
          "SMSIndia Hub not configured. Please check your environment variables SMSINDIAHUB_API_KEY and SMSINDIAHUB_SENDER_ID in .env file."
        );
      }

      const normalizedPhone = this.normalizePhoneNumber(phone);

      // Validate phone number (should be 12 digits with country code)
      if (normalizedPhone.length !== 12 || !normalizedPhone.startsWith("91")) {
        throw new Error(
          `Invalid phone number format: ${phone}. Expected 10-digit Indian mobile number.`
        );
      }

      // SMSIndia Hub requires DLT registered templates for transactional SMS
      // Check if custom message template is provided (must match registered DLT template exactly)
      const customTemplate = process.env.SMSINDIAHUB_MESSAGE_TEMPLATE?.trim();
      
      // Determine purpose text for message
      let purposeText = 'registration';
      if (purpose === 'login') {
        purposeText = 'login';
      } else if (purpose === 'reset_password') {
        purposeText = 'password reset';
      }
      
      // Use custom template if provided, otherwise use default format that matches registered template
      // Based on working template: "Welcome to the DriveOn powered by SMSINDIAHUB. Your OTP for registration is {otp}"
      const message = customTemplate 
        ? customTemplate.replace('{otp}', otp).replace('{purpose}', purposeText)
        : `Welcome to the DriveOn powered by SMSINDIAHUB. Your OTP for ${purposeText} is ${otp}`;

      // Check if template ID is provided (for DLT registered templates)
      const templateId = process.env.SMSINDIAHUB_TEMPLATE_ID?.trim();
      
      // Check if promotional SMS is enabled (temporary workaround for template issues)
      // ⚠️ WARNING: Promotional SMS is not recommended for OTP - use only for testing
      const usePromotional = process.env.SMSINDIAHUB_USE_PROMOTIONAL === 'true';
      const gatewayId = usePromotional ? "1" : "2"; // 1 = promotional, 2 = transactional
      
      if (usePromotional) {
        console.warn("⚠️ Using promotional SMS mode - not recommended for production OTP!");
      }
      
      // Build the API URL with query parameters
      const params = new URLSearchParams({
        APIKey: apiKey,
        msisdn: normalizedPhone,
        sid: senderId,
        msg: message,
        fl: "0", // Flash message flag (0 = normal SMS)
        dc: "0", // Delivery confirmation (0 = no confirmation)
        gwid: gatewayId, // Gateway ID (1 = promotional, 2 = transactional)
      });

      // Add template ID if provided (for DLT compliance)
      // SMSIndia Hub uses 'templateid' parameter for DLT template ID
      if (templateId) {
        params.append('templateid', templateId); // DLT Template ID
        // Also try peid parameter (some SMSIndia Hub versions use this)
        // params.append('peid', templateId);
      }

      const apiUrl = `${this.baseUrl}?${params.toString()}`;

      // Make GET request to SMSIndia Hub API
      const response = await axios.get(apiUrl, {
        headers: {
          "User-Agent": "DriveOn/1.0",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
        timeout: 15000, // 15 second timeout
      });

      console.log("📱 SMSIndia Hub Response Status:", response.status);
      console.log("📱 SMSIndia Hub Response Data:", response.data);

      // SMSIndia Hub can return either JSON or string response
      let responseData = response.data;
      const responseText =
        typeof responseData === "string"
          ? responseData
          : JSON.stringify(responseData);

      // First, check for failure indicators in string responses
      if (typeof responseData === "string") {
        const lowerResponse = responseData.toLowerCase();
        if (
          lowerResponse.includes("failed") ||
          lowerResponse.includes("invalid login") ||
          lowerResponse.includes("error") ||
          lowerResponse.includes("authentication failed") ||
          lowerResponse.includes("invalid")
        ) {
          throw new Error(`SMSIndia Hub API error: ${responseData}`);
        }
      }

      // Try to parse as JSON if it's a string
      if (typeof responseData === "string") {
        try {
          responseData = JSON.parse(responseData);
        } catch (e) {
          // If parsing fails and it's not a failure message, treat as unknown format
          // But we already checked for failures above, so this should be a success
          if (
            !responseText.toLowerCase().includes("success") &&
            !responseText.toLowerCase().includes("sent") &&
            !responseText.toLowerCase().includes("done")
          ) {
            throw new Error(
              `SMSIndia Hub API returned unexpected response format: ${responseText}`
            );
          }
        }
      }

      // Check for success indicators in JSON response
      if (responseData && typeof responseData === "object") {
        if (
          responseData.ErrorCode === "000" &&
          responseData.ErrorMessage === "Done"
        ) {
          const messageId =
            responseData.MessageData && responseData.MessageData[0]
              ? responseData.MessageData[0].MessageId
              : `sms_${Date.now()}`;

          return {
            success: true,
            messageId: messageId,
            jobId: responseData.JobId,
            status: "sent",
            to: normalizedPhone,
            body: message,
            provider: "SMSIndia Hub",
            response: responseData,
          };
        } else if (responseData.ErrorCode && responseData.ErrorCode !== "000") {
          // Handle specific error codes
          let errorMessage = responseData.ErrorMessage || "Unknown error";
          
          // Provide helpful error messages for common issues
          if (responseData.ErrorCode === "006" || errorMessage.includes("template")) {
            errorMessage = `Template Error: ${errorMessage}. You need to register a DLT template with SMSIndia Hub. Contact SMSIndia Hub support or use a registered template ID.`;
            console.error("\n⚠️ SMSIndia Hub Template Error:");
            console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.error("Error Code: 006 - Invalid template text");
            console.error("\n📋 To fix this:");
            console.error("   1. Log in to SMSIndia Hub dashboard");
            console.error("   2. Register a DLT template for OTP messages");
            console.error("      Example template: 'Your DriveOn OTP is {otp}. Valid for 10 minutes. Do not share.'");
            console.error("   3. Get your DLT Template ID from the dashboard");
            console.error("   4. Add to your .env file:");
            console.error("      SMSINDIAHUB_TEMPLATE_ID=your_template_id_here");
            console.error("   5. If your template message format is different, add:");
            console.error("      SMSINDIAHUB_MESSAGE_TEMPLATE=Your exact template text with {otp} placeholder");
            console.error("   6. Restart your server after adding these variables");
            console.error("\n💡 Alternative (Testing Only): Use promotional SMS");
            console.error("   Add to .env: SMSINDIAHUB_USE_PROMOTIONAL=true");
            console.error("   ⚠️ WARNING: Not recommended for production OTP!");
            console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
          }
          
          throw new Error(
            `SMSIndia Hub API error: ${errorMessage} (Code: ${responseData.ErrorCode})`
          );
        }
      }

      // If we reach here, the response format is unexpected
      // Check one more time for failure indicators in the original text
      if (
        responseText.toLowerCase().includes("failed") ||
        responseText.toLowerCase().includes("invalid") ||
        responseText.toLowerCase().includes("error")
      ) {
        throw new Error(`SMSIndia Hub API error: ${responseText}`);
      }

      // If no failure indicators found, but also no clear success, throw error for safety
      throw new Error(
        `SMSIndia Hub API returned unexpected response: ${responseText}`
      );
    } catch (error) {
      // Handle specific error cases
      if (error.response) {
        const errorData = error.response.data;

        if (error.response.status === 401) {
          throw new Error(
            "SMSIndia Hub authentication failed. Please check your API key."
          );
        } else if (error.response.status === 400) {
          throw new Error(
            `SMSIndia Hub request error: Invalid request parameters`
          );
        } else if (error.response.status === 429) {
          throw new Error(
            "SMSIndia Hub rate limit exceeded. Please try again later."
          );
        } else if (error.response.status === 500) {
          throw new Error("SMSIndia Hub server error. Please try again later.");
        } else {
          throw new Error(
            `SMSIndia Hub API error (${error.response.status}): ${errorData}`
          );
        }
      } else if (error.code === "ECONNABORTED") {
        throw new Error("SMSIndia Hub request timeout. Please try again.");
      } else if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
        throw new Error(
          "Unable to connect to SMSIndia Hub service. Please check your internet connection."
        );
      } else if (error.code === "ECONNRESET") {
        throw new Error("SMSIndia Hub connection was reset. Please try again.");
      }

      throw error;
    }
  }

  /**
   * Send custom SMS message
   * @param {string} phone - Phone number to send SMS to
   * @param {string} message - Custom message to send
   * @returns {Promise<Object>} - Response object
   */
  async sendCustomSMS(phone, message) {
    try {
      // Load credentials dynamically (with trim to remove whitespace)
      const apiKey = (this.apiKey || process.env.SMSINDIAHUB_API_KEY)?.trim();
      const senderId = (
        this.senderId || process.env.SMSINDIAHUB_SENDER_ID
      )?.trim();

      if (!apiKey || !senderId) {
        console.error("❌ SMSIndia Hub Configuration Error:");
        console.error(
          "   SMSINDIAHUB_API_KEY:",
          apiKey ? "✓ Set" : "✗ Missing"
        );
        console.error(
          "   SMSINDIAHUB_SENDER_ID:",
          senderId ? "✓ Set" : "✗ Missing"
        );
        throw new Error(
          "SMSIndia Hub not configured. Please check your environment variables SMSINDIAHUB_API_KEY and SMSINDIAHUB_SENDER_ID in .env file."
        );
      }

      const normalizedPhone = this.normalizePhoneNumber(phone);

      // Validate phone number (should be 12 digits with country code)
      if (normalizedPhone.length !== 12 || !normalizedPhone.startsWith("91")) {
        throw new Error(
          `Invalid phone number format: ${phone}. Expected 10-digit Indian mobile number.`
        );
      }

      // Build the API URL with query parameters
      const params = new URLSearchParams({
        APIKey: apiKey,
        msisdn: normalizedPhone,
        sid: senderId,
        msg: message,
        fl: "0", // Flash message flag (0 = normal SMS)
        dc: "0", // Delivery confirmation (0 = no confirmation)
        gwid: "2", // Gateway ID (2 = transactional)
      });

      const apiUrl = `${this.baseUrl}?${params.toString()}`;

      // Make GET request to SMSIndia Hub API
      const response = await axios.get(apiUrl, {
        headers: {
          "User-Agent": "DriveOn/1.0",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
        timeout: 15000, // 15 second timeout
      });

      const responseText = response.data.toString();

      // Check for success indicators in the response
      if (
        responseText.includes("success") ||
        responseText.includes("sent") ||
        responseText.includes("accepted")
      ) {
        return {
          success: true,
          messageId: `sms_${Date.now()}`,
          status: "sent",
          to: normalizedPhone,
          body: message,
          provider: "SMSIndia Hub",
          response: responseText,
        };
      } else if (
        responseText.includes("error") ||
        responseText.includes("failed") ||
        responseText.includes("invalid")
      ) {
        throw new Error(`SMSIndia Hub API error: ${responseText}`);
      } else {
        return {
          success: true,
          messageId: `sms_${Date.now()}`,
          status: "sent",
          to: normalizedPhone,
          body: message,
          provider: "SMSIndia Hub",
          response: responseText,
        };
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Test SMSIndia Hub API connection and credentials
   * @returns {Promise<Object>} - Test result
   */
  async testConnection() {
    try {
      // Load credentials dynamically (with trim to remove whitespace)
      const apiKey = (this.apiKey || process.env.SMSINDIAHUB_API_KEY)?.trim();
      const senderId = (
        this.senderId || process.env.SMSINDIAHUB_SENDER_ID
      )?.trim();

      if (!apiKey || !senderId) {
        console.error("❌ SMSIndia Hub Configuration Error:");
        console.error(
          "   SMSINDIAHUB_API_KEY:",
          apiKey ? "✓ Set" : "✗ Missing"
        );
        console.error(
          "   SMSINDIAHUB_SENDER_ID:",
          senderId ? "✓ Set" : "✗ Missing"
        );
        throw new Error(
          "SMSIndia Hub not configured. Please check your environment variables SMSINDIAHUB_API_KEY and SMSINDIAHUB_SENDER_ID in .env file."
        );
      }

      // Test with a simple SMS to verify connection
      const testPhone = "919109992290"; // Use a test phone number
      const testMessage =
        "Test message from DriveOn. SMS service is working correctly.";

      const params = new URLSearchParams({
        APIKey: apiKey,
        msisdn: testPhone,
        sid: senderId,
        msg: testMessage,
        fl: "0",
        dc: "0",
        gwid: "2",
      });

      const testUrl = `${this.baseUrl}?${params.toString()}`;

      const response = await axios.get(testUrl, {
        headers: {
          "User-Agent": "DriveOn/1.0",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
        timeout: 10000,
      });

      return {
        success: true,
        message: "SMSIndia Hub connection successful",
        response: response.data.toString(),
      };
    } catch (error) {
      return {
        success: false,
        message: `Connection test failed: ${error.message}`,
        error: error.response?.data || error.message,
      };
    }
  }

  /**
   * Get account balance from SMSIndia Hub
   * @returns {Promise<Object>} - Balance information
   */
  async getBalance() {
    try {
      // Load credentials dynamically (with trim to remove whitespace)
      const apiKey = (this.apiKey || process.env.SMSINDIAHUB_API_KEY)?.trim();

      if (!apiKey) {
        console.error("❌ SMSIndia Hub Configuration Error:");
        console.error(
          "   SMSINDIAHUB_API_KEY:",
          apiKey ? "✓ Set" : "✗ Missing"
        );
        throw new Error(
          "SMSIndia Hub not configured. Please check your environment variable SMSINDIAHUB_API_KEY in .env file."
        );
      }

      // SMSIndia Hub balance API endpoint
      const balanceUrl = `http://cloud.smsindiahub.in/vendorsms/checkbalance.aspx?APIKey=${apiKey}`;

      const response = await axios.get(balanceUrl, {
        headers: {
          "User-Agent": "DriveOn/1.0",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
        timeout: 10000,
      });

      const responseText = response.data.toString();

      // Parse balance from response (SMSIndia Hub typically returns balance as text)
      const balanceMatch = responseText.match(/(\d+\.?\d*)/);
      const balance = balanceMatch ? parseFloat(balanceMatch[1]) : 0;

      return {
        success: true,
        balance: balance,
        currency: "INR",
        response: responseText,
      };
    } catch (error) {
      throw new Error(`Failed to fetch SMSIndia Hub balance: ${error.message}`);
    }
  }
}

// Create singleton instance
const smsIndiaHubService = new SMSIndiaHubService();

export default smsIndiaHubService;

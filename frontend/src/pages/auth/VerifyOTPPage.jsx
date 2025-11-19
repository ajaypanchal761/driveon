import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import OtpInput from 'react-otp-input';
import { Button } from '../../components/common';
import { useAppDispatch } from '../../hooks/redux';
import { loginSuccess } from '../../store/slices/authSlice';
import { authService } from '../../services';
import toastUtils from '../../config/toast';

/**
 * VerifyOTPPage Component
 * Mobile-first OTP verification page with theme colors
 * Fully responsive design
 */
const VerifyOTPPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(60); // 60 seconds timer
  const [canResend, setCanResend] = useState(false);

  // Get email/phone from location state
  const { email, phone } = location.state || {};

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timer]);

  // Auto-submit when OTP is complete (6 digits)
  useEffect(() => {
    if (otp.length === 6) {
      handleVerifyOTP();
    }
  }, [otp]);

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toastUtils.error('Please enter complete 6-digit OTP');
      return;
    }

    setIsLoading(true);

    try {
      // Call verify OTP API
      const response = await authService.verifyOTP({
        email: email || undefined,
        phone: phone || undefined,
        otp: otp,
      });

      // Update Redux store
      dispatch(
        loginSuccess({
          token: response.token,
          refreshToken: response.refreshToken,
          userRole: response.user?.role || 'user',
        })
      );

      toastUtils.success('OTP verified successfully!');
      
      // Redirect to home or intended page
      navigate('/', { replace: true });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Invalid OTP. Please try again.';
      toastUtils.error(errorMessage);
      setOtp(''); // Clear OTP on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    try {
      await authService.register({
        email: email || undefined,
        phone: phone || undefined,
      });

      toastUtils.success('OTP resent successfully!');
      setTimer(60);
      setCanResend(false);
      setOtp('');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to resend OTP. Please try again.';
      toastUtils.error(errorMessage);
    }
  };

  // Redirect if no email/phone
  if (!email && !phone) {
    navigate('/register', { replace: true });
    return null;
  }

  return (
    <div 
      className="h-screen w-screen flex items-center justify-center px-4 overflow-hidden m-0 p-0" 
      style={{ backgroundColor: '#3d096d', margin: 0, padding: 0 }}
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Verify OTP
          </h1>
          <p className="text-white/90 text-sm md:text-base mb-1">
            We've sent a 6-digit code to
          </p>
          <p className="text-white font-medium">
            {email || `+91 ${phone}`}
          </p>
        </div>

        {/* OTP Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-2xl" style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(61, 9, 109, 0.05)' }}>
          {/* OTP Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
              Enter the verification code
            </label>
            <div className="flex justify-center otp-input-container">
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderSeparator={<span className="mx-1 md:mx-2"></span>}
                renderInput={(props) => (
                  <input
                    {...props}
                    className="w-11 h-12 md:w-14 md:h-16 text-center text-xl md:text-2xl font-bold border-2 border-gray-300 rounded-lg shadow-sm focus:border-[#3d096d] focus:ring-2 focus:ring-[#3d096d]/20 bg-white text-gray-900 transition-all hover:shadow-md"
                    style={{
                      minWidth: '44px',
                      minHeight: '44px',
                    }}
                  />
                )}
                inputType="number"
                shouldAutoFocus
              />
            </div>
          </div>

          {/* Timer and Resend */}
          <div className="text-center mb-6">
            {timer > 0 ? (
              <p className="text-sm text-gray-600">
                Resend code in{' '}
                <span className="font-semibold" style={{ color: '#3d096d' }}>
                  {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                </span>
              </p>
            ) : (
              <button
                onClick={handleResendOTP}
                className="text-sm font-medium hover:underline"
                style={{ color: '#3d096d' }}
                disabled={isLoading}
              >
                Resend OTP
              </button>
            )}
          </div>

          {/* Verify Button */}
          <Button
            type="button"
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleVerifyOTP}
            isLoading={isLoading}
            disabled={isLoading || otp.length !== 6}
          >
            Verify OTP
          </Button>

          {/* Back to Register */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/register')}
              className="text-sm hover:underline transition-colors"
              style={{ color: '#3d096d' }}
            >
              Change email/phone number
            </button>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-xs text-white/80">
            Didn't receive the code? Check your spam folder or{' '}
            <button
              onClick={handleResendOTP}
              disabled={!canResend}
              className="hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ color: '#3d096d' }}
            >
              resend
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTPPage;

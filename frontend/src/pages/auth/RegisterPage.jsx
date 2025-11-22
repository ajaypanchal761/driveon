import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input } from '../../components/common';
import { authService } from '../../services';
import toastUtils from '../../config/toast';

/**
 * Register Schema Validation - OTP Based
 */
const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number')
    .transform((val) => val.replace(/\D/g, '')), // Remove non-digits
  referralCode: z.string().optional(),
  termsAccepted: z
    .boolean()
    .refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),
});

/**
 * RegisterPage Component
 * OTP-based registration with purple theme matching homepage
 * Fixed view, no scrolling
 */
const RegisterPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Prevent body scroll when component mounts
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      phone: '',
      referralCode: '',
      termsAccepted: false,
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      // Send OTP for registration
      const response = await authService.register({
        email: data.email,
        phone: data.phone,
        referralCode: data.referralCode || undefined,
      });

      console.log('Register Response:', response);
      
      toastUtils.success('OTP sent successfully! Please verify.');
      
      // Navigate to OTP verification
      navigate('/verify-otp', {
        state: {
          email: data.email,
          phone: data.phone,
          type: 'register',
        },
        replace: true,
      });
    } catch (error) {
      console.error('Register Error:', error);
      console.error('Error Response:', error.response);
      console.error('Error Data:', error.response?.data);
      
      // Extract error message from various possible formats
      const errorMessage = 
        error.response?.data?.message || 
        error.response?.data?.error || 
        error.message || 
        'Registration failed. Please try again.';
      
      toastUtils.error(errorMessage);
      
      // Don't navigate to OTP page if there's an error (e.g., user already exists)
      // User stays on register page to see the error message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center px-4"
      style={{ 
        backgroundColor: '#3d096d',
        margin: 0,
        padding: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        maxWidth: '100%',
        maxHeight: '100%'
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full -ml-24 -mb-24"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Create Account
          </h1>
          <p className="text-white/90 text-sm md:text-base">
            Sign up to get started with DriveOn
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Input */}
            <Input
              type="email"
              label="Email Address"
              placeholder="Enter your email"
              error={errors.email?.message}
              {...register('email')}
              autoComplete="email"
              autoFocus
            />

            {/* Phone Input */}
            <Input
              type="tel"
              label="Phone Number"
              placeholder="Enter your 10-digit phone number"
              error={errors.phone?.message}
              helperText="Enter 10-digit mobile number"
              {...register('phone')}
              autoComplete="tel"
              maxLength={10}
            />

            {/* Referral Code Input (Optional) */}
            <Input
              type="text"
              label="Referral Code (Optional)"
              placeholder="Enter referral code if you have one"
              error={errors.referralCode?.message}
              {...register('referralCode')}
            />

            {/* Terms and Conditions */}
            <div>
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  {...register('termsAccepted')}
                  className="mt-1 w-4 h-4 rounded focus:ring-2"
                    style={{ 
                    accentColor: '#3d096d',
                    borderColor: '#d0d0d0'
                  }}
                />
                <span className="ml-3 text-sm text-gray-700">
                  I agree to the{' '}
                  <Link
                    to="/terms"
                    className="font-medium hover:underline"
                    style={{ color: '#3d096d' }}
                    target="_blank"
                  >
                    Terms and Conditions
                  </Link>
                  {' '}and{' '}
                  <Link
                    to="/privacy"
                    className="font-medium hover:underline"
                    style={{ color: '#3d096d' }}
                    target="_blank"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.termsAccepted && (
                <p className="mt-1 text-sm text-error" role="alert">
                  {errors.termsAccepted.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              disabled={isLoading}
              className="mt-6"
              style={{ backgroundColor: '#3d096d' }}
            >
              Send OTP
            </Button>
          </form>
        </div>

        {/* Sign In Link */}
        <div className="mt-6 text-center">
          <p className="text-white/90 text-sm md:text-base">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-white font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

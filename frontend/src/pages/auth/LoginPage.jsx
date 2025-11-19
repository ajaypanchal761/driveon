import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input } from '../../components/common';
import { useAppDispatch } from '../../hooks/redux';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';
import { authService } from '../../services';
import toastUtils from '../../config/toast';

/**
 * Login Schema Validation
 */
const loginSchema = z.object({
  emailOrPhone: z
    .string()
    .min(1, 'Email or phone number is required')
    .refine(
      (val) => {
        // Check if it's an email or phone
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[6-9]\d{9}$/;
        const cleanedPhone = val.replace(/\D/g, '');
        return emailRegex.test(val) || phoneRegex.test(cleanedPhone);
      },
      { message: 'Please enter a valid email or phone number' }
    ),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

/**
 * LoginPage Component
 * Mobile-first login page with theme colors
 * Fully responsive design
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  // Get return URL from location state or default to home
  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrPhone: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    dispatch(loginStart());

    try {
      // Call login API
      const response = await authService.login({
        emailOrPhone: data.emailOrPhone,
        password: data.password,
      });

      // Update Redux store
      dispatch(
        loginSuccess({
          token: response.token,
          refreshToken: response.refreshToken,
          userRole: response.user?.role || 'user',
        })
      );

      toastUtils.success('Login successful!');
      
      // Redirect to intended page or home
      navigate(from, { replace: true });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      dispatch(loginFailure(errorMessage));
      toastUtils.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="h-screen w-screen flex items-center justify-center px-4 overflow-hidden m-0 p-0" 
      style={{ backgroundColor: '#3d096d', margin: 0, padding: 0 }}
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-white/90 text-sm md:text-base">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-2xl" style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(61, 9, 109, 0.05)' }}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email/Phone Input */}
            <Input
              type="text"
              label="Email or Phone Number"
              placeholder="Enter your email or phone"
              error={errors.emailOrPhone?.message}
              {...register('emailOrPhone')}
              autoComplete="username"
              autoFocus
            />

            {/* Password Input */}
            <div>
              <Input
                type="password"
                label="Password"
                placeholder="Enter your password"
                error={errors.password?.message}
                {...register('password')}
                autoComplete="current-password"
              />
              <div className="flex items-center justify-between mt-2">
                {/* Remember Me */}
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('rememberMe')}
                    className="w-4 h-4 rounded focus:ring-2"
                    style={{ 
                      accentColor: '#3d096d',
                      borderColor: '#d0d0d0'
                    }}
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Remember me
                  </span>
                </label>

                {/* Forgot Password Link */}
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium hover:underline"
                  style={{ color: '#3d096d' }}
                >
                  Forgot password?
                </Link>
              </div>
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
            >
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-default"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login Buttons (Optional - for future) */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              fullWidth
              disabled
              className="text-sm"
            >
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              size="md"
              fullWidth
              disabled
              className="text-sm"
            >
              Facebook
            </Button>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-white/90 text-sm md:text-base">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-white font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

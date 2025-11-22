import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { updateUser, setProfileComplete } from '../../store/slices/userSlice';
import { Input, Button } from '../../components/common';
import { userService } from '../../services';
import toastUtils from '../../config/toast';
// Theme color constant - using direct value to avoid import issues
const PRIMARY_COLOR = '#3d096d';

/**
 * Profile Completion Schema
 */
const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .min(10, 'Phone number must be 10 digits')
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number'),
  age: z
    .string()
    .min(1, 'Age is required')
    .refine((val) => {
      const age = parseInt(val);
      return age >= 18 && age <= 100;
    }, 'Age must be between 18 and 100'),
  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'Please select your gender',
  }),
  address: z.string().min(10, 'Address must be at least 10 characters'),
});

/**
 * ProfileCompletePage Component
 * Multi-step form to complete user profile (100% required for booking)
 * Mobile-first design with purple theme
 */
const ProfileCompletePage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const [currentStep, setCurrentStep] = useState(1);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(user?.profilePhoto || null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      age: user?.age || '',
      gender: user?.gender || '',
      address: user?.address || '',
    },
  });

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  // Handle photo upload
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toastUtils.error('Image size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toastUtils.error('Please select an image file');
        return;
      }
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload profile photo (Mock mode - no backend)
  const handlePhotoUpload = async () => {
    if (!profilePhoto) {
      // Allow skipping if photo already exists
      if (photoPreview) {
        setCurrentStep(3);
        return;
      }
      toastUtils.error('Please select a photo');
      return;
    }

    setIsUploading(true);
    try {
      // Mock mode - just use the preview URL
      const formData = new FormData();
      formData.append('photo', profilePhoto);

      const response = await userService.uploadPhoto(formData);
      
      // Handle response from backend
      const uploadedPhotoUrl = response.data?.profilePhoto || photoPreview;
      
      // Update Redux store
      dispatch(updateUser({ profilePhoto: uploadedPhotoUrl }));
      
      toastUtils.success('Profile photo uploaded successfully!');
      setCurrentStep(3);
    } catch (error) {
      console.error('Photo upload error:', error);
      
      // In mock mode, even if there's an error, use the preview
      if (photoPreview) {
        dispatch(updateUser({ profilePhoto: photoPreview }));
        localStorage.setItem('userProfilePhoto', photoPreview);
        toastUtils.success('Profile photo saved!');
        setCurrentStep(3);
      } else {
        toastUtils.error('Failed to upload photo. You can skip and continue.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  // Handle DigiLocker KYC
  const handleDigiLockerKYC = async (documentType) => {
    try {
      // Redirect to DigiLocker OAuth
      // This will be implemented when DigiLocker integration is ready
      toastUtils.info('DigiLocker integration coming soon');
      // For now, simulate success
      dispatch(
        updateUser({
          [`${documentType}Verified`]: true,
        })
      );
    } catch (error) {
      toastUtils.error('Failed to verify document');
    }
  };

  // Submit profile completion (Mock mode - no backend)
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Update profile (mock mode)
      const response = await userService.updateProfile({
        ...data,
        age: parseInt(data.age),
      });

      // Handle backend response
      const userData = response.data?.user || response.user;
      const profileComplete = userData?.profileComplete || 100;
      
      // Update Redux store
      dispatch(updateUser(userData));
      dispatch(setProfileComplete(profileComplete >= 100));
      
      toastUtils.success('Profile completed successfully!');
      navigate('/profile');
    } catch (error) {
      console.error('Profile update error:', error);
      
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'Failed to update profile. Please try again.';
      
      toastUtils.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if step 1 is complete
  const isStep1Complete = () => {
    const values = watch();
    return (
      values.name &&
      values.email &&
      values.phone &&
      values.age &&
      values.gender &&
      values.address &&
      !errors.name &&
      !errors.email &&
      !errors.phone &&
      !errors.age &&
      !errors.gender &&
      !errors.address
    );
  };

  return (
    <div className="w-full min-h-screen bg-white pb-20 overflow-x-hidden relative z-0">
      {/* Header Section - Purple Background */}
      <header className="w-full bg-[#3d096d] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12"></div>
        </div>

        <div className="relative px-4 py-2 md:px-6 md:py-3">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <button
              onClick={() => navigate('/profile')}
              className="mb-1.5 md:mb-2 p-1 -ml-1 md:p-1.5 touch-target"
              aria-label="Go back"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Title */}
            <h1 className="text-lg md:text-xl font-bold text-white mb-1.5">Complete Your Profile</h1>

            {/* Progress Bar */}
            <div className="w-full bg-white/20 rounded-full h-1.5 mb-0.5">
              <div
                className="bg-white rounded-full h-1.5 transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-white/80">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-3 pt-4 pb-2 md:px-6 md:pt-6 md:pb-4 w-full max-w-4xl mx-auto">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <form onSubmit={handleSubmit(() => setCurrentStep(2))} className="space-y-2">
            <div className="bg-white rounded-lg p-2.5 md:p-4 border border-gray-200 shadow-sm">
              <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-2">Basic Information</h2>

              <div className="md:grid md:grid-cols-2 md:gap-3">
                {/* Name */}
                <div className="mb-2 md:mb-0">
                  <Input
                    label="Full Name"
                    placeholder="Enter your full name"
                    error={errors.name?.message}
                    {...register('name')}
                    autoComplete="name"
                  />
                </div>

                {/* Email */}
                <div className="mb-2 md:mb-0">
                  <Input
                    type="email"
                    label="Email Address"
                    placeholder="Enter your email"
                    error={errors.email?.message}
                    {...register('email')}
                    autoComplete="email"
                  />
                </div>

                {/* Phone */}
                <div className="mb-2 md:mb-0">
                  <Input
                    type="tel"
                    label="Phone Number"
                    placeholder="Enter 10-digit phone number"
                    error={errors.phone?.message}
                    {...register('phone')}
                    autoComplete="tel"
                    maxLength={10}
                  />
                </div>

                {/* Age */}
                <div className="mb-2 md:mb-0">
                  <Input
                    type="number"
                    label="Age"
                    placeholder="Enter your age"
                    error={errors.age?.message}
                    {...register('age')}
                    min={18}
                    max={100}
                  />
                </div>
              </div>

              {/* Gender */}
              <div className="mb-2 mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2 md:max-w-md">
                  {['male', 'female', 'other'].map((gender) => {
                    const isSelected = watch('gender') === gender;
                    return (
                      <label
                        key={gender}
                        className={`flex items-center justify-center p-1.5 md:p-2 rounded-lg border-2 cursor-pointer transition-colors ${
                          isSelected ? '' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        style={isSelected ? {
                          borderColor: '#3d096d',
                          backgroundColor: '#3d096d1A',
                        } : {}}
                      >
                        <input
                          type="radio"
                          value={gender}
                          {...register('gender')}
                          className="sr-only"
                        />
                        <span className="text-sm font-medium text-gray-900 capitalize">{gender}</span>
                      </label>
                    );
                  })}
                </div>
                {errors.gender && (
                  <p className="mt-0.5 text-xs text-red-500">{errors.gender.message}</p>
                )}
              </div>

              {/* Address */}
              <div className="mb-1.5">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register('address')}
                  placeholder="Enter your complete address"
                  rows={2}
                  className={`w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  style={!errors.address ? {
                    '--focus-border': '#3d096d',
                    '--focus-ring': '#3d096d33',
                  } : {}}
                  onFocus={!errors.address ? (e) => {
                    e.currentTarget.style.borderColor = '#3d096d';
                    e.currentTarget.style.boxShadow = '0 0 0 2px #3d096d33';
                  } : undefined}
                  onBlur={!errors.address ? (e) => {
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.boxShadow = '';
                  } : undefined}
                />
                {errors.address && (
                  <p className="mt-0.5 text-xs text-red-500">{errors.address.message}</p>
                )}
              </div>
            </div>

            {/* Continue Button */}
            <div className="md:flex md:justify-end">
              <Button
                type="submit"
                variant="primary"
                size="sm"
                fullWidth
                className="md:w-auto md:min-w-[160px]"
                disabled={!isStep1Complete()}
              >
                Continue
              </Button>
            </div>
          </form>
        )}

        {/* Step 2: Profile Photo */}
        {currentStep === 2 && (
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-3 md:p-5 border border-gray-200 shadow-sm">
              <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-3">Profile Photo</h2>

              {/* Photo Preview */}
              <div className="flex flex-col items-center mb-3">
                <div className="relative">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Profile"
                      className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 object-cover shadow-lg"
                    style={{ borderColor: '#3d096d' }}
                    />
                  ) : (
                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-gray-300 bg-gray-100 flex items-center justify-center">
                      <svg
                        className="w-14 h-14 md:w-18 md:h-18 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1.5 text-center">
                  Upload a clear profile photo
                </p>
              </div>

              {/* Upload Button */}
              <label className="block">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <div className="w-full border-2 border-dashed rounded-lg p-2.5 md:p-3 text-center cursor-pointer transition-colors" style={{ backgroundColor: '#3d096d1A', borderColor: '#3d096d' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3d096d33'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3d096d1A'}>
                  <svg
                    className="w-7 h-7 mx-auto mb-1.5"
                    style={{ color: '#3d096d' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <p className="text-sm font-medium" style={{ color: '#3d096d' }}>
                    {photoPreview ? 'Change Photo' : 'Select Photo'}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">Max 5MB, JPG/PNG</p>
                </div>
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-2.5 md:justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                fullWidth
                className="md:w-auto md:min-w-[120px]"
                onClick={() => setCurrentStep(1)}
              >
                Back
              </Button>
              {profilePhoto ? (
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  fullWidth
                  className="md:w-auto md:min-w-[160px]"
                  onClick={handlePhotoUpload}
                  isLoading={isUploading}
                  disabled={isUploading}
                >
                  Upload & Continue
                </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-1 md:flex-none md:min-w-[120px]"
                    onClick={() => setCurrentStep(3)}
                  >
                    Skip
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    className="flex-1 md:flex-none md:min-w-[160px]"
                    onClick={() => {
                      // Trigger file input click
                      fileInputRef.current?.click();
                    }}
                  >
                    Select Photo
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Step 3: DigiLocker KYC */}
        {currentStep === 3 && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="bg-white rounded-lg p-4 md:p-5 border border-gray-200 shadow-sm">
              <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-2">KYC Verification</h2>
              <p className="text-xs text-gray-600 mb-4">
                Verify your identity using DigiLocker. All documents are required for booking.
              </p>

              <div className="md:grid md:grid-cols-3 md:gap-4">
                {/* Aadhaar */}
                <div className="mb-3 md:mb-0 p-4 md:p-5 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex flex-col md:flex-col md:items-start md:justify-between gap-3">
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-6 h-6 md:w-7 md:h-7 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm md:text-base font-medium text-gray-900">Aadhaar Card</p>
                        <p className="text-xs md:text-sm text-gray-500">Verify via DigiLocker</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDigiLockerKYC('aadhaar')}
                      className="px-4 py-2 md:px-5 md:py-2.5 bg-blue-500 text-white text-sm md:text-base font-medium rounded-lg hover:bg-blue-600 transition-colors w-full"
                    >
                      Verify
                    </button>
                  </div>
                </div>

                {/* PAN */}
                <div className="mb-3 md:mb-0 p-4 md:p-5 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex flex-col md:flex-col md:items-start md:justify-between gap-3">
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-6 h-6 md:w-7 md:h-7 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm md:text-base font-medium text-gray-900">PAN Card</p>
                        <p className="text-xs md:text-sm text-gray-500">Verify via DigiLocker</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDigiLockerKYC('pan')}
                      className="px-4 py-2 md:px-5 md:py-2.5 bg-yellow-500 text-white text-sm md:text-base font-medium rounded-lg hover:bg-yellow-600 transition-colors w-full"
                    >
                      Verify
                    </button>
                  </div>
                </div>

                {/* Driving License */}
                <div className="mb-3 md:mb-0 p-4 md:p-5 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex flex-col md:flex-col md:items-start md:justify-between gap-3">
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-6 h-6 md:w-7 md:h-7 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm md:text-base font-medium text-gray-900">Driving License</p>
                        <p className="text-xs md:text-sm text-gray-500">Verify via DigiLocker</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDigiLockerKYC('drivingLicense')}
                      className="px-4 py-2 md:px-5 md:py-2.5 bg-green-500 text-white text-sm md:text-base font-medium rounded-lg hover:bg-green-600 transition-colors w-full"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 md:justify-end">
              <Button
                type="button"
                variant="outline"
                size="md"
                fullWidth
                className="md:w-auto md:min-w-[130px]"
                onClick={() => setCurrentStep(2)}
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                className="md:w-auto md:min-w-[180px]"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                Complete Profile
              </Button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};

export default ProfileCompletePage;

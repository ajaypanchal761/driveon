import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';
import toastUtils from '../../config/toast';
import ProfileHeader from '../components/layout/ProfileHeader';
import BottomNavbar from '../components/layout/BottomNavbar';
import { colors } from '../theme/colors';

/**
 * ModuleCompleteProfilePage Component
 * Multi-step form to complete user profile (100% required for booking)
 * Based on document.txt requirements:
 * - Name, Email, Phone, Age, Gender, Address, Profile Photo
 * - Aadhaar, PAN, Driving License (via DigiLocker)
 * Uses module theme colors and design patterns
 */
const ModuleCompleteProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.user);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(user?.profilePhoto || null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    age: user?.age ? String(user.age) : '',
    gender: user?.gender || '',
    address: user?.address || '',
  });
  
  const [errors, setErrors] = useState({});

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  // Validation functions
  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanedPhone = formData.phone.replace(/\D/g, '');
    if (!cleanedPhone || !phoneRegex.test(cleanedPhone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else {
      const age = parseInt(formData.age);
      if (isNaN(age) || age < 18 || age > 100) {
        newErrors.age = 'Age must be between 18 and 100';
      }
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Please select your gender';
    }
    
    if (!formData.address || formData.address.trim().length < 10) {
      newErrors.address = 'Address must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

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

  // Upload profile photo (Frontend only - no backend call)
  const handlePhotoUpload = async () => {
    if (!profilePhoto && !photoPreview) {
      toastUtils.error('Please select a profile photo');
      return;
    }

    if (!profilePhoto) {
      // Photo already exists, move to next step
      setCurrentStep(4);
      return;
    }

    setIsUploading(true);
    // Simulate upload delay (frontend only)
    setTimeout(() => {
      // Create preview URL from selected file
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        toastUtils.success('Profile photo selected successfully');
        setIsUploading(false);
        setCurrentStep(4);
      };
      reader.readAsDataURL(profilePhoto);
    }, 500);
  };

  // Handle step navigation
  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (validateStep2()) {
        setCurrentStep(3);
      }
    } else if (currentStep === 3) {
      handlePhotoUpload();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/profile');
    }
  };

  // Submit profile completion (Frontend only - no backend call)
  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate save delay (frontend only)
    setTimeout(() => {
      toastUtils.success('Profile completed successfully!');
      setIsSubmitting(false);
      navigate('/profile');
    }, 1000);
  };

  // Handle DigiLocker integration (placeholder)
  const handleDigiLockerConnect = (documentType) => {
    toastUtils.info(`${documentType} verification via DigiLocker will be available soon`);
    // TODO: Implement DigiLocker OAuth2 integration
  };

  return (
    <div 
      className="min-h-screen w-full relative pb-32 md:pb-0"
      style={{ backgroundColor: colors.backgroundSecondary }}
    >
      {/* Header */}
      <ProfileHeader />

      {/* Web Container - Centered with max-width */}
      <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="px-4 md:px-6 lg:px-8 xl:px-12 pt-4 md:pt-6 lg:pt-8 pb-6 md:pb-8" style={{ backgroundColor: colors.backgroundPrimary }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm font-semibold" style={{ color: colors.textSecondary }}>
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full h-2 rounded-full" style={{ backgroundColor: colors.backgroundIcon }}>
          <div
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              backgroundColor: colors.backgroundTertiary,
            }}
          />
        </div>
      </div>

      {/* Form Content */}
      <div className="px-4 md:px-6 lg:px-8 xl:px-12 py-6 md:py-8 lg:py-10 pb-32 md:pb-8 overflow-y-auto">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>
              Basic Information
            </h2>
            
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none text-base"
                style={{
                  borderColor: errors.name ? colors.error : colors.borderMedium,
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.textPrimary,
                }}
              />
              {errors.name && (
                <p className="text-xs mt-1" style={{ color: colors.error }}>{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none text-base"
                style={{
                  borderColor: errors.email ? colors.error : colors.borderMedium,
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.textPrimary,
                }}
              />
              {errors.email && (
                <p className="text-xs mt-1" style={{ color: colors.error }}>{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter your phone number"
                maxLength={10}
                className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none text-base"
                style={{
                  borderColor: errors.phone ? colors.error : colors.borderMedium,
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.textPrimary,
                }}
              />
              {errors.phone && (
                <p className="text-xs mt-1" style={{ color: colors.error }}>{errors.phone}</p>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Personal Details */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>
              Personal Details
            </h2>
            
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Age *
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                placeholder="Enter your age"
                min="18"
                max="100"
                className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none text-base"
                style={{
                  borderColor: errors.age ? colors.error : colors.borderMedium,
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.textPrimary,
                }}
              />
              {errors.age && (
                <p className="text-xs mt-1" style={{ color: colors.error }}>{errors.age}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Gender *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['male', 'female', 'other'].map((gender) => (
                  <button
                    key={gender}
                    type="button"
                    onClick={() => handleInputChange('gender', gender)}
                    className="px-4 py-3 rounded-xl border-2 font-semibold text-sm capitalize transition-all"
                    style={{
                      borderColor: formData.gender === gender ? colors.backgroundTertiary : colors.borderMedium,
                      backgroundColor: formData.gender === gender ? colors.backgroundTertiary : colors.backgroundSecondary,
                      color: formData.gender === gender ? colors.backgroundSecondary : colors.textPrimary,
                    }}
                  >
                    {gender}
                  </button>
                ))}
              </div>
              {errors.gender && (
                <p className="text-xs mt-1" style={{ color: colors.error }}>{errors.gender}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Address *
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter your complete address"
                rows="4"
                className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none resize-none text-base"
                style={{
                  borderColor: errors.address ? colors.error : colors.borderMedium,
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.textPrimary,
                }}
              />
              {errors.address && (
                <p className="text-xs mt-1" style={{ color: colors.error }}>{errors.address}</p>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Profile Photo */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>
              Profile Photo
            </h2>
            
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 shadow-lg"
                    style={{ borderColor: colors.backgroundPrimary }}
                  />
                ) : (
                  <div
                    className="w-32 h-32 rounded-full flex items-center justify-center border-4 shadow-lg"
                    style={{
                      backgroundColor: colors.backgroundPrimary,
                      borderColor: colors.backgroundPrimary,
                    }}
                  >
                    <svg
                      className="w-16 h-16"
                      style={{ color: colors.textSecondary }}
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
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 rounded-xl font-semibold text-sm"
                style={{
                  backgroundColor: colors.backgroundPrimary,
                  color: colors.textPrimary,
                }}
              >
                {photoPreview ? 'Change Photo' : 'Upload Photo'}
              </button>
              
              {isUploading && (
                <p className="text-sm mt-2" style={{ color: colors.textSecondary }}>
                  Uploading...
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 4: KYC Documents */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>
              KYC Documents
            </h2>
            <p className="text-sm mb-6" style={{ color: colors.textSecondary }}>
              Verify your identity using DigiLocker. All documents are required for booking.
            </p>
            
            {['Aadhaar', 'PAN', 'Driving License'].map((docType) => (
              <div
                key={docType}
                className="p-4 rounded-xl border-2"
                style={{
                  borderColor: colors.borderMedium,
                  backgroundColor: colors.backgroundSecondary,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: colors.backgroundPrimary }}
                    >
                      <svg
                        className="w-6 h-6"
                        style={{ color: colors.textPrimary }}
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
                    <div>
                      <p className="font-semibold text-base" style={{ color: colors.textPrimary }}>
                        {docType}
                      </p>
                      <p className="text-xs" style={{ color: colors.textSecondary }}>
                        Verify via DigiLocker
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDigiLockerConnect(docType)}
                    className="px-4 py-2 rounded-lg font-semibold text-sm"
                    style={{
                      backgroundColor: colors.backgroundTertiary,
                      color: colors.backgroundSecondary,
                    }}
                  >
                    Connect
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="fixed md:relative md:max-w-3xl md:mx-auto bottom-16 left-0 right-0 px-4 md:px-6 lg:px-8 xl:px-12 py-4 md:py-6 bg-white md:bg-transparent border-t md:border-t-0 z-40" style={{ borderColor: colors.borderMedium }}>
        <div className="flex gap-3 md:gap-4">
          <button
            type="button"
            onClick={handleBack}
            className="flex-1 px-4 py-3 rounded-xl font-semibold text-base border-2"
            style={{
              borderColor: colors.backgroundTertiary,
              backgroundColor: colors.backgroundSecondary,
              color: colors.textPrimary,
            }}
          >
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </button>
          <button
            type="button"
            onClick={currentStep === 4 ? handleSubmit : handleNext}
            disabled={isUploading || isSubmitting}
            className="flex-1 px-4 py-3 rounded-xl font-semibold text-base"
            style={{
              backgroundColor: isUploading || isSubmitting ? colors.textTertiary : colors.backgroundTertiary,
              color: colors.backgroundSecondary,
            }}
          >
            {isUploading ? 'Uploading...' : isSubmitting ? 'Saving...' : currentStep === 4 ? 'Complete Profile' : 'Next'}
          </button>
        </div>
      </div>

      </div>
      {/* Bottom Navbar - Hidden on web */}
      <div className="md:hidden">
        <BottomNavbar />
      </div>
    </div>
  );
};

export default ModuleCompleteProfilePage;


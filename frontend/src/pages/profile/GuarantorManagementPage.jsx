import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { setGuarantor } from '../../store/slices/userSlice';
import { theme } from '../../theme/theme.constants';
import toastUtils from '../../config/toast';

/**
 * GuarantorManagementPage Component
 * Form to add and manage guarantor
 * Based on document.txt - User enters guarantor's phone/email, Guarantor receives invite, completes registration + KYC
 */
const GuarantorManagementPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { guarantor } = useAppSelector((state) => state.user);

  // Form state
  const [name, setName] = useState(guarantor?.details?.name || '');
  const [phone, setPhone] = useState(guarantor?.details?.phone || '');
  const [email, setEmail] = useState(guarantor?.details?.email || '');
  const [relationship, setRelationship] = useState(guarantor?.details?.relationship || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!name.trim()) {
      toastUtils.error('Please enter guarantor name');
      return;
    }

    if (!phone.trim() && !email.trim()) {
      toastUtils.error('Please enter either phone number or email');
      return;
    }

    // Phone validation (10 digits)
    if (phone.trim() && !/^\d{10}$/.test(phone.trim())) {
      toastUtils.error('Please enter a valid 10-digit phone number');
      return;
    }

    // Email validation
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toastUtils.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call to send invite
    setTimeout(() => {
      setIsSubmitting(false);
      
      const guarantorDetails = {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        relationship: relationship.trim() || 'Friend',
      };

      // Update Redux state
      dispatch(setGuarantor({
        added: true,
        verified: false,
        details: guarantorDetails,
      }));

      toastUtils.success('Guarantor invite sent successfully!');
    }, 1500);
  };

  // Handle remove guarantor
  const handleRemoveGuarantor = () => {
    dispatch(setGuarantor({
      added: false,
      verified: false,
      details: null,
    }));
    setName('');
    setPhone('');
    setEmail('');
    setRelationship('');
    toastUtils.success('Guarantor removed successfully');
  };

  // Handle resend invite
  const handleResendInvite = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toastUtils.success('Invite resent successfully!');
    }, 1000);
  };

  return (
    <div className="min-h-screen pb-24 bg-gray-50">
      {/* Header */}
      <header className="text-white relative overflow-hidden shadow-md" style={{ backgroundColor: theme.colors.primary }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12"></div>
        </div>
        <div className="relative px-4 pt-2 pb-2 md:px-6 md:py-3">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-1.5">
              <button
                onClick={() => navigate(-1)}
                className="p-1 -ml-1 touch-target hover:bg-white/10 rounded-lg transition-colors md:p-1.5"
                aria-label="Go back"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-lg md:text-2xl font-bold text-white">Guarantor</h1>
              <div className="w-8"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Status Card */}
      {guarantor.added && (
        <div className="px-4 pt-4 pb-2 md:pt-6 md:pb-2">
          <div className="max-w-7xl mx-auto">
            <div className={`bg-white rounded-xl p-3 md:p-5 shadow-md border-2 ${
              guarantor.verified ? 'border-green-400' : 'border-yellow-400'
            }`}>
            <div className="flex items-start justify-between mb-2.5 md:mb-3">
              <div className="flex items-center gap-2.5 md:gap-4 flex-1">
                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center shadow-sm ${
                  guarantor.verified ? 'bg-gradient-to-br from-green-100 to-green-50' : 'bg-gradient-to-br from-yellow-100 to-yellow-50'
                }`}>
                  <svg className={`w-6 h-6 md:w-8 md:h-8 ${guarantor.verified ? 'text-green-600' : 'text-yellow-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base md:text-xl font-bold mb-1" style={{ color: theme.colors.textPrimary }}>
                    {guarantor.details?.name}
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    {guarantor.details?.phone && (
                      <div className="flex items-center gap-1 md:gap-1.5">
                        <svg className="w-3.5 h-3.5 md:w-4 md:h-4" style={{ color: theme.colors.textSecondary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <p className="text-xs md:text-sm font-medium" style={{ color: theme.colors.textSecondary }}>
                          {guarantor.details.phone}
                        </p>
                      </div>
                    )}
                    {guarantor.details?.email && (
                      <div className="flex items-center gap-1 md:gap-1.5">
                        <svg className="w-3.5 h-3.5 md:w-4 md:h-4" style={{ color: theme.colors.textSecondary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <p className="text-xs md:text-sm font-medium truncate" style={{ color: theme.colors.textSecondary }}>
                          {guarantor.details.email}
                        </p>
                      </div>
                    )}
                    {guarantor.details?.relationship && (
                      <span className="text-xs md:text-sm px-2 md:px-3 py-0.5 md:py-1 rounded-md" style={{ backgroundColor: `${theme.colors.primary}15`, color: theme.colors.primary }}>
                        {guarantor.details.relationship}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <span className={`inline-flex items-center gap-1 md:gap-1.5 text-xs md:text-sm font-bold px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-sm ${
                  guarantor.verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {guarantor.verified ? (
                    <>
                      <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5 md:w-4 md:h-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      Pending
                    </>
                  )}
                </span>
              </div>
            </div>
            
            {!guarantor.verified && (
              <div className="mt-3 pt-3 border-t-2" style={{ borderColor: theme.colors.borderLight }}>
                <div className="flex items-start gap-2 mb-2.5 p-2 rounded-lg bg-yellow-50">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-xs leading-relaxed text-yellow-800">
                    Waiting for guarantor to complete registration and KYC verification.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleResendInvite}
                    disabled={isSubmitting}
                    className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 shadow-sm hover:shadow-md flex items-center justify-center gap-1.5"
                    style={{
                      backgroundColor: theme.colors.primary,
                      color: theme.colors.white,
                    }}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Resend Invite
                  </button>
                  <button
                    onClick={handleRemoveGuarantor}
                    className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-1.5"
                    style={{
                      backgroundColor: `${theme.colors.error}15`,
                      color: theme.colors.error,
                    }}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      )}

      {/* Form Section */}
      <div className="px-4 pt-4 pb-4 md:pt-6 md:pb-4">
        <div className="max-w-7xl mx-auto">
          {!guarantor.added ? (
            <>
              {/* Header Card */}
              <div className="bg-white rounded-xl p-3 md:p-5 shadow-md mb-3 md:mb-4 border" style={{ borderColor: theme.colors.borderLight }}>
                <div className="flex items-center gap-2.5 md:gap-4 mb-1.5 md:mb-2">
                  <div className="w-9 h-9 md:w-12 md:h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${theme.colors.primary}15` }}>
                    <svg className="w-4.5 h-4.5 md:w-6 md:h-6" style={{ color: theme.colors.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-base md:text-xl font-bold" style={{ color: theme.colors.textPrimary }}>
                      Add Guarantor
                    </h2>
                    <p className="text-xs md:text-sm mt-0.5" style={{ color: theme.colors.textSecondary }}>
                      Required for booking cars
                    </p>
                  </div>
                </div>
                <p className="text-xs md:text-sm leading-relaxed mt-1.5 md:mt-2" style={{ color: theme.colors.textSecondary }}>
                  Add a guarantor who will be responsible for your bookings. They need to complete registration and KYC verification via DigiLocker.
                </p>
              </div>

              {/* Form Card */}
              <form onSubmit={handleSubmit} className="bg-white rounded-xl p-3 md:p-5 shadow-md border space-y-3 md:space-y-4" style={{ borderColor: theme.colors.borderLight }}>
              <div className="md:grid md:grid-cols-2 md:gap-4 md:space-y-0 space-y-3">
                {/* Name */}
                <div>
                  <label className="text-xs md:text-sm font-semibold block mb-1.5 flex items-center gap-1" style={{ color: theme.colors.textPrimary }}>
                    <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Guarantor Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter full name"
                      className="w-full pl-10 pr-3 py-2 md:py-2.5 rounded-lg bg-gray-50 border text-sm md:text-base focus:outline-none transition-all"
                    style={{
                      borderColor: theme.colors.borderDefault,
                      color: theme.colors.textPrimary,
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = theme.colors.primary;
                      e.target.style.backgroundColor = theme.colors.white;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = theme.colors.borderDefault;
                      e.target.style.backgroundColor = '#f9fafb';
                    }}
                    required
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: theme.colors.textTertiary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>

                {/* Phone Number */}
                <div>
                  <label className="text-xs md:text-sm font-semibold block mb-1.5 flex items-center gap-1" style={{ color: theme.colors.textPrimary }}>
                    <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="Enter 10-digit number"
                      className="w-full pl-10 pr-3 py-2 md:py-2.5 rounded-lg bg-gray-50 border text-sm md:text-base focus:outline-none transition-all"
                    style={{
                      borderColor: theme.colors.borderDefault,
                      color: theme.colors.textPrimary,
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = theme.colors.primary;
                      e.target.style.backgroundColor = theme.colors.white;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = theme.colors.borderDefault;
                      e.target.style.backgroundColor = '#f9fafb';
                    }}
                    maxLength={10}
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: theme.colors.textTertiary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                  <p className="text-xs md:text-sm mt-1 flex items-center gap-1" style={{ color: theme.colors.textTertiary }}>
                    <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    At least phone number or email is required
                  </p>
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs md:text-sm font-semibold block mb-1.5 flex items-center gap-1" style={{ color: theme.colors.textPrimary }}>
                    <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email address"
                      className="w-full pl-10 pr-3 py-2 md:py-2.5 rounded-lg bg-gray-50 border text-sm md:text-base focus:outline-none transition-all"
                    style={{
                      borderColor: theme.colors.borderDefault,
                      color: theme.colors.textPrimary,
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = theme.colors.primary;
                      e.target.style.backgroundColor = theme.colors.white;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = theme.colors.borderDefault;
                      e.target.style.backgroundColor = '#f9fafb';
                    }}
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: theme.colors.textTertiary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

                {/* Relationship */}
                <div className="md:col-span-2">
                  <label className="text-xs md:text-sm font-semibold block mb-1.5 flex items-center gap-1" style={{ color: theme.colors.textPrimary }}>
                    <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Relationship
                  </label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="w-full px-3 py-2 md:py-2.5 rounded-lg bg-gray-50 border text-sm md:text-base focus:outline-none transition-all"
                  style={{
                    borderColor: theme.colors.borderDefault,
                    color: theme.colors.textPrimary,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = theme.colors.primary;
                    e.target.style.backgroundColor = theme.colors.white;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = theme.colors.borderDefault;
                    e.target.style.backgroundColor = '#f9fafb';
                  }}
                >
                  <option value="">Select relationship</option>
                  <option value="Friend">Friend</option>
                  <option value="Family">Family</option>
                  <option value="Colleague">Colleague</option>
                  <option value="Relative">Relative</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || (!phone.trim() && !email.trim())}
                className="w-full md:col-span-2 py-2.5 md:py-3 rounded-lg font-bold text-sm md:text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.white,
                }}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 md:h-5 md:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Sending Invite...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Send Invite</span>
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3 md:p-5 border-2 shadow-md" style={{ borderColor: `${theme.colors.primary}40` }}>
            <div className="flex items-start gap-2.5 md:gap-4">
              <div className="w-9 h-9 md:w-12 md:h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${theme.colors.primary}20` }}>
                <svg className="w-4.5 h-4.5 md:w-6 md:h-6" style={{ color: theme.colors.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm md:text-lg font-bold mb-1.5 md:mb-2" style={{ color: theme.colors.primary }}>
                  About Guarantor Process
                </h4>
                <p className="text-xs md:text-sm leading-relaxed mb-2 md:mb-3" style={{ color: theme.colors.textSecondary }}>
                  Your guarantor will receive an invite via <span className="font-semibold">{guarantor.details?.phone ? 'SMS' : 'email'}</span>. They need to:
                </p>
                <ul className="text-xs md:text-sm space-y-1.5 md:space-y-2 mb-2 md:mb-3" style={{ color: theme.colors.textSecondary }}>
                  <li className="flex items-start gap-2 md:gap-3">
                    <span className="w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs md:text-sm font-bold" style={{ backgroundColor: `${theme.colors.primary}20`, color: theme.colors.primary }}>1</span>
                    <span>Install the app and register with their details</span>
                  </li>
                  <li className="flex items-start gap-2 md:gap-3">
                    <span className="w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs md:text-sm font-bold" style={{ backgroundColor: `${theme.colors.primary}20`, color: theme.colors.primary }}>2</span>
                    <span>Complete their profile (100% required)</span>
                  </li>
                  <li className="flex items-start gap-2 md:gap-3">
                    <span className="w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs md:text-sm font-bold" style={{ backgroundColor: `${theme.colors.primary}20`, color: theme.colors.primary }}>3</span>
                    <span>Complete KYC verification via DigiLocker</span>
                  </li>
                </ul>
                <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t" style={{ borderColor: `${theme.colors.primary}30` }}>
                  <p className="text-xs md:text-sm font-semibold" style={{ color: theme.colors.primary }}>
                    ⚠️ You can only make bookings once your guarantor is verified.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default GuarantorManagementPage;

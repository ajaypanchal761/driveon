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

  // Form state removed - fields have been removed

  // Handle remove guarantor
  const handleRemoveGuarantor = () => {
    dispatch(setGuarantor({
      added: false,
      verified: false,
      details: null,
    }));
    toastUtils.success('Guarantor removed successfully');
  };

  // Handle resend invite
  const handleResendInvite = () => {
      toastUtils.success('Invite resent successfully!');
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
              <button
                onClick={() => navigate('/profile/guarantor/history')}
                className="p-1 -mr-1 touch-target hover:bg-white/10 rounded-lg transition-colors md:p-1.5"
                aria-label="View history"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
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
                    className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-1.5"
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

      {/* Form Section - Add Guarantor section removed */}
    </div>
  );
};

export default GuarantorManagementPage;

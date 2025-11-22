import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';
import { theme } from '../../theme/theme.constants';
import toastUtils from '../../config/toast';

/**
 * ReferralDashboardPage Component
 * Referral dashboard showing referral code, points, and referral history
 * Based on document.txt - Every user gets referral code, points for signups and trip completions, points usable as discounts
 */
const ReferralDashboardPage = () => {
  const navigate = useNavigate();
  const { referralCode, points } = useAppSelector((state) => state.user);

  // Mock referral data
  const [referrals] = useState([
    {
      id: 1,
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      signupDate: '2024-01-15',
      tripsCompleted: 2,
      pointsEarned: 150, // 50 for signup + 100 for trips
      status: 'active',
    },
    {
      id: 2,
      name: 'Priya Patel',
      email: 'priya@example.com',
      signupDate: '2024-01-10',
      tripsCompleted: 0,
      pointsEarned: 50, // Only signup
      status: 'pending',
    },
    {
      id: 3,
      name: 'Amit Kumar',
      email: 'amit@example.com',
      signupDate: '2024-01-05',
      tripsCompleted: 1,
      pointsEarned: 100, // 50 for signup + 50 for trip
      status: 'active',
    },
  ]);

  // Points system
  const pointsForSignup = 50;
  const pointsForTrip = 50;

  // Handle copy referral code
  const handleCopyReferralCode = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      toastUtils.success('Referral code copied!');
    }
  };

  // Handle share referral
  const handleShareReferral = () => {
    const shareText = `Join DriveOn using my referral code: ${referralCode || 'DRIVE123'}. Get amazing deals on car rentals!`;
    if (navigator.share) {
      navigator.share({
        title: 'Join DriveOn',
        text: shareText,
      }).catch(() => {
        handleCopyReferralCode();
      });
    } else {
      handleCopyReferralCode();
    }
  };

  // Calculate total points from referrals
  const totalPointsFromReferrals = referrals.reduce((sum, ref) => sum + ref.pointsEarned, 0);
  const totalReferrals = referrals.length;
  const activeReferrals = referrals.filter(ref => ref.status === 'active').length;

  // Generate referral code if not exists (mock)
  const displayReferralCode = referralCode || 'DRIVE123';

  return (
    <div className="min-h-screen pb-24 bg-gray-50">
      {/* Header */}
      <header className="text-white relative overflow-hidden shadow-md" style={{ backgroundColor: theme.colors.primary }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12"></div>
        </div>
        <div className="relative px-4 pt-3 pb-3 md:px-6 md:py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => navigate(-1)}
                className="p-1.5 -ml-1 touch-target hover:bg-white/10 rounded-lg transition-colors md:p-2"
                aria-label="Go back"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-lg md:text-2xl font-bold text-white">Referral Dashboard</h1>
              <div className="w-8"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Points Summary Card */}
      <div className="px-4 pt-6 pb-2 md:pt-8 md:pb-2">
        <div className="max-w-7xl mx-auto">
          <div 
            className="rounded-xl p-4 md:p-6 shadow-lg text-white"
            style={{
              background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`,
            }}
          >
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div>
                <p className="text-xs md:text-sm text-white/80 mb-1 md:mb-2">Total Points</p>
                <h2 className="text-3xl md:text-5xl font-bold">{points || totalPointsFromReferrals}</h2>
              </div>
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-xs md:text-sm text-white/70">
              Use points to get discounts on bookings
            </p>
          </div>
        </div>
      </div>

      {/* Referral Code Card */}
      <div className="px-4 pt-2 pb-2">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-md border" style={{ borderColor: theme.colors.borderLight }}>
            <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${theme.colors.primary}15` }}>
                <svg className="w-5 h-5 md:w-6 md:h-6" style={{ color: theme.colors.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm md:text-lg font-semibold mb-0.5" style={{ color: theme.colors.textPrimary }}>
                  Your Referral Code
                </h3>
                <p className="text-xs md:text-sm" style={{ color: theme.colors.textSecondary }}>
                  Share this code to earn points
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
              <div className="flex-1 px-4 py-3 md:py-4 rounded-lg bg-gray-50 border-2 border-dashed" style={{ borderColor: theme.colors.primary }}>
                <p className="text-lg md:text-2xl font-bold text-center font-mono" style={{ color: theme.colors.primary }}>
                  {displayReferralCode}
                </p>
              </div>
              <button
                onClick={handleCopyReferralCode}
                className="px-4 py-3 md:px-6 md:py-4 rounded-lg font-semibold text-sm md:text-base transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.white,
                }}
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </button>
            </div>

            <button
              onClick={handleShareReferral}
              className="w-full py-2.5 md:py-3 rounded-lg font-semibold text-sm md:text-base transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
              style={{
                backgroundColor: `${theme.colors.primary}15`,
                color: theme.colors.primary,
              }}
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share Referral Code
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="px-4 pt-2 pb-2">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm border text-center hover:shadow-md transition-shadow" style={{ borderColor: theme.colors.borderLight }}>
              <p className="text-xs md:text-sm mb-1 md:mb-2" style={{ color: theme.colors.textSecondary }}>Total</p>
              <p className="text-lg md:text-2xl font-bold" style={{ color: theme.colors.primary }}>{totalReferrals}</p>
            </div>
            <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm border text-center hover:shadow-md transition-shadow" style={{ borderColor: theme.colors.borderLight }}>
              <p className="text-xs md:text-sm mb-1 md:mb-2" style={{ color: theme.colors.textSecondary }}>Active</p>
              <p className="text-lg md:text-2xl font-bold" style={{ color: theme.colors.success }}>{activeReferrals}</p>
            </div>
            <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm border text-center hover:shadow-md transition-shadow" style={{ borderColor: theme.colors.borderLight }}>
              <p className="text-xs md:text-sm mb-1 md:mb-2" style={{ color: theme.colors.textSecondary }}>Points</p>
              <p className="text-lg md:text-2xl font-bold" style={{ color: theme.colors.primary }}>{totalPointsFromReferrals}</p>
            </div>
          </div>
        </div>
      </div>

      {/* How to Earn Points */}
      <div className="px-4 pt-2 pb-2">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-md border" style={{ borderColor: theme.colors.borderLight }}>
            <h3 className="text-sm md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2" style={{ color: theme.colors.primary }}>
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              How to Earn Points
            </h3>
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-start gap-3 md:gap-4 p-2.5 md:p-4 rounded-lg" style={{ backgroundColor: `${theme.colors.primary}08` }}>
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs md:text-sm font-bold text-white" style={{ backgroundColor: theme.colors.primary }}>
                  1
                </div>
                <div className="flex-1">
                  <p className="text-xs md:text-base font-semibold mb-0.5 md:mb-1" style={{ color: theme.colors.textPrimary }}>
                    Friend Signs Up
                  </p>
                  <p className="text-xs md:text-sm" style={{ color: theme.colors.textSecondary }}>
                    Earn <span className="font-bold" style={{ color: theme.colors.primary }}>{pointsForSignup} points</span> when someone uses your code to register
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 md:gap-4 p-2.5 md:p-4 rounded-lg" style={{ backgroundColor: `${theme.colors.primary}08` }}>
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs md:text-sm font-bold text-white" style={{ backgroundColor: theme.colors.primary }}>
                  2
                </div>
                <div className="flex-1">
                  <p className="text-xs md:text-base font-semibold mb-0.5 md:mb-1" style={{ color: theme.colors.textPrimary }}>
                    Friend Completes Trip
                  </p>
                  <p className="text-xs md:text-sm" style={{ color: theme.colors.textSecondary }}>
                    Earn <span className="font-bold" style={{ color: theme.colors.primary }}>{pointsForTrip} points</span> for each completed trip by your referrals
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Points Usage Info */}
      <div className="px-4 pt-2 pb-2">
        <div className="max-w-7xl mx-auto">
          <div 
            className="rounded-xl p-4 md:p-6 border-2" 
            style={{ 
              borderColor: `${theme.colors.primary}40`,
              background: `linear-gradient(135deg, ${theme.colors.primary}08 0%, ${theme.colors.primary}15 100%)`,
            }}
          >
            <div className="flex items-start gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${theme.colors.primary}20` }}>
                <svg className="w-5 h-5 md:w-6 md:h-6" style={{ color: theme.colors.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm md:text-lg font-bold mb-1 md:mb-2" style={{ color: theme.colors.primary }}>
                  Use Points for Discounts
                </h4>
                <p className="text-xs md:text-sm leading-relaxed" style={{ color: theme.colors.textSecondary }}>
                  Redeem your points during checkout to get discounts on car rentals. <span className="font-semibold">100 points = ₹50 discount</span>. Points never expire!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Referrals List */}
      <div className="px-4 pt-2 pb-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h3 className="text-sm md:text-lg font-semibold" style={{ color: theme.colors.primary }}>
              Your Referrals ({totalReferrals})
            </h3>
          </div>
          
          {referrals.length === 0 ? (
            <div className="bg-white rounded-xl p-6 md:p-8 text-center shadow-sm border" style={{ borderColor: theme.colors.borderLight }}>
              <svg className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4" style={{ color: theme.colors.textTertiary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-sm md:text-base font-medium mb-1" style={{ color: theme.colors.textPrimary }}>
                No referrals yet
              </p>
              <p className="text-xs md:text-sm" style={{ color: theme.colors.textSecondary }}>
                Share your referral code to start earning points!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
              {referrals.map((referral) => (
                <div
                  key={referral.id}
                  className="bg-white rounded-lg p-3 md:p-4 shadow-sm border hover:shadow-md transition-shadow"
                  style={{ borderColor: theme.colors.borderLight }}
                >
                  <div className="flex items-start justify-between mb-2 md:mb-3">
                    <div className="flex-1">
                      <h4 className="text-sm md:text-base font-semibold mb-0.5 md:mb-1" style={{ color: theme.colors.textPrimary }}>
                        {referral.name}
                      </h4>
                      <p className="text-xs md:text-sm mb-1" style={{ color: theme.colors.textSecondary }}>
                        {referral.email}
                      </p>
                      <div className="flex items-center gap-2 md:gap-3 mt-1.5 md:mt-2">
                        <span className="text-xs md:text-sm px-2 py-0.5 md:px-3 md:py-1 rounded-md" style={{ backgroundColor: `${theme.colors.primary}15`, color: theme.colors.primary }}>
                          {referral.tripsCompleted} trips
                        </span>
                        <span className={`text-xs md:text-sm px-2 py-0.5 md:px-3 md:py-1 rounded-md ${
                          referral.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {referral.status === 'active' ? 'Active' : 'Pending'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs md:text-sm mb-0.5" style={{ color: theme.colors.textSecondary }}>
                        Points Earned
                      </p>
                      <p className="text-base md:text-xl font-bold" style={{ color: theme.colors.primary }}>
                        +{referral.pointsEarned}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs md:text-sm mt-2 md:mt-3 pt-2 md:pt-3 border-t" style={{ color: theme.colors.textTertiary, borderColor: theme.colors.borderLight }}>
                    Joined on {new Date(referral.signupDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferralDashboardPage;

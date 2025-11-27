import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { theme } from '../../theme/theme.constants';

/**
 * BookingPaymentPage Component
 * Payment page - Mobile-optimized with payment options
 * Based on document.txt payment requirements (Razorpay/Stripe integration)
 */
const BookingPaymentPage = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get booking data from navigation state
  const bookingData = location.state;

  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'upi', 'netbanking', 'wallet'
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [bankName, setBankName] = useState('');
  const [walletType, setWalletType] = useState('paytm'); // 'paytm', 'phonepe', 'gpay'
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if no booking data
  useEffect(() => {
    if (!bookingData) {
      navigate(`/booking/${carId}`);
    }
  }, [bookingData, carId, navigate]);

  if (!bookingData) {
    return null;
  }

  const { car, priceDetails, paymentOption } = bookingData;

  // Calculate payment amount
  const paymentAmount = paymentOption === 'advance' 
    ? priceDetails.advancePayment
    : priceDetails.totalPrice;

  // Handle payment submission
  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Validate payment details based on method
    if (paymentMethod === 'card') {
      if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
        alert('Please fill all card details');
        setIsProcessing(false);
        return;
      }
    } else if (paymentMethod === 'upi') {
      if (!upiId) {
        alert('Please enter UPI ID');
        setIsProcessing(false);
        return;
      }
    } else if (paymentMethod === 'netbanking') {
      if (!bankName) {
        alert('Please select bank');
        setIsProcessing(false);
        return;
      }
    }

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      // Navigate to confirmation page
      navigate(`/booking/${carId}/confirm`, {
        state: {
          ...bookingData,
          paymentMethod,
          paymentAmount,
          transactionId: `TXN${Date.now()}`,
        },
      });
    }, 2000);
  };

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Format expiry date
  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="min-h-screen pb-24 bg-white">
      {/* Header */}
      <header className="text-white relative overflow-hidden" style={{ backgroundColor: theme.colors.primary }}>
        <div className="relative px-4 pt-3 pb-2">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 -ml-1 touch-target"
              aria-label="Go back"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg font-bold text-white">Payment</h1>
            <div className="w-8"></div>
          </div>
        </div>
      </header>

      {/* Car Summary Card */}
      <div className="px-4 pt-4 pb-2">
        <div className="bg-white rounded-lg p-3 flex items-center gap-3 shadow-sm border" style={{ borderColor: theme.colors.borderLight }}>
          <img src={car.image} alt={`${car.brand} ${car.model}`} className="w-16 h-16 object-contain" />
          <div className="flex-1">
            <h3 className="font-bold" style={{ color: theme.colors.textPrimary }}>{car.brand} {car.model}</h3>
            <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
              {bookingData.pickupDate} to {bookingData.dropDate}
            </p>
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="px-4 py-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border" style={{ borderColor: theme.colors.borderLight }}>
          <h2 className="font-semibold mb-3" style={{ color: theme.colors.primary }}>Price Breakdown</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between" style={{ color: theme.colors.textSecondary }}>
              <span>Base Price ({priceDetails.totalDays} {priceDetails.totalDays === 1 ? 'day' : 'days'})</span>
              <span>Rs. {priceDetails.basePrice * priceDetails.totalDays}</span>
            </div>
            <div className="flex justify-between font-semibold pt-2 border-t" style={{ color: theme.colors.primary, borderColor: theme.colors.borderLight }}>
              <span>Total Amount</span>
              <span>Rs. {priceDetails.totalPrice}</span>
            </div>
            {paymentOption === 'advance' && (
              <>
                <div className="flex justify-between font-semibold pt-2 border-t" style={{ color: theme.colors.primary, borderColor: theme.colors.borderLight }}>
                  <span>Advance Payment (35%)</span>
                  <span>Rs. {priceDetails.advancePayment}</span>
                </div>
                <div className="flex justify-between text-xs" style={{ color: theme.colors.textSecondary }}>
                  <span>Remaining Amount</span>
                  <span>Rs. {priceDetails.remainingPayment}</span>
                </div>
              </>
            )}
            <div className="flex justify-between font-bold pt-3 border-t-2 text-lg" style={{ color: theme.colors.primary, borderColor: theme.colors.primary }}>
              <span>Amount to Pay</span>
              <span>Rs. {paymentAmount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method Selection */}
      <form onSubmit={handlePayment} className="px-4 py-4 space-y-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border" style={{ borderColor: theme.colors.borderLight }}>
          <h2 className="font-semibold mb-3" style={{ color: theme.colors.primary }}>Payment Method</h2>
          <div className="grid grid-cols-2 gap-2">
            <label className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer border transition-colors ${
              paymentMethod === 'card' ? 'bg-purple-50' : ''
            }`} style={{ borderColor: paymentMethod === 'card' ? theme.colors.primary : theme.colors.borderLight }}>
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4"
                style={{ accentColor: theme.colors.primary }}
              />
              <span className="text-sm font-medium" style={{ color: theme.colors.textPrimary }}>Card</span>
            </label>
            <label className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer border transition-colors ${
              paymentMethod === 'upi' ? 'bg-purple-50' : ''
            }`} style={{ borderColor: paymentMethod === 'upi' ? theme.colors.primary : theme.colors.borderLight }}>
              <input
                type="radio"
                name="paymentMethod"
                value="upi"
                checked={paymentMethod === 'upi'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4"
                style={{ accentColor: theme.colors.primary }}
              />
              <span className="text-sm font-medium" style={{ color: theme.colors.textPrimary }}>UPI</span>
            </label>
            <label className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer border transition-colors ${
              paymentMethod === 'netbanking' ? 'bg-purple-50' : ''
            }`} style={{ borderColor: paymentMethod === 'netbanking' ? theme.colors.primary : theme.colors.borderLight }}>
              <input
                type="radio"
                name="paymentMethod"
                value="netbanking"
                checked={paymentMethod === 'netbanking'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4"
                style={{ accentColor: theme.colors.primary }}
              />
              <span className="text-sm font-medium" style={{ color: theme.colors.textPrimary }}>Net Banking</span>
            </label>
            <label className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer border transition-colors ${
              paymentMethod === 'wallet' ? 'bg-purple-50' : ''
            }`} style={{ borderColor: paymentMethod === 'wallet' ? theme.colors.primary : theme.colors.borderLight }}>
              <input
                type="radio"
                name="paymentMethod"
                value="wallet"
                checked={paymentMethod === 'wallet'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4"
                style={{ accentColor: theme.colors.primary }}
              />
              <span className="text-sm font-medium" style={{ color: theme.colors.textPrimary }}>Wallet</span>
            </label>
          </div>
        </div>

        {/* Card Payment Form */}
        {paymentMethod === 'card' && (
          <div className="bg-white rounded-lg p-4 shadow-sm border" style={{ borderColor: theme.colors.borderLight }}>
            <h3 className="font-semibold mb-3" style={{ color: theme.colors.primary }}>Card Details</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm mb-1 block" style={{ color: theme.colors.textSecondary }}>Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                  className="w-full px-3 py-2.5 rounded-lg bg-white border text-sm focus:outline-none transition-colors"
                  style={{ 
                    borderColor: theme.colors.borderDefault,
                    color: theme.colors.textPrimary,
                  }}
                  onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
                  onBlur={(e) => e.target.style.borderColor = theme.colors.borderDefault}
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>
              <div>
                <label className="text-sm mb-1 block" style={{ color: theme.colors.textSecondary }}>Cardholder Name</label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-white border text-sm focus:outline-none transition-colors"
                  style={{ 
                    borderColor: theme.colors.borderDefault,
                    color: theme.colors.textPrimary,
                  }}
                  onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
                  onBlur={(e) => e.target.style.borderColor = theme.colors.borderDefault}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm mb-1 block" style={{ color: theme.colors.textSecondary }}>Expiry</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                    maxLength={5}
                    className="w-full px-3 py-2.5 rounded-lg bg-white border text-sm focus:outline-none transition-colors"
                    style={{ 
                      borderColor: theme.colors.borderDefault,
                      color: theme.colors.textPrimary,
                    }}
                    onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
                    onBlur={(e) => e.target.style.borderColor = theme.colors.borderDefault}
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm mb-1 block" style={{ color: theme.colors.textSecondary }}>CVV</label>
                  <input
                    type="text"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                    maxLength={3}
                    className="w-full px-3 py-2.5 rounded-lg bg-white border text-sm focus:outline-none transition-colors"
                    style={{ 
                      borderColor: theme.colors.borderDefault,
                      color: theme.colors.textPrimary,
                    }}
                    onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
                    onBlur={(e) => e.target.style.borderColor = theme.colors.borderDefault}
                    placeholder="123"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* UPI Payment Form */}
        {paymentMethod === 'upi' && (
          <div className="bg-white rounded-lg p-4 shadow-sm border" style={{ borderColor: theme.colors.borderLight }}>
            <h3 className="font-semibold mb-3" style={{ color: theme.colors.primary }}>UPI Details</h3>
            <div>
              <label className="text-sm mb-1 block" style={{ color: theme.colors.textSecondary }}>UPI ID</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-white border text-sm focus:outline-none transition-colors"
                style={{ 
                  borderColor: theme.colors.borderDefault,
                  color: theme.colors.textPrimary,
                }}
                onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
                onBlur={(e) => e.target.style.borderColor = theme.colors.borderDefault}
                placeholder="yourname@paytm"
                required
              />
            </div>
          </div>
        )}

        {/* Net Banking Form */}
        {paymentMethod === 'netbanking' && (
          <div className="bg-white rounded-lg p-4 shadow-sm border" style={{ borderColor: theme.colors.borderLight }}>
            <h3 className="font-semibold mb-3" style={{ color: theme.colors.primary }}>Select Bank</h3>
            <div>
              <label className="text-sm mb-1 block" style={{ color: theme.colors.textSecondary }}>Bank Name</label>
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-white border text-sm focus:outline-none transition-colors"
                style={{ 
                  borderColor: theme.colors.borderDefault,
                  color: theme.colors.textPrimary,
                }}
                onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
                onBlur={(e) => e.target.style.borderColor = theme.colors.borderDefault}
                required
              >
                <option value="">Select Bank</option>
                <option value="sbi">State Bank of India</option>
                <option value="hdfc">HDFC Bank</option>
                <option value="icici">ICICI Bank</option>
                <option value="axis">Axis Bank</option>
                <option value="pnb">Punjab National Bank</option>
                <option value="bob">Bank of Baroda</option>
              </select>
            </div>
          </div>
        )}

        {/* Wallet Form */}
        {paymentMethod === 'wallet' && (
          <div className="bg-white rounded-lg p-4 shadow-sm border" style={{ borderColor: theme.colors.borderLight }}>
            <h3 className="font-semibold mb-3" style={{ color: theme.colors.primary }}>Select Wallet</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-colors" style={{ borderColor: walletType === 'paytm' ? theme.colors.primary : theme.colors.borderLight }}>
                <input
                  type="radio"
                  name="walletType"
                  value="paytm"
                  checked={walletType === 'paytm'}
                  onChange={(e) => setWalletType(e.target.value)}
                  className="w-4 h-4"
                  style={{ accentColor: theme.colors.primary }}
                />
                <span className="text-sm font-medium" style={{ color: theme.colors.textPrimary }}>Paytm</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-colors" style={{ borderColor: walletType === 'phonepe' ? theme.colors.primary : theme.colors.borderLight }}>
                <input
                  type="radio"
                  name="walletType"
                  value="phonepe"
                  checked={walletType === 'phonepe'}
                  onChange={(e) => setWalletType(e.target.value)}
                  className="w-4 h-4"
                  style={{ accentColor: theme.colors.primary }}
                />
                <span className="text-sm font-medium" style={{ color: theme.colors.textPrimary }}>PhonePe</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-colors" style={{ borderColor: walletType === 'gpay' ? theme.colors.primary : theme.colors.borderLight }}>
                <input
                  type="radio"
                  name="walletType"
                  value="gpay"
                  checked={walletType === 'gpay'}
                  onChange={(e) => setWalletType(e.target.value)}
                  className="w-4 h-4"
                  style={{ accentColor: theme.colors.primary }}
                />
                <span className="text-sm font-medium" style={{ color: theme.colors.textPrimary }}>Google Pay</span>
              </label>
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="bg-purple-50 rounded-lg p-3 border" style={{ borderColor: theme.colors.primary + '30' }}>
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: theme.colors.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-xs" style={{ color: theme.colors.textSecondary }}>
              Your payment is secured with 256-bit SSL encryption. We do not store your card details.
            </p>
          </div>
        </div>

        {/* Submit Button - Fixed Bottom */}
        <div className="fixed bottom-0 left-0 right-0 border-t-2 border-white/20 px-4 py-4 z-50 shadow-2xl" style={{ backgroundColor: theme.colors.primary }}>
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white">
                Rs. {paymentAmount}
              </span>
              <span className="text-xs text-white/80">
                {paymentOption === 'advance' ? 'Advance Payment' : 'Full Payment'}
              </span>
            </div>
            <button
              type="submit"
              disabled={isProcessing}
              className="px-8 py-3.5 rounded-lg font-bold shadow-xl touch-target active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: '#ffffff',
                color: theme.colors.primary,
                boxShadow: '0 4px 14px 0 rgba(255, 255, 255, 0.3)',
              }}
            >
              {isProcessing ? 'Processing...' : 'Pay Now'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BookingPaymentPage;

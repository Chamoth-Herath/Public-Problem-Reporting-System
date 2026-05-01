import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../../services/authService';

export const ForgotPasswordForm = () => {
  const [step, setStep] = useState(1); // Step 1: Email, Step 2: OTP, Step 3: New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tempToken, setTempToken] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1: Send OTP to email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPassword(email);
      toast.success('OTP sent to your email!');
      setStep(2);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        'Failed to send OTP. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error('Please enter the OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.verifyOtp(email, otp);
      setTempToken(response.tempToken);
      toast.success('OTP verified! Enter your new password.');
      setStep(3);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Invalid OTP. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword) {
      toast.error('Please enter a new password');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(tempToken, newPassword);
      toast.success('Password reset successful! You can now login.');
      // Reset form
      setStep(1);
      setEmail('');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setTempToken('');
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        'Failed to reset password. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-5">
      {/* Step 1: Email */}
      {step === 1 && (
        <>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#B5D4F4] mb-2"
              style={{ fontFamily: 'DM Sans' }}
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#252545] border-2 border-[#3a3a5c] text-[#F1EFE8] rounded-lg focus:outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75] focus:ring-opacity-50 transition-all"
              style={{ fontFamily: 'DM Sans' }}
            />
          </div>

          <button
            onClick={handleSendOtp}
            disabled={loading}
            type="button"
            className="w-full py-3 bg-[#185FA5] hover:bg-[#042C53] text-[#F1EFE8] font-semibold rounded-lg transition-all duration-300 disabled:opacity-50"
            style={{ fontFamily: 'Syne' }}
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </>
      )}

      {/* Step 2: OTP Verification */}
      {step === 2 && (
        <>
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-[#B5D4F4] mb-2"
              style={{ fontFamily: 'DM Sans' }}
            >
              Enter OTP
            </label>
            <p className="text-xs text-gray-400 mb-2">
              We've sent a 6-digit OTP to {email}
            </p>
            <input
              id="otp"
              type="text"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength="6"
              className="w-full px-4 py-3 bg-[#252545] border-2 border-[#3a3a5c] text-[#F1EFE8] rounded-lg focus:outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75] focus:ring-opacity-50 transition-all text-center text-2xl tracking-widest"
              style={{ fontFamily: 'DM Sans' }}
            />
          </div>

          <button
            onClick={handleVerifyOtp}
            disabled={loading}
            type="button"
            className="w-full py-3 bg-[#185FA5] hover:bg-[#042C53] text-[#F1EFE8] font-semibold rounded-lg transition-all duration-300 disabled:opacity-50"
            style={{ fontFamily: 'Syne' }}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>

          <button
            onClick={() => setStep(1)}
            type="button"
            className="w-full py-2 text-[#1D9E75] hover:text-[#185FA5] transition-colors text-sm"
            style={{ fontFamily: 'DM Sans' }}
          >
            Back to Email
          </button>
        </>
      )}

      {/* Step 3: New Password */}
      {step === 3 && (
        <>
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-[#B5D4F4] mb-2"
              style={{ fontFamily: 'DM Sans' }}
            >
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#252545] border-2 border-[#3a3a5c] text-[#F1EFE8] rounded-lg focus:outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75] focus:ring-opacity-50 transition-all"
              style={{ fontFamily: 'DM Sans' }}
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-[#B5D4F4] mb-2"
              style={{ fontFamily: 'DM Sans' }}
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#252545] border-2 border-[#3a3a5c] text-[#F1EFE8] rounded-lg focus:outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75] focus:ring-opacity-50 transition-all"
              style={{ fontFamily: 'DM Sans' }}
            />
          </div>

          <button
            onClick={handleResetPassword}
            disabled={loading}
            type="button"
            className="w-full py-3 bg-[#185FA5] hover:bg-[#042C53] text-[#F1EFE8] font-semibold rounded-lg transition-all duration-300 disabled:opacity-50"
            style={{ fontFamily: 'Syne' }}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>

          <button
            onClick={() => setStep(2)}
            type="button"
            className="w-full py-2 text-[#1D9E75] hover:text-[#185FA5] transition-colors text-sm"
            style={{ fontFamily: 'DM Sans' }}
          >
            Back to OTP
          </button>
        </>
      )}

      {/* Back to login link */}
      <div className="text-center">
        <Link
          to="/login"
          className="text-sm text-[#1D9E75] hover:text-[#185FA5] transition-colors"
          style={{ fontFamily: 'DM Sans' }}
        >
          Back to Login
        </Link>
      </div>
    </form>
  );
};

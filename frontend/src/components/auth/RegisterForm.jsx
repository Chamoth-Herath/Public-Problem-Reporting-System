import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerSchema } from '../../utils/validationSchemas';
import authService from '../../services/authService';

export const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Watch the file input to update the filename display
  const fileInput = watch('gov_bill_proof');
  
  useEffect(() => {
    if (fileInput && fileInput.length > 0) {
      setFileName(fileInput[0].name);
    }
  }, [fileInput]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Create FormData for multipart upload
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append(
        'full_name',
        `${data.first_name} ${data.last_name}`
      );
      formData.append('phone_number', data.phone_number);
      formData.append('location', data.location);
      formData.append('postal_code', data.postal_code);
      formData.append('nic', data.nic);
      formData.append('gov_bill_proof', data.gov_bill_proof[0]);

      await authService.registerCitizen(formData);

      toast.success('Registration submitted. Awaiting admin approval.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        'Registration failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name fields */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="first_name"
            className="block text-sm font-medium text-[#B5D4F4] mb-1"
            style={{ fontFamily: 'DM Sans' }}
          >
            First Name
          </label>
          <input
            {...register('first_name')}
            id="first_name"
            type="text"
            placeholder="John"
            className="w-full px-3 py-2 bg-[#252545] border-2 border-[#3a3a5c] text-[#F1EFE8] rounded-lg focus:outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75] focus:ring-opacity-50 transition-all text-sm"
            style={{ fontFamily: 'DM Sans' }}
          />
          {errors.first_name && (
            <p className="text-red-500 text-xs mt-0.5">
              {errors.first_name.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="last_name"
            className="block text-sm font-medium text-[#B5D4F4] mb-1"
            style={{ fontFamily: 'DM Sans' }}
          >
            Last Name
          </label>
          <input
            {...register('last_name')}
            id="last_name"
            type="text"
            placeholder="Doe"
            className="w-full px-3 py-2 bg-[#252545] border-2 border-[#3a3a5c] text-[#F1EFE8] rounded-lg focus:outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75] focus:ring-opacity-50 transition-all text-sm"
            style={{ fontFamily: 'DM Sans' }}
          />
          {errors.last_name && (
            <p className="text-red-500 text-xs mt-0.5">
              {errors.last_name.message}
            </p>
          )}
        </div>
      </div>

      {/* Email field */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-[#B5D4F4] mb-1"
          style={{ fontFamily: 'DM Sans' }}
        >
          Email
        </label>
        <input
          {...register('email')}
          id="email"
          type="email"
          placeholder="you@example.com"
          className="w-full px-3 py-2 bg-[#252545] border-2 border-[#3a3a5c] text-[#F1EFE8] rounded-lg focus:outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75] focus:ring-opacity-50 transition-all"
          style={{ fontFamily: 'DM Sans' }}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-0.5">{errors.email.message}</p>
        )}
      </div>

      {/* Password field */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-[#B5D4F4] mb-1"
          style={{ fontFamily: 'DM Sans' }}
        >
          Password
        </label>
        <div className="relative">
          <input
            {...register('password')}
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className="w-full px-3 py-2 bg-[#252545] border-2 border-[#3a3a5c] text-[#F1EFE8] rounded-lg focus:outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75] focus:ring-opacity-50 transition-all"
            style={{ fontFamily: 'DM Sans' }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2 text-[#B5D4F4] hover:text-[#1D9E75] transition-colors"
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs mt-0.5">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Phone number field */}
      <div>
        <label
          htmlFor="phone_number"
          className="block text-sm font-medium text-[#B5D4F4] mb-1"
          style={{ fontFamily: 'DM Sans' }}
        >
          Phone Number
        </label>
        <input
          {...register('phone_number')}
          id="phone_number"
          type="tel"
          placeholder="9876543210"
          className="w-full px-3 py-2 bg-[#252545] border-2 border-[#3a3a5c] text-[#F1EFE8] rounded-lg focus:outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75] focus:ring-opacity-50 transition-all"
          style={{ fontFamily: 'DM Sans' }}
        />
        {errors.phone_number && (
          <p className="text-red-500 text-xs mt-0.5">
            {errors.phone_number.message}
          </p>
        )}
      </div>

      {/* NIC field */}
      <div>
        <label
          htmlFor="nic"
          className="block text-sm font-medium text-[#B5D4F4] mb-1"
          style={{ fontFamily: 'DM Sans' }}
        >
          NIC (National ID)
        </label>
        <input
          {...register('nic')}
          id="nic"
          type="text"
          placeholder="123456789AB"
          className="w-full px-3 py-2 bg-[#252545] border-2 border-[#3a3a5c] text-[#F1EFE8] rounded-lg focus:outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75] focus:ring-opacity-50 transition-all"
          style={{ fontFamily: 'DM Sans' }}
        />
        {errors.nic && (
          <p className="text-red-500 text-xs mt-0.5">{errors.nic.message}</p>
        )}
      </div>

      {/* Location field */}
      <div>
        <label
          htmlFor="location"
          className="block text-sm font-medium text-[#B5D4F4] mb-1"
          style={{ fontFamily: 'DM Sans' }}
        >
          Location
        </label>
        <input
          {...register('location')}
          id="location"
          type="text"
          placeholder="City, District"
          className="w-full px-3 py-2 bg-[#252545] border-2 border-[#3a3a5c] text-[#F1EFE8] rounded-lg focus:outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75] focus:ring-opacity-50 transition-all"
          style={{ fontFamily: 'DM Sans' }}
        />
        {errors.location && (
          <p className="text-red-500 text-xs mt-0.5">
            {errors.location.message}
          </p>
        )}
      </div>

      {/* Postal code field */}
      <div>
        <label
          htmlFor="postal_code"
          className="block text-sm font-medium text-[#B5D4F4] mb-1"
          style={{ fontFamily: 'DM Sans' }}
        >
          Postal Code
        </label>
        <input
          {...register('postal_code')}
          id="postal_code"
          type="text"
          placeholder="12345"
          className="w-full px-3 py-2 bg-[#252545] border-2 border-[#3a3a5c] text-[#F1EFE8] rounded-lg focus:outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75] focus:ring-opacity-50 transition-all"
          style={{ fontFamily: 'DM Sans' }}
        />
        {errors.postal_code && (
          <p className="text-red-500 text-xs mt-0.5">
            {errors.postal_code.message}
          </p>
        )}
      </div>

      {/* Gov bill proof file */}
      <div>
        <label
          htmlFor="gov_bill_proof"
          className="block text-sm font-medium text-[#B5D4F4] mb-1"
          style={{ fontFamily: 'DM Sans' }}
        >
          Government Bill Proof
        </label>
        <div className="relative">
          <input
            {...register('gov_bill_proof')}
            id="gov_bill_proof"
            type="file"
            accept="image/jpeg,image/png,application/pdf"
            className="hidden"
          />
          <label
            htmlFor="gov_bill_proof"
            className="block w-full px-3 py-2 bg-[#252545] border-2 border-dashed border-[#1D9E75] text-[#B5D4F4] rounded-lg cursor-pointer hover:bg-[#2a2a4a] transition-all text-center text-sm"
            style={{ fontFamily: 'DM Sans' }}
          >
            {fileName ? fileName : 'Click to upload bill (JPEG, PNG, PDF)'}
          </label>
        </div>
        {errors.gov_bill_proof && (
          <p className="text-red-500 text-xs mt-0.5">
            {errors.gov_bill_proof.message}
          </p>
        )}
      </div>

      {/* Terms checkbox */}
      <div className="flex items-start gap-2">
        <input
          {...register('terms')}
          id="terms"
          type="checkbox"
          className="mt-1 w-4 h-4 rounded border-[#3a3a5c] bg-[#252545] cursor-pointer accent-[#1D9E75]"
        />
        <label
          htmlFor="terms"
          className="text-sm text-[#B5D4F4]"
          style={{ fontFamily: 'DM Sans' }}
        >
          I agree to the{' '}
          <span className="text-[#1D9E75] underline cursor-pointer hover:text-[#185FA5]">
            Terms & Conditions
          </span>
        </label>
      </div>
      {errors.terms && (
        <p className="text-red-500 text-xs">{errors.terms.message}</p>
      )}

      {/* Create account button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-[#185FA5] hover:bg-[#042C53] text-[#F1EFE8] font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 mt-6"
        style={{ fontFamily: 'Syne' }}
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-4 my-4">
        <hr className="flex-1 border-[#3a3a5c]" />
        <span
          className="text-[#B5D4F4] text-xs"
          style={{ fontFamily: 'DM Sans' }}
        >
          Or register with
        </span>
        <hr className="flex-1 border-[#3a3a5c]" />
      </div>

      {/* OAuth buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled
          className="py-2 border-2 border-[#B5D4F4] text-[#F1EFE8] rounded-lg hover:bg-[#252545] transition-all disabled:opacity-50 cursor-not-allowed text-sm"
          style={{ fontFamily: 'DM Sans' }}
        >
          Google
        </button>
        <button
          type="button"
          disabled
          className="py-2 border-2 border-[#B5D4F4] text-[#F1EFE8] rounded-lg hover:bg-[#252545] transition-all disabled:opacity-50 cursor-not-allowed text-sm"
          style={{ fontFamily: 'DM Sans' }}
        >
          Facebook
        </button>
      </div>

      {/* Login link */}
      <p
        className="text-center text-[#B5D4F4] text-sm mt-4"
        style={{ fontFamily: 'DM Sans' }}
      >
        Already have an account?{' '}
        <Link
          to="/login"
          className="text-[#1D9E75] hover:text-[#185FA5] font-semibold transition-colors"
        >
          Login
        </Link>
      </p>
    </form>
  );
};

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginSchema } from '../../utils/validationSchemas';
import authService from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await authService.login(data);
      
      const decoded = jwtDecode(response.token);
      
      login(response.token, response.user);
      
      toast.success('Login successful!');
      
      // Redirect based on role
      if (decoded.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (decoded.role === 'agent') {
        navigate('/agent/dashboard');
      } else {
        navigate('/citizen/dashboard');
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Email field */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-[#B5D4F4] mb-2"
          style={{ fontFamily: 'DM Sans' }}
        >
          Email
        </label>
        <input
          {...register('email')}
          id="email"
          type="email"
          placeholder="you@example.com"
          className="w-full px-4 py-3 bg-[#252545] border-2 border-[#3a3a5c] text-[#F1EFE8] rounded-lg focus:outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75] focus:ring-opacity-50 transition-all"
          style={{ fontFamily: 'DM Sans' }}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password field */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-[#B5D4F4] mb-2"
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
            className="w-full px-4 py-3 bg-[#252545] border-2 border-[#3a3a5c] text-[#F1EFE8] rounded-lg focus:outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75] focus:ring-opacity-50 transition-all"
            style={{ fontFamily: 'DM Sans' }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-[#B5D4F4] hover:text-[#1D9E75] transition-colors"
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Forgot password link */}
      <div className="flex justify-end">
        <Link
          to="/forgot-password"
          className="text-sm text-[#1D9E75] hover:text-[#185FA5] transition-colors"
          style={{ fontFamily: 'DM Sans' }}
        >
          Forgot Password?
        </Link>
      </div>

      {/* Sign in button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-[#185FA5] hover:bg-[#042C53] text-[#F1EFE8] font-semibold rounded-lg transition-all duration-300 disabled:opacity-50"
        style={{ fontFamily: 'Syne' }}
      >
        {loading ? 'Signing In...' : 'Sign In'}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <hr className="flex-1 border-[#3a3a5c]" />
        <span
          className="text-[#B5D4F4] text-sm"
          style={{ fontFamily: 'DM Sans' }}
        >
          Or
        </span>
        <hr className="flex-1 border-[#3a3a5c]" />
      </div>

      {/* OAuth buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled
          className="py-3 border-2 border-[#B5D4F4] text-[#F1EFE8] rounded-lg hover:bg-[#252545] transition-all disabled:opacity-50 cursor-not-allowed"
          style={{ fontFamily: 'DM Sans' }}
        >
          Google
        </button>
        <button
          type="button"
          disabled
          className="py-3 border-2 border-[#B5D4F4] text-[#F1EFE8] rounded-lg hover:bg-[#252545] transition-all disabled:opacity-50 cursor-not-allowed"
          style={{ fontFamily: 'DM Sans' }}
        >
          Facebook
        </button>
      </div>

      {/* Sign up link */}
      <p
        className="text-center text-[#B5D4F4] text-sm mt-6"
        style={{ fontFamily: 'DM Sans' }}
      >
        Don't have an account?{' '}
        <Link
          to="/register"
          className="text-[#1D9E75] hover:text-[#185FA5] font-semibold transition-colors"
        >
          Sign Up
        </Link>
      </p>
    </form>
  );
};

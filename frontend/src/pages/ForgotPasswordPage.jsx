import React from 'react';
import { AuthLayout } from '../components/auth/AuthLayout';
import { ForgotPasswordForm } from '../components/auth/ForgotPasswordForm';

export default function ForgotPasswordPage() {
    return (
        <AuthLayout
            title="Reset Password"
            subtitle="Enter your email to receive an OTP for password reset"
        >
            <ForgotPasswordForm />
        </AuthLayout>
    );
}
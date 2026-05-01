import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { token, user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center">
                <p className="text-[#F1EFE8]">Loading...</p>
            </div>
        );
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/login" replace />;
    }

    return children;
};
import React from 'react';
import { IllustrationPanel } from './IllustrationPanel';

export const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-[#1a1a2e] flex">
      <IllustrationPanel />

      {/* Form area */}
      <div className="w-full md:w-3/5 flex flex-col items-center justify-center px-6 md:px-12 py-8 overflow-y-auto">
        <div className="w-full max-w-md">
          {title && (
            <h1
              className="text-3xl md:text-4xl font-bold text-[#F1EFE8] mb-2"
              style={{ fontFamily: 'Syne' }}
            >
              {title}
            </h1>
          )}
          {subtitle && (
            <p
              className="text-[#B5D4F4] text-sm md:text-base mb-6"
              style={{ fontFamily: 'DM Sans' }}
            >
              {subtitle}
            </p>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

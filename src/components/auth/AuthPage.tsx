import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';

export const AuthPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<'login' | 'signup' | 'forgot-password'>('login');

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-violet-50 flex items-center justify-center p-4">
      {/* Decorative background blobs */}
      <div className="absolute -top-40 -left-40 w-[42rem] h-[42rem] rounded-full bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 blur-3xl opacity-60 -z-10" />
      <div className="absolute -bottom-40 -right-40 w-[36rem] h-[36rem] rounded-full bg-gradient-to-tr from-teal-200 via-cyan-200 to-sky-200 blur-3xl opacity-50 -z-10" />
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 -z-10 opacity-[0.08] bg-[radial-gradient(circle_at_center,theme(colors.black/.8)_1px,transparent_1px)] [background-size:22px_22px]" />

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-10 items-center">
        {/* Left side - Branding */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-violet-700 to-indigo-700 bg-clip-text text-transparent">
              AI-Powered MSP Platform
            </h1>
            <p className="text-lg text-gray-700 max-w-xl">
              Revolutionize your managed service operations with intelligent automation.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-gray-700">Automated ticket management</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-gray-700">Real-time system monitoring</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-gray-700">AI-powered insights</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-gray-700">AWS cloud integration</span>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/60">
            <h3 className="font-semibold text-gray-900 mb-2">Built for AWS Hackathon</h3>
            <p className="text-sm text-gray-700">
              Showcasing cutting-edge cloud technologies and AI automation for modern MSP operations.
            </p>
          </div>
        </div>

        {/* Right side - Auth Form */}
        <div className="w-full">
          {currentView === 'login' && (
            <LoginForm 
              onSwitchToSignup={() => setCurrentView('signup')}
              onForgotPassword={() => setCurrentView('forgot-password')}
            />
          )}
          {currentView === 'signup' && (
            <SignupForm onSwitchToLogin={() => setCurrentView('login')} />
          )}
          {currentView === 'forgot-password' && (
            <ForgotPasswordForm onBackToLogin={() => setCurrentView('login')} />
          )}
        </div>
      </div>
    </div>
  );
};
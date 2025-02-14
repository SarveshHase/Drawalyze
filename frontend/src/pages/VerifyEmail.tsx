import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import authService from '@/appwrite/auth';
import { useAppDispatch } from '@/store/hooks';
import { updateUserData } from '@/store/features/authSlice';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const verifyEmail = async () => {
      const userId = searchParams.get('userId');
      const secret = searchParams.get('secret');

      if (!userId || !secret) {
        setVerificationStatus('error');
        return;
      }

      try {
        await authService.verifyEmail(userId, secret);
        dispatch(updateUserData({ emailVerified: true }));
        setVerificationStatus('success');
        
        // Navigate to home page after 2 seconds
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } catch (error) {
        console.error('Email verification failed:', error);
        setVerificationStatus('error');
      }
    };

    verifyEmail();
  }, [searchParams, dispatch, navigate]);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800/90 backdrop-blur-sm p-8 rounded-lg shadow-lg w-[90%] max-w-md border border-gray-700 text-center">
        {verificationStatus === 'verifying' && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-white">Verifying Email</h2>
            <div className="flex justify-center mb-4">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-300">Please wait while we verify your email address...</p>
          </>
        )}
        
        {verificationStatus === 'success' && (
          <>
            <div className="mb-6 text-green-400">
              <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-green-400">Email Verified!</h2>
            <p className="text-gray-300">Your email has been successfully verified.</p>
            <p className="text-gray-300 mt-2">Redirecting to home page...</p>
          </>
        )}
        
        {verificationStatus === 'error' && (
          <>
            <div className="mb-6 text-red-400">
              <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-red-400">Verification Failed</h2>
            <p className="text-gray-300 mb-4">Sorry, we couldn't verify your email. The link might be invalid or expired.</p>
            <p className="text-gray-300">Please contact support if you continue to have problems with verification.</p>
            <button
              onClick={() => navigate('/signup')}
              className="mt-6 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
            >
              Back to Sign Up
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;

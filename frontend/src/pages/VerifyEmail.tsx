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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        {verificationStatus === 'verifying' && (
          <>
            <h2 className="text-2xl font-bold mb-4">Verifying Email</h2>
            <p className="text-gray-600">Please wait while we verify your email address...</p>
          </>
        )}
        
        {verificationStatus === 'success' && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-green-600">Email Verified!</h2>
            <p className="text-gray-600">Your email has been successfully verified.</p>
            <p className="text-gray-600 mt-2">Redirecting to home page...</p>
          </>
        )}
        
        {verificationStatus === 'error' && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-red-600">Verification Failed</h2>
            <p className="text-gray-600 mb-4">Sorry, we couldn't verify your email. The link might be invalid or expired.</p>
            <p className="text-gray-600">Please contact support if you continue to have problems with verification.</p>
            <button
              onClick={() => navigate('/signup')}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mt-4"
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

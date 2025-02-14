import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login, selectAuthStatus, selectIsEmailVerified } from '@/store/features/authSlice';
import authService from '@/appwrite/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const dispatch = useAppDispatch();
  const authStatus = useAppSelector(selectAuthStatus);
  const isEmailVerified = useAppSelector(selectIsEmailVerified);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { isAuthenticated, user } = await authService.checkAuthStatus();
        if (isAuthenticated && user) {
          dispatch(login({
            email: user.email,
            name: user.name,
            userId: user.$id,
            emailVerified: user.emailVerification
          }));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!authStatus) {
    return <Navigate to="/signup" replace />;
  }

  if (!isEmailVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4 text-yellow-600">Email Verification Required</h2>
          <p className="text-gray-600">Please verify your email address to access this page.</p>
          <p className="text-gray-600 mt-2">Check your inbox for the verification link.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;

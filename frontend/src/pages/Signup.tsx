import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '@/appwrite/auth';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/store/hooks';
import { login } from '@/store/features/authSlice';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [signupStatus, setSignupStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const userData = await authService.createAccount({ email, password, name });
      if (userData) {
        setSignupStatus('success');
        setTimeout(() => {
          navigate('/login');
        }, 5000); // Give user time to read the verification instructions
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800/90 backdrop-blur-sm p-8 rounded-lg shadow-lg w-[90%] max-w-md border border-gray-700">
        {signupStatus === 'success' ? (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center text-green-400">Account Created Successfully!</h2>
            <div className="bg-gray-700/50 border border-gray-600 rounded-md p-4 mb-4">
              <p className="text-gray-200 mb-2">A verification email has been sent to your email address.</p>
              <p className="text-gray-200">Please check your inbox and click the verification link.</p>
              <p className="text-gray-200 mt-4">Redirecting to login page in 5 seconds...</p>
              <p className="text-gray-400 text-sm mt-2">You can login after verifying your email.</p>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center text-white">Sign Up</h2>
            {error && <p className="text-red-400 mb-4">{error}</p>}
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-200">Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-200">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-200">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className={`w-full text-white py-2 px-4 rounded-md ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                disabled={isLoading}
              >
                {isLoading ? 'Signing up...' : 'Sign Up'}
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-300">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Login
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Signup;

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Brain, AlertCircle } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login, resetPassword } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setSuccessMsg('');
      return;
    }

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
            <Brain className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="mt-2 text-sm text-slate-500">Sign in to continue to MindEase</p>
        </div>
        
        {error && (
          <div className="bg-rose-50 text-rose-700 p-3 rounded-xl text-sm flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            {error}
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl text-sm flex items-start font-medium">
            <span className="mr-2">✅</span>
            {successMsg}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
              <input id="email" name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleChange}
                className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow sm:text-sm" 
                placeholder="you@example.com" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
                <button 
                  type="button" 
                  onClick={async () => {
                    setError('');
                    setSuccessMsg('');
                    if(!formData.email) {
                      setError('Please enter your email first to reset your password.');
                    } else {
                      try {
                        const tempPass = await resetPassword(formData.email);
                        setSuccessMsg(`Password reset! Your temporary password is: ${tempPass}`);
                      } catch (err) {
                        setError(err.message);
                      }
                    }
                  }} 
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </button>
              </div>
              <input id="password" name="password" type="password" autoComplete="current-password" required value={formData.password} onChange={handleChange}
                className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow sm:text-sm" 
                placeholder="••••••••" />
            </div>
          </div>

          <div>
            <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm">
              Sign In
            </button>
          </div>
        </form>

        <div className="text-center">
          <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 text-sm">
            Don't have an account? Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Brain, AlertCircle } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    examType: '',
    examDate: '',
    prepStage: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const exams = ['JEE', 'NEET', 'CUET', 'CAT', 'GATE', 'UPSC', 'Board Exams', 'Other'];
  const stages = ['Just Started', '3-6 months left', 'Under 3 months', 'Result Awaiting'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const getPasswordStrength = () => {
    const { password } = formData;
    if (password.length === 0) return { label: '', color: 'bg-slate-200' };
    if (password.length < 6) return { label: 'Weak', color: 'bg-rose-500' };
    if (password.length < 8) return { label: 'Fair', color: 'bg-amber-400' };
    return { label: 'Strong', color: 'bg-emerald-500' };
  };

  const validate = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.examType || !formData.examDate || !formData.prepStage) {
      return 'All fields are required';
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return 'Invalid email format';
    }
    if (formData.password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await register(formData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
            <Brain className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">MindEase</h2>
          <p className="mt-2 text-sm text-slate-500">Your calm companion through exam season</p>
        </div>
        
        {error && (
          <div className="bg-rose-50 text-rose-700 p-3 rounded-xl text-sm flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            {error}
          </div>
        )}

        {success ? (
          <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-center font-medium">
            Account created successfully! Redirecting to login...
          </div>
        ) : (
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input id="name" name="name" type="text" required value={formData.name} onChange={handleChange}
                  className="appearance-none block w-full px-4 py-2.5 border border-slate-300 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow sm:text-sm" />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
                <input id="email" name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleChange}
                  className="appearance-none block w-full px-4 py-2.5 border border-slate-300 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow sm:text-sm" />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input id="password" name="password" type="password" autoComplete="new-password" required value={formData.password} onChange={handleChange}
                  className="appearance-none block w-full px-4 py-2.5 border border-slate-300 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow sm:text-sm" />
                {formData.password && (
                  <div className="mt-2 flex items-center space-x-2">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: strength.label === 'Weak' ? '33%' : strength.label === 'Fair' ? '66%' : '100%' }}></div>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">{strength.label}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Target Exam</label>
                <div className="grid grid-cols-2 gap-2">
                  {exams.map(exam => (
                    <label key={exam} className={`flex items-center p-2 border rounded-lg cursor-pointer transition-colors ${formData.examType === exam ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:border-indigo-200'}`}>
                      <input type="radio" name="examType" value={exam} checked={formData.examType === exam} onChange={handleChange} className="sr-only" />
                      <span className="text-sm font-medium">{exam}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="examDate" className="block text-sm font-medium text-slate-700 mb-1">Exam Date</label>
                <input id="examDate" name="examDate" type="date" required value={formData.examDate} onChange={handleChange}
                  className="appearance-none block w-full px-4 py-2.5 border border-slate-300 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow sm:text-sm" />
              </div>

              <div>
                <label htmlFor="prepStage" className="block text-sm font-medium text-slate-700 mb-1">Preparation Stage</label>
                <select id="prepStage" name="prepStage" required value={formData.prepStage} onChange={handleChange}
                  className="block w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white">
                  <option value="" disabled>Select your stage</option>
                  {stages.map(stage => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm">
                Create Account
              </button>
            </div>
          </form>
        )}

        <div className="text-center">
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 text-sm">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

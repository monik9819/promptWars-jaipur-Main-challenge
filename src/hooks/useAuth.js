import { useState, useEffect } from 'react';
import { getSession, saveSession, clearSession, getUser, saveUser } from '../utils/storage';
import bcrypt from 'bcryptjs';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    if (session) {
      setUser(session);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const storedUser = getUser(email);
    if (!storedUser) {
      throw new Error('User not found');
    }
    
    const isValid = await bcrypt.compare(password, storedUser.passwordHash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const sessionData = {
      email: storedUser.email,
      name: storedUser.name,
      examType: storedUser.examType,
      examDate: storedUser.examDate,
      prepStage: storedUser.prepStage
    };
    
    saveSession(sessionData);
    setUser(sessionData);
    return true;
  };

  const register = async (userData) => {
    const existingUser = getUser(userData.email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(userData.password, salt);

    const newUser = {
      email: userData.email,
      name: userData.name,
      passwordHash,
      examType: userData.examType,
      examDate: userData.examDate,
      prepStage: userData.prepStage
    };

    saveUser(newUser);
    return true;
  };

  const resetPassword = async (email) => {
    const existingUser = getUser(email);
    if (!existingUser) {
      throw new Error('No account found with this email');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash("12345678", salt);

    existingUser.passwordHash = passwordHash;
    saveUser(existingUser);
    
    return "12345678";
  };

  const logout = () => {
    clearSession();
    setUser(null);
    window.location.href = '/login';
  };

  return { user, loading, login, register, logout, resetPassword };
};

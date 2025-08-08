import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Configure axios defaults
const API_BASE_URL = 'http://localhost:3001/api';
axios.defaults.baseURL = API_BASE_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [interceptorReady, setInterceptorReady] = useState(false);

  // Initialize token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('musikkhylla_token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Set up axios interceptor for auth token
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        const currentToken = token || localStorage.getItem('musikkhylla_token');
        if (currentToken) {
          config.headers.Authorization = `Bearer ${currentToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    setInterceptorReady(true);

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, [token]);

  // Check if user is authenticated when we have a token
  useEffect(() => {
    const checkAuth = async () => {
      if (token && interceptorReady) {
        try {
          const response = await axios.get('/auth/me');
          setUser(response.data); // Backend returns user directly, not wrapped in user field
        } catch (error) {
          // Token is invalid, remove it
          localStorage.removeItem('musikkhylla_token');
          setToken(null);
          setUser(null);
        }
      } else if (!token && interceptorReady) {
        // No token, make sure user is cleared and loading is done
        setUser(null);
      }
      
      // Always set loading to false once interceptor is ready
      if (interceptorReady) {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [token, interceptorReady]);

  const requestLoginCode = async (email) => {
    try {
      const response = await axios.post('/auth/request-code', { email });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to send login code' 
      };
    }
  };

  const verifyLoginCode = async (email, code) => {
    try {
      const response = await axios.post('/auth/verify-code', { email, code });
      const { token: newToken, user: userData } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('musikkhylla_token', newToken);
      
      // Update state immediately - this will trigger interceptor update
      setToken(newToken);
      setUser(userData);
      
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to verify code' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('musikkhylla_token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    requestLoginCode,
    verifyLoginCode,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axiosInstance, { handleLogout } from '../services/auth';

interface GoogleLoginButtonProps {
  setUser: (user: any) => void;
  setTopPairs: (pairs: string[]) => void;
  onLoginSuccess: () => void;
  onLoginError: () => void;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ 
  setUser, 
  setTopPairs, 
  onLoginSuccess,
  onLoginError 
}) => {
  const fetchTopPairs = async () => {
    try {
      const response = await axiosInstance.get('/crypto/top-pairs');
      return response.data;
    } catch (error) {
      console.error("Failed to fetch top pairs", error);
      handleLogout();
      return [];
    }
  };

  const handleSuccess = async (credentialResponse: any) => {
    console.log("Google Login Success:", credentialResponse);

    if (credentialResponse.credential) {
      try {
        const response = await axiosInstance.post('/auth/google', {
          credential: credentialResponse.credential,
        });

        const data = await response.data;

        if (data.accessToken) {
          // Store user data
          localStorage.setItem("token", data.accessToken);
          localStorage.setItem("user", JSON.stringify(data.user));
          setUser(data.user);
          
          // Fetch saved pairs from DB after login
          const savedPairs = await fetchSavedPairs(data.accessToken);
          console.log("In List Pairs after login:", savedPairs);

          // Store in localStorage
          localStorage.setItem("selectedPairs", JSON.stringify(savedPairs));

          // Fetch top pairs and update UI
          const topPairs = await fetchTopPairs();
          localStorage.setItem("topPairs", JSON.stringify(topPairs));
          setTopPairs(topPairs);

          // Trigger storage event to update UI
          window.dispatchEvent(new Event('storage'));

          // Notify parent component about successful login
          onLoginSuccess();
        }
      } catch (error) {
        console.error("Login failed", error);
        onLoginError();
        handleLogout();
      }
    }
  };

  const handleError = () => {
    console.log('Login Failed');
    onLoginError();
    handleLogout();
  };

  return (
    <GoogleLogin 
      onSuccess={handleSuccess} 
      onError={handleError} 
      useOneTap 
      theme="filled_black"
    />
  );
};

const fetchSavedPairs = async (token: string) => {
  try {
    const response = await axiosInstance.get('/crypto/get-pairs');
    return response.data || [];
  } catch (error) {
    console.error("Failed to fetch get pairs", error);
    handleLogout();
    return [];
  }
};

export default GoogleLoginButton;

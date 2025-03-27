import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axiosInstance, { handleLogout } from '../services/auth';

const GoogleLoginButton: React.FC<{ setUser: (user: any) => void }> = ({ setUser }) => {
    const handleSuccess = async (credentialResponse: any) => {
      console.log("Google Login Success:", credentialResponse);

      if (credentialResponse.credential) {
        try {
          const response = await axiosInstance.post('/auth/google', {
            token: credentialResponse.credential,
          });

          const data = await response.data;

          if (data.accessToken) {
            localStorage.setItem("token", data.accessToken);
            localStorage.setItem("user", JSON.stringify(data.user));
            setUser(data.user);
            // Fetch saved pairs from DB after login
            const savedPairs = await fetchSavedPairs(data.accessToken);
            console.log("In List Pairs after login:", savedPairs);

            // Store in localStorage and trigger UI update
            localStorage.setItem("selectedPairs", JSON.stringify(savedPairs));
            window.dispatchEvent(new Event("storage")); // Notify Sidebar
          }
        } catch (error) {
            console.error("Login failed", error);
            handleLogout();
        }
      }
    };

    const handleError = () => {
        console.log('Google Login Failed');
        handleLogout();
    };

    return <GoogleLogin onSuccess={handleSuccess} onError={handleError} />;
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

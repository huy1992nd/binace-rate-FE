import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
const BACKEND_URL = 'https://api.huynq.online';

const GoogleLoginButton: React.FC<{ setUser: (user: any) => void }> = ({ setUser }) => {
    const handleSuccess = async (credentialResponse: any) => {
      console.log("Google Login Success:", credentialResponse);

      if (credentialResponse.credential) {
        try {
          // ✅ Send the token to the backend
          console.log("backend url", BACKEND_URL);
          const response = await axios.post(`${BACKEND_URL}/auth/google`, {
            token: credentialResponse.credential,
          });

          const data = await response.data;

          if (data.accessToken) {
            localStorage.setItem("token", data.accessToken);
            localStorage.setItem("user", JSON.stringify(data.user));
            setUser(data.user);
            // ✅ Fetch saved pairs from DB after login
            await fetchSavedPairs(data.accessToken);
              // ✅ Fetch saved pairs from DB after login
            const savedPairs = await fetchSavedPairs(data.accessToken);
            console.log("In List Pairs after login:", savedPairs);

            // ✅ Store in localStorage and trigger UI update
            localStorage.setItem("selectedPairs", JSON.stringify(savedPairs));
            window.dispatchEvent(new Event("storage")); // 🔹 Notify Sidebar
          }
        } catch (error) {
            console.error("Login failed", error);
        }
      }
    };


    const handleError = () => {
        console.log('Google Login Failed');
    };

    return <GoogleLogin onSuccess={handleSuccess} onError={handleError} />;
};

const fetchSavedPairs = async (token: string) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/crypto/get-pairs`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data || [];
  } catch (error) {
    console.error("Failed to fetch get pairs", error);
  }
};

export default GoogleLoginButton;

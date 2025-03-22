import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

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

export default GoogleLoginButton;

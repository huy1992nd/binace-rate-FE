import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const GoogleLoginButton: React.FC = () => {
    const handleSuccess = async (credentialResponse: any) => {
        console.log('Google Login Success:', credentialResponse);

        if (credentialResponse.credential) {
            try {
                // ✅ Send the token to the backend
                console.log('backend url', BACKEND_URL);
                const response = await axios.post(`${BACKEND_URL}/auth/google`, {
                    token: credentialResponse.credential,
                });

                console.log("✅ Backend response:", response.data);
            } catch (error) {
                console.error("❌ Error sending token to backend:", error);
            }
        }
    };


    const handleError = () => {
        console.log('Google Login Failed');
    };

    return <GoogleLogin onSuccess={handleSuccess} onError={handleError} />;
};

export default GoogleLoginButton;

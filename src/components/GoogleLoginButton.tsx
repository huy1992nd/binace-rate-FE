import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

const GoogleLoginButton: React.FC = () => {
    const handleSuccess = (response: any) => {
        console.log('Google Login Success:', response);
    };

    const handleError = () => {
        console.log('Google Login Failed');
    };

    return <GoogleLogin onSuccess={handleSuccess} onError={handleError} />;
};

export default GoogleLoginButton;

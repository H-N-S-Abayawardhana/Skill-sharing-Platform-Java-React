import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const needsProfileUpdate = localStorage.getItem('needsProfileUpdate');
        if (needsProfileUpdate === 'true') {
            localStorage.removeItem('needsProfileUpdate');
            // Redirect to profile completion page instead of profile
            navigate('/complete-profile');
        } else {
            navigate('/profile');
        }
    }, [navigate]);

    return <div>Processing login...</div>;
};

export default OAuthCallback;
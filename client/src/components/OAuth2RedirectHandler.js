import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OAuth2RedirectHandler = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const userDataParam = params.get('userData');
        
        if (userDataParam) {
            try {
                // Parse user data from URI parameter
                const userData = JSON.parse(decodeURIComponent(userDataParam));
                
                // Store user data in localStorage
                localStorage.setItem('user', JSON.stringify(userData));
                
                // Redirect to Profile page
                navigate('/Profile');
            } catch (error) {
                console.error('Failed to process OAuth redirect:', error);
                navigate('/Login', { state: { error: 'OAuth authentication failed' } });
            }
        } else {
            navigate('/Login', { state: { error: 'OAuth authentication failed' } });
        }
    }, [navigate, location]);

    return (
        <div className="oauth-redirect">
            <p>Please wait, redirecting...</p>
        </div>
    );
};

export default OAuth2RedirectHandler;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../Services/authService';
import '../css/Login.css';
import Navbar from '../components/NavBar'

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear any existing errors
        try {
            await authService.login(formData.email, formData.password);
            navigate('/Profile');
        } catch (error) {
            if (typeof error === 'string') {
                setError(error);
            } else if (error.message) {
                setError(error.message);
            } else {
                setError('Login failed. Please try again.');
            }
        }
    };

    const handleGoogleLogin = () => {
        // This should be the authorization endpoint, not the callback URL
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    };

    const handleFacebookLogin = () => {
        window.location.href = 'http://localhost:8080/oauth2/authorization/facebook';
    };

    return (
        <div>
            <Navbar/>
        <div className="login-container">
            <h2>Login</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            <div className="oauth-buttons">
                <button onClick={handleGoogleLogin} className="google-btn">
                    Login with Google
                </button>
                <button onClick={handleFacebookLogin} className="facebook-btn">
                    Login with Facebook
                </button>
            </div>
            <p>
                Don't have an account?{' '}
                <span onClick={() => navigate('/Register')} className="link">
                    Register here
                </span>
            </p>
        </div>
        </div>
    );
};

export default Login; 
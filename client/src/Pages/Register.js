import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../Services/authService';
import '../css/Register.css';
import Navbar from '../components/NavBar';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUserEdit, FaGoogle, FaFacebook } from "react-icons/fa";
import { motion } from "framer-motion"; // Added for animations

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        bio: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [errors, setErrors] = useState({});
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const navigate = useNavigate();

    // Password strength checker
    useEffect(() => {
        const checkPasswordStrength = () => {
            const password = formData.password;
            if (!password) {
                setPasswordStrength(0);
                return;
            }
            
            let strength = 0;
            // Length check
            if (password.length >= 8) strength += 1;
            // Contains number
            if (/\d/.test(password)) strength += 1;
            // Contains lowercase
            if (/[a-z]/.test(password)) strength += 1;
            // Contains uppercase
            if (/[A-Z]/.test(password)) strength += 1;
            // Contains special character
            if (/[^A-Za-z0-9]/.test(password)) strength += 1;
            
            setPasswordStrength(strength);
        };
        
        checkPasswordStrength();
    }, [formData.password]);

    const getPasswordStrengthLabel = () => {
        switch (passwordStrength) {
            case 0: return "Very Weak";
            case 1: return "Weak";
            case 2: return "Fair";
            case 3: return "Good";
            case 4: return "Strong";
            case 5: return "Very Strong";
            default: return "";
        }
    };

    const getPasswordStrengthColor = () => {
        switch (passwordStrength) {
            case 0: return "#ff4d4d";
            case 1: return "#ff4d4d";
            case 2: return "#ffa64d";
            case 3: return "#ffff4d";
            case 4: return "#4dff4d";
            case 5: return "#1aff1a";
            default: return "#e0e0e0";
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const nameRegex = /^[A-Za-z]+$/;
        
        // Username validation
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        } else if (passwordStrength < 3) {
            newErrors.password = 'Password is too weak';
        }

        // First Name validation
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        } else if (!nameRegex.test(formData.firstName)) {
            newErrors.firstName = 'First name should contain only letters';
        }

        // Last Name validation
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        } else if (!nameRegex.test(formData.lastName)) {
            newErrors.lastName = 'Last name should contain only letters';
        }
        
        // Bio validation
        if (!formData.bio.trim()) {
            newErrors.bio = 'Bio is required';
        }
        
        // Profile image validation
        if (!profileImage) {
            newErrors.profileImage = 'Profile image is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleGoogleSignUp = () => {
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    };

    const handleFacebookSignUp = () => {
        window.location.href = 'http://localhost:8080/oauth2/authorization/facebook';
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        
        // Clear specific error when user starts typing
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: ''
            });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
            
            // Clear error when image is uploaded
            if (errors.profileImage) {
                setErrors({
                    ...errors,
                    profileImage: ''
                });
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                setIsSubmitting(true);
                const userData = { ...formData };
                if (profileImage) {
                    userData.profileImage = profileImage;
                }
                await authService.register(userData);
                navigate('/Login');
            } catch (error) {
                setError(error.message || 'Registration failed');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="register-page">
            <Navbar/>
            <motion.div 
                className="register-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="glass-card">
                    <motion.h2 
                        className="register-title"
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        Join Skillshare Today
                    </motion.h2>
                    
                    {error && (
                        <motion.div 
                            className="error-banner"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {error}
                        </motion.div>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-columns">
                            <div className="form-column">
                                <div className={`form-group ${errors.username ? 'invalid' : ''}`}>
                                    <label>Username</label>
                                    <div className="input-wrapper">
                                        <div className="input-with-icon">
                                            <FaUser className="input-icon" />
                                            <input
                                                type="text"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                placeholder="johndoe123"
                                            />
                                        </div>
                                        {errors.username && (
                                            <motion.div 
                                                className="error-message"
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {errors.username}
                                            </motion.div>
                                        )}
                                    </div>
                                </div>

                                <div className={`form-group ${errors.email ? 'invalid' : ''}`}>
                                    <label>Email</label>
                                    <div className="input-wrapper">
                                        <div className="input-with-icon">
                                            <FaEnvelope className="input-icon" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="john.doe@example.com"
                                            />
                                        </div>
                                        {errors.email && (
                                            <motion.div 
                                                className="error-message"
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {errors.email}
                                            </motion.div>
                                        )}
                                    </div>
                                </div>

                                <div className={`form-group ${errors.password ? 'invalid' : ''}`}>
                                    <label>Password</label>
                                    <div className="input-wrapper">
                                        <div className="input-with-icon">
                                            <FaLock className="input-icon" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="••••••••"
                                            />
                                            <div 
                                                className="password-toggle"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </div>
                                        </div>
                                        {formData.password && (
                                            <div className="password-strength">
                                                <div className="strength-bars">
                                                    {[...Array(5)].map((_, index) => (
                                                        <div 
                                                            key={index}
                                                            className={`strength-bar ${index < passwordStrength ? 'active' : ''}`}
                                                            style={{
                                                                backgroundColor: index < passwordStrength ? getPasswordStrengthColor() : ''
                                                            }}
                                                        ></div>
                                                    ))}
                                                </div>
                                                <span className="strength-label" style={{ color: getPasswordStrengthColor() }}>
                                                    {getPasswordStrengthLabel()}
                                                </span>
                                            </div>
                                        )}
                                        {errors.password && (
                                            <motion.div 
                                                className="error-message"
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {errors.password}
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="form-column">
                                <div className={`form-group ${errors.firstName ? 'invalid' : ''}`}>
                                    <label>First Name</label>
                                    <div className="input-wrapper">
                                        <div className="input-with-icon">
                                            <FaUserEdit className="input-icon" />
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                placeholder="John"
                                            />
                                        </div>
                                        {errors.firstName && (
                                            <motion.div 
                                                className="error-message"
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {errors.firstName}
                                            </motion.div>
                                        )}
                                    </div>
                                </div>

                                <div className={`form-group ${errors.lastName ? 'invalid' : ''}`}>
                                    <label>Last Name</label>
                                    <div className="input-wrapper">
                                        <div className="input-with-icon">
                                            <FaUserEdit className="input-icon" />
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                placeholder="Doe"
                                            />
                                        </div>
                                        {errors.lastName && (
                                            <motion.div 
                                                className="error-message"
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {errors.lastName}
                                            </motion.div>
                                            
                                        )}
                                    </div>
                                </div>

                                <div className={`form-group ${errors.bio ? 'invalid' : ''}`}>
                                    <label>Bio</label>
                                    <div className="input-wrapper">
                                        <div className="textarea-with-icon">
                                            <textarea
                                                name="bio"
                                                value={formData.bio}
                                                onChange={handleChange}
                                                placeholder="Tell us about yourself..."
                                            />
                                        </div>
                                        {errors.bio && (
                                            <motion.div 
                                                className="error-message"
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {errors.bio}
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`form-group profile-upload ${errors.profileImage ? 'invalid' : ''}`}>
                            <label>Profile Picture</label>
                            <div className="profile-image-container">
                                <motion.div 
                                    className="image-preview-container"
                                    whileHover={{ scale: previewImage ? 1.05 : 1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {previewImage ? (
                                        <img 
                                            src={previewImage} 
                                            alt="Profile Preview" 
                                            className="profile-preview" 
                                        />
                                    ) : (
                                        <div className="profile-placeholder">
                                            <FaUser />
                                        </div>
                                    )}
                                </motion.div>
                                <div className="file-input-wrapper">
                                    <input
                                        type="file"
                                        name="profileImage"
                                        id="profileImage"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="file-input"
                                    />
                                    <motion.label 
                                        htmlFor="profileImage" 
                                        className="file-input-label"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {profileImage ? 'Change Image' : 'Upload Image'}
                                    </motion.label>
                                </div>
                            </div>
                            {errors.profileImage && (
                                <motion.div 
                                    className="error-message"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {errors.profileImage}
                                </motion.div>
                            )}
                        </div>
                        
                        <motion.button 
                            type="submit" 
                            className="register-btn" 
                            disabled={isSubmitting}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                            {isSubmitting ? (
                                <div className="spinner-container">
                                    <div className="spinner"></div>
                                    <span>Creating Account...</span>
                                </div>
                            ) : 'Create Account'}
                        </motion.button>
                    </form>

                    <div className="divider">
                        <span>or continue with</span>
                    </div>

                    <div className="social-signup-buttons">
                        <motion.button 
                            onClick={handleGoogleSignUp} 
                            className="social-btn google-signup-btn"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                            <FaGoogle className="social-icon" />
                            <span>Google</span>
                        </motion.button>
                        <motion.button 
                            onClick={handleFacebookSignUp} 
                            className="social-btn facebook-signup-btn"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                            <FaFacebook className="social-icon" />
                            <span>Facebook</span>
                        </motion.button>
                    </div>

                    <p className="login-text">
                        Already have an account?{' '}
                        <motion.span 
                            onClick={() => navigate('/Login')} 
                            className="link"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                        >
                            Login here
                        </motion.span>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
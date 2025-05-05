import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../Services/authService';
import '../css/Register.css';
import Navbar from '../components/NavBar'

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        bio: ''
    });
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
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
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear any existing errors
        
        try {
            // Combine form data with profile image
            const userData = { ...formData };
            if (profileImage) {
                userData.profileImage = profileImage;
            }
            
            await authService.register(userData);
            navigate('/Login');
        } catch (error) {
            if (typeof error === 'string') {
                setError(error);
            } else if (error.message) {
                setError(error.message);
            } else {
                setError('Registration failed. Please try again.');
            }
        }
    };

    return (
        <div>
            <Navbar/>
       
        <div className="register-container">
            <h2>Register</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
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
                <div className="form-group">
                    <label>First Name:</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Last Name:</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Bio:</label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Profile Picture:</label>
                    <input
                        type="file"
                        name="profileImage"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    {previewImage && (
                        <div className="image-preview">
                            <img 
                                src={previewImage} 
                                alt="Profile Preview" 
                                style={{ maxWidth: '100px', maxHeight: '100px', marginTop: '10px' }} 
                            />
                        </div>
                    )}
                </div>
                <button type="submit">Register</button>
            </form>
            <p>
                Already have an account?{' '}
                <span onClick={() => navigate('/Login')} className="link">
                    Login here
                </span>
            </p>
        </div>
        </div>
    );
};

export default Register;
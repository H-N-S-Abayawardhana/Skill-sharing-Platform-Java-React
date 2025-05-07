import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../Services/authService';
import '../css/UpdateProfile.css';
import Navbar from '../components/NavBar'

const UpdateProfile = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        bio: '',
    });
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
            navigate('/Login');
            return;
        }
        setFormData({
            username: currentUser.username || '',
            email: currentUser.email || '',
            firstName: currentUser.firstName || '',
            lastName: currentUser.lastName || '',
            bio: currentUser.bio || '',
        });
        if (currentUser.profilePicture) {
            setPreviewImage(currentUser.profilePicture);
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
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
        setLoading(true);
        setError('');

        try {
            const currentUser = authService.getCurrentUser();
            if (!currentUser || !currentUser.id) {
                throw new Error('User not found');
            }

            const updateData = { ...formData };
            if (profileImage) {
                updateData.profileImage = profileImage;
            }

            const updatedUser = await authService.updateProfile(currentUser.id, updateData);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            navigate('/Profile');
        } catch (err) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="UpdateProfile-div">
            <Navbar/>
       
        <div className="UpdateProfile-update-profile-container">
            <h2>Update Profile</h2>
            {error && <div className="UpdateProfile-error-message">{error}</div>}
            
            <form onSubmit={handleSubmit} className="UpdateProfile-update-profile-form">
                <div className="UpdateProfile-form-group">
                    <label>Profile Picture:</label>
                    <input
                        type="file"
                        name="profileImage"
                        onChange={handleImageChange}
                        accept="image/*"
                    />
                    {previewImage && (
                        <div className="UpdateProfile-image-preview">
                            <img
                                src={previewImage}
                                alt="Profile Preview"
                                className="UpdateProfile-preview-image"
                            />
                        </div>
                    )}
                </div>

                <div className="UpdateProfile-form-group">
                    <label>Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="UpdateProfile-form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="UpdateProfile-form-group">
                    <label>First Name:</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                </div>

                <div className="UpdateProfile-form-group">
                    <label>Last Name:</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                </div>

                <div className="UpdateProfile-form-group">
                    <label>Bio:</label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows="4"
                    />
                </div>

                <div className="UpdateProfile-button-group">
                    <button type="submit" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                    <button type="button" onClick={() => navigate('/Profile')} className="UpdateProfile-cancel-button">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
        </div>
    );
};

export default UpdateProfile;

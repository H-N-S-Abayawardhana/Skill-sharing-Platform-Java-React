import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authService } from '../Services/authService';
import '../CSS/Profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [error, setError] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();
    const currentUser = authService.getCurrentUser();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/users/${id}`);
                const data = await response.json();
                setUser(data);
                setFormData(data);
            } catch (error) {
                setError('Failed to fetch user profile');
            }
        };
        fetchUser();
    }, [id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedUser = await authService.updateProfile(id, formData);
            setUser(updatedUser);
            setIsEditing(false);
        } catch (error) {
            setError(error.message || 'Failed to update profile');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete your profile?')) {
            try {
                await authService.deleteProfile(id);
                navigate('/login');
            } catch (error) {
                setError(error.message || 'Failed to delete profile');
            }
        }
    };

    const handleFollow = async () => {
        try {
            await authService.followUser(currentUser.id, id);
            // Refresh user data
            const response = await fetch(`http://localhost:8080/api/users/${id}`);
            const data = await response.json();
            setUser(data);
        } catch (error) {
            setError(error.message || 'Failed to follow user');
        }
    };

    const handleUnfollow = async () => {
        try {
            await authService.unfollowUser(currentUser.id, id);
            // Refresh user data
            const response = await fetch(`http://localhost:8080/api/users/${id}`);
            const data = await response.json();
            setUser(data);
        } catch (error) {
            setError(error.message || 'Failed to unfollow user');
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="profile-container">
            {error && <div className="error-message">{error}</div>}
            <div className="profile-header">
                <img
                    src={user.profilePicture || '/default-avatar.png'}
                    alt="Profile"
                    className="profile-picture"
                />
                <h2>{user.username}</h2>
                {currentUser && currentUser.id !== id && (
                    <button
                        onClick={user.followers?.some(f => f.id === currentUser.id) ? handleUnfollow : handleFollow}
                        className="follow-button"
                    >
                        {user.followers?.some(f => f.id === currentUser.id) ? 'Unfollow' : 'Follow'}
                    </button>
                )}
            </div>

            {isEditing ? (
                <form onSubmit={handleSubmit} className="profile-form">
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
                    <div className="button-group">
                        <button type="submit">Save Changes</button>
                        <button type="button" onClick={() => setIsEditing(false)}>
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <div className="profile-info">
                    <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Bio:</strong> {user.bio}</p>
                    <p><strong>Followers:</strong> {user.followers?.length || 0}</p>
                    <p><strong>Following:</strong> {user.following?.length || 0}</p>
                    {currentUser && currentUser.id === id && (
                        <div className="button-group">
                            <button onClick={() => setIsEditing(true)}>Edit Profile</button>
                            <button onClick={handleDelete} className="delete-button">
                                Delete Profile
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Profile; 
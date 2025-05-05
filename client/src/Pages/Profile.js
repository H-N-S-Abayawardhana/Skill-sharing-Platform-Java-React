import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../Services/authService';
import '../css/Profile.css';
import Navbar from '../components/NavBar'

const Profile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
            navigate('/Login');
            return;
        }
        setUser(currentUser);
    }, [navigate]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete your profile?')) {
            try {
                await authService.deleteProfile(user.id);
                authService.logout();
                navigate('/Login');
            } catch (error) {
                setError(error.message || 'Failed to delete profile');
            }
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div>
            <Navbar/>
       
        <div className="profile-container">
            {error && <div className="error-message">{error}</div>}
            <div className="profile-header">
                <img
                    src={user.profilePicture || '/default-avatar.png'}
                    alt="Profile"
                    className="profile-picture"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/default-avatar.png';
                    }}
                />
                <h2>{user.username}</h2>
            </div>

            <div className="profile-info">
                <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Bio:</strong> {user.bio}</p>
                <div className="button-group">
                    <button onClick={() => navigate('/update-profile')} className="edit-button">
                        Edit Profile
                    </button>
                    <button onClick={handleDelete} className="delete-button">
                        Delete Profile
                    </button>
                </div>
            </div>
        </div>
        </div>
    );
};

export default Profile; 
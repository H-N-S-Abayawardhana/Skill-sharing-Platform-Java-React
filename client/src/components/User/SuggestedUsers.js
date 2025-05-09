import React, { useEffect, useState } from 'react';
import '../../css/SuggestedUsers.css';

const SuggestedUsers = () => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch suggested users on mount
  useEffect(() => {
    fetch('/api/users/suggestions', {
      credentials: 'include', // if using cookies for auth
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}` // if using JWT
      }
    })
      .then(res => res.json())
      .then(data => {
        setSuggestedUsers(data);
        setLoading(false);
      });
  }, []);

  const handleFollow = (userId) => {
    fetch(`/api/users/${userId}/follow`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).then(() => {
      setSuggestedUsers(suggestedUsers.filter(user => user.id !== userId));
    });
  };

  if (loading) return <div>Loading suggestions...</div>;

  return (
    <div className="suggested-users">
      <h3>Suggested for you</h3>
      {suggestedUsers.length === 0 && <div>No suggestions right now.</div>}
      {suggestedUsers.map(user => (
        <div className="suggested-user" key={user.id}>
          <img
            src={user.profilePicture || '/default-profile.png'}
            alt={user.username}
            className="suggested-user-img"
          />
          <div className="suggested-user-info">
            <div className="suggested-user-username">{user.username}</div>
            <div className="suggested-user-fullname">{user.firstName} {user.lastName}</div>
          </div>
          <button
            className="suggested-user-follow-btn"
            onClick={() => handleFollow(user.id)}
          >
            Follow
          </button>
        </div>
      ))}
    </div>
  );
};

export default SuggestedUsers;
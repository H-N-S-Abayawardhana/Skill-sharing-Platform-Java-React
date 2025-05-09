// src/components/JoinSession.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/schedule.css';

const JoinSession = () => {
  const [sessions, setSessions] = useState([]);
  const [joinCode, setJoinCode] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Load sessions from localStorage
  useEffect(() => {
    const loadSessions = () => {
      try {
        const storedSessions = JSON.parse(localStorage.getItem('skillSessions') || '[]');
        
        // Filter public sessions and sort by date (most recent first)
        const publicSessions = storedSessions
          .filter(session => session.isPublic)
          .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
        
        setSessions(publicSessions);
      } catch (err) {
        console.error('Error loading sessions:', err);
        setSessions([]);
      }
    };

    loadSessions();
  }, []);

  const handleJoinDirect = (e) => {
    e.preventDefault();
    
    if (!joinCode.trim()) {
      setError('Please enter a session code');
      return;
    }
    
    if (!displayName.trim()) {
      setError('Please enter your name');
      return;
    }
    
    // Navigate to the join page with the provided code
    navigate(`/join/${joinCode.trim()}`, { 
      state: { 
        displayName: displayName.trim() 
      } 
    });
  };

  const formatDateTime = (dateTimeStr) => {
    try {
      const date = new Date(dateTimeStr);
      return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(date);
    } catch (err) {
      return 'Invalid date';
    }
  };

  const isSessionActive = (startTime) => {
    // Session is considered active if it's within 15 minutes of the start time
    const sessionTime = new Date(startTime).getTime();
    const currentTime = new Date().getTime();
    const timeDiff = Math.abs(sessionTime - currentTime);
    
    // 15 minutes before or after the scheduled time
    return timeDiff <= 15 * 60 * 1000;
  };

  return (
    <div className="join-session-container">
      <h2>Join a Live Skill Session</h2>

      {/* Direct Join Form */}
      <div className="direct-join-section">
        <h3>Join with Session Code</h3>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleJoinDirect} className="direct-join-form">
          <div className="form-group">
            <label htmlFor="displayName">Your Name</label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your display name"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="joinCode">Session Code</label>
            <input
              type="text"
              id="joinCode"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="Enter session code"
              required
            />
          </div>
          
          <button type="submit" className="primary-button">
            Join Session
          </button>
        </form>
      </div>

      {/* Available Sessions List */}
      {sessions.length > 0 && (
        <div className="available-sessions-section">
          <h3>Available Sessions</h3>
          <div className="sessions-list">
            {sessions.map((session) => (
              <div 
                key={session.id} 
                className={`session-card ${isSessionActive(session.startTime) ? 'active-session' : ''}`}
              >
                <h4>{session.title}</h4>
                {session.description && <p className="session-description">{session.description}</p>}
                <div className="session-details">
                  <p>
                    <strong>When:</strong> {formatDateTime(session.startTime)}
                  </p>
                  <p>
                    <strong>Host:</strong> {session.hostName}
                  </p>
                  {session.password && <p className="password-required">Password Required</p>}
                </div>
                <Link 
                  to={`/join/${session.roomName}`}
                  state={{ 
                    session, 
                    displayName 
                  }}
                  className={`join-button ${!isSessionActive(session.startTime) ? 'disabled' : ''}`}
                >
                  {isSessionActive(session.startTime) ? 'Join Now' : 'Not Started Yet'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {sessions.length === 0 && (
        <div className="no-sessions-message">
          <p>No public sessions are currently scheduled.</p>
          <Link to="/schedule" className="create-session-link">Create your own session</Link>
        </div>
      )}
    </div>
  );
};

export default JoinSession;
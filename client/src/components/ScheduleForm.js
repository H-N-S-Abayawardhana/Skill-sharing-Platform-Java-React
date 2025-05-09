// src/components/ScheduleForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateRoomName } from '../Services/jitsiService';
import '../css/schedule.css';

const ScheduleForm = () => {
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    hostName: '',
    password: '',
    isPublic: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSessionData({
      ...sessionData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate form
      if (!sessionData.title.trim() || !sessionData.date || !sessionData.time) {
        throw new Error('Please fill in all required fields');
      }

      // Generate a room name
      const roomName = generateRoomName(sessionData.title.replace(/\s+/g, '-').toLowerCase());
      
      // Create a session object
      const session = {
        id: Date.now().toString(),
        roomName,
        title: sessionData.title,
        description: sessionData.description,
        startTime: `${sessionData.date}T${sessionData.time}`,
        hostName: sessionData.hostName || 'Anonymous Host',
        password: sessionData.password,
        isPublic: sessionData.isPublic,
        createdAt: new Date().toISOString(),
      };

      // Save to localStorage (or you could send to a backend API)
      const existingSessions = JSON.parse(localStorage.getItem('skillSessions') || '[]');
      localStorage.setItem('skillSessions', JSON.stringify([...existingSessions, session]));

      // Redirect to the session detail page or directly to join
      navigate(`/join/${roomName}`, { 
        state: { 
          session,
          isHost: true 
        } 
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="schedule-form-container">
      <h2>Schedule a Live Skill Session</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="schedule-form">
        <div className="form-group">
          <label htmlFor="title">Session Title*</label>
          <input
            type="text"
            id="title"
            name="title"
            value={sessionData.title}
            onChange={handleChange}
            placeholder="e.g. JavaScript Basics Workshop"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={sessionData.description}
            onChange={handleChange}
            placeholder="Describe what you'll cover in this session"
            rows="3"
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Date*</label>
            <input
              type="date"
              id="date"
              name="date"
              value={sessionData.date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="time">Time*</label>
            <input
              type="time"
              id="time"
              name="time"
              value={sessionData.time}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="hostName">Your Display Name</label>
          <input
            type="text"
            id="hostName"
            name="hostName"
            value={sessionData.hostName}
            onChange={handleChange}
            placeholder="How you'll appear in the session"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Session Password (Optional)</label>
          <input
            type="password"
            id="password"
            name="password"
            value={sessionData.password}
            onChange={handleChange}
            placeholder="Leave blank for no password"
          />
          <small>Set a password to restrict access to invited participants</small>
        </div>
        
        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="isPublic"
            name="isPublic"
            checked={sessionData.isPublic}
            onChange={handleChange}
          />
          <label htmlFor="isPublic">Make this session public</label>
          <small>Public sessions can be discovered by other users</small>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="primary-button"
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Schedule Session'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScheduleForm;
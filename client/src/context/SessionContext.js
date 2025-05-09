// src/context/SessionContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const SessionContext = createContext();

// Custom hook to use session context
export const useSessionContext = () => useContext(SessionContext);

// Provider component
export const SessionProvider = ({ children }) => {
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load sessions from localStorage on initial render
  useEffect(() => {
    const loadSessions = () => {
      try {
        const storedSessions = JSON.parse(localStorage.getItem('skillSessions') || '[]');
        setSessions(storedSessions);
      } catch (err) {
        console.error('Error loading sessions from localStorage:', err);
        setSessions([]);
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('skillSessions', JSON.stringify(sessions));
    }
  }, [sessions, loading]);

  // Add a new session
  const addSession = (session) => {
    setSessions((prevSessions) => [...prevSessions, session]);
    return session;
  };

  // Update an existing session
  const updateSession = (sessionId, updates) => {
    setSessions((prevSessions) =>
      prevSessions.map((session) =>
        session.id === sessionId ? { ...session, ...updates } : session
      )
    );
  };

  // Delete a session
  const deleteSession = (sessionId) => {
    setSessions((prevSessions) =>
      prevSessions.filter((session) => session.id !== sessionId)
    );
  };

  // Get a session by ID
  const getSessionById = (sessionId) => {
    return sessions.find((session) => session.id === sessionId);
  };

  // Get a session by room name
  const getSessionByRoomName = (roomName) => {
    return sessions.find((session) => session.roomName === roomName);
  };

  // Set current active session
  const setActiveSession = (session) => {
    setCurrentSession(session);
  };

  // Clear current session
  const clearActiveSession = () => {
    setCurrentSession(null);
  };

  // Get upcoming sessions (sorted by start time)
  const getUpcomingSessions = () => {
    const now = new Date();
    return sessions
      .filter((session) => new Date(session.startTime) > now)
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  };

  // Get past sessions
  const getPastSessions = () => {
    const now = new Date();
    return sessions
      .filter((session) => new Date(session.startTime) < now)
      .sort((a, b) => new Date(b.startTime) - new Date(a.startTime)); // Most recent first
  };

  // Context value
  const value = {
    sessions,
    currentSession,
    loading,
    addSession,
    updateSession,
    deleteSession,
    getSessionById,
    getSessionByRoomName,
    setActiveSession,
    clearActiveSession,
    getUpcomingSessions,
    getPastSessions,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

export default SessionContext;
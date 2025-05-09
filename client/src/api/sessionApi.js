// src/api/sessionApi.js
/**
 * Mock API service for session management
 * Using localStorage for persistence
 */

const STORAGE_KEY = 'skillSessions';

/**
 * Generate a unique ID for new sessions
 * @returns {string} A unique ID
 */
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

/**
 * Get all stored sessions
 * @returns {Array} Array of session objects
 */
export const getAllSessions = () => {
  try {
    const sessions = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return sessions;
  } catch (error) {
    console.error('Error retrieving sessions:', error);
    return [];
  }
};

/**
 * Get a single session by ID
 * @param {string} id - The session ID
 * @returns {Object|null} The session object or null if not found
 */
export const getSessionById = (id) => {
  try {
    const sessions = getAllSessions();
    return sessions.find(session => session.id === id) || null;
  } catch (error) {
    console.error('Error retrieving session:', error);
    return null;
  }
};

/**
 * Create a new session
 * @param {Object} sessionData - The session data
 * @returns {Object} The created session with ID
 */
export const createSession = (sessionData) => {
  try {
    const sessions = getAllSessions();
    
    // Create new session with ID and timestamp
    const newSession = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      ...sessionData
    };
    
    // Add to storage
    sessions.push(newSession);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    
    return newSession;
  } catch (error) {
    console.error('Error creating session:', error);
    throw new Error('Failed to create session');
  }
};

/**
 * Update an existing session
 * @param {string} id - The session ID
 * @param {Object} sessionData - The updated session data
 * @returns {Object} The updated session
 */
export const updateSession = (id, sessionData) => {
  try {
    const sessions = getAllSessions();
    const index = sessions.findIndex(session => session.id === id);
    
    if (index === -1) {
      throw new Error('Session not found');
    }
    
    // Update the session
    const updatedSession = {
      ...sessions[index],
      ...sessionData,
      updatedAt: new Date().toISOString()
    };
    
    sessions[index] = updatedSession;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    
    return updatedSession;
  } catch (error) {
    console.error('Error updating session:', error);
    throw new Error('Failed to update session');
  }
};

/**
 * Delete a session
 * @param {string} id - The session ID
 * @returns {boolean} Success status
 */
export const deleteSession = (id) => {
  try {
    const sessions = getAllSessions();
    const filteredSessions = sessions.filter(session => session.id !== id);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredSessions));
    return true;
  } catch (error) {
    console.error('Error deleting session:', error);
    return false;
  }
};

/**
 * Get public sessions (those without passwords)
 * @returns {Array} Array of public session objects
 */
export const getPublicSessions = () => {
  try {
    const sessions = getAllSessions();
    return sessions.filter(session => !session.password);
  } catch (error) {
    console.error('Error retrieving public sessions:', error);
    return [];
  }
};

/**
 * Join a session
 * @param {string} id - The session ID
 * @param {string} password - The session password (if required)
 * @returns {Object} The session to join
 */
export const joinSession = (id, password = null) => {
  try {
    const session = getSessionById(id);
    
    if (!session) {
      throw new Error('Session not found');
    }
    
    // Check password if the session requires one
    if (session.password && session.password !== password) {
      throw new Error('Incorrect password');
    }
    
    // Update participant count
    updateSession(id, {
      participantCount: (session.participantCount || 0) + 1
    });
    
    return session;
  } catch (error) {
    console.error('Error joining session:', error);
    throw error;
  }
};

export default {
  getAllSessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
  getPublicSessions,
  joinSession
};
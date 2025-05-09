import React, { useState, useEffect } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import NotificationDropdown from './NotificationDropdown';
import { Bell } from 'lucide-react';
import '../../css/Notification.css';

const NotificationBell = () => {
  const { unreadCount, fetchUnreadCount } = useNotifications();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Fetch unread count on mount and set up polling
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) return;
    
    // Initial fetch
    fetchUnreadCount();
    
    // Set up polling for unread count
    const intervalId = setInterval(() => {
      fetchUnreadCount();
    }, 30000); // Every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [fetchUnreadCount]);
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };
  
  return (
    <div className="notification-bell-container">
      <button className="notification-bell-btn" onClick={toggleDropdown}>
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>
      
      <NotificationDropdown 
        isOpen={isDropdownOpen} 
        onClose={closeDropdown} 
      />
    </div>
  );
};

export default NotificationBell;
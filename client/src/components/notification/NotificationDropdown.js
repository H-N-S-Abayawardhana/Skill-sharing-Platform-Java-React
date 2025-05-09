import React, { useRef, useEffect } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import NotificationItem from './NotificationItem';
import { BellRing, Check, Loader } from 'lucide-react';
import '../../css/Notification.css';

const NotificationDropdown = ({ isOpen, onClose }) => {
  const { 
    notifications, 
    unreadCount, 
    loading, 
    error, 
    markAllAsRead, 
    fetchNotifications 
  } = useNotifications();
  
  const dropdownRef = useRef(null);
  
  // Fetch notifications when the dropdown is opened
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  // Handle "Mark all as read" button click
  const handleMarkAllRead = () => {
    markAllAsRead();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="notification-dropdown" ref={dropdownRef}>
      <div className="notification-header">
        <h3 className="notification-title">Notifications</h3>
        {unreadCount > 0 && (
          <button className="mark-all-read-btn" onClick={handleMarkAllRead}>
            <Check size={14} />
            <span>Mark all as read</span>
          </button>
        )}
      </div>
      
      <div className="notification-body">
        {loading ? (
          <div className="notification-loading">
            <Loader size={24} className="spinning" />
            <p>Loading notifications...</p>
          </div>
        ) : error ? (
          <div className="notification-error">
            <p>{error}</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="notification-empty">
            <BellRing size={24} />
            <p>No notifications yet</p>
          </div>
        ) : (
          <div className="notification-list">
            {notifications.map(notification => (
              <NotificationItem 
                key={notification.id} 
                notification={notification} 
              />
            ))}
          </div>
        )}
      </div>
      
      <div className="notification-footer">
        <small>Showing {notifications.length} notifications</small>
      </div>
    </div>
  );
};

export default NotificationDropdown;
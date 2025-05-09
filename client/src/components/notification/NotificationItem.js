import React from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { MessageSquare, Heart, X, Check } from 'lucide-react';
import '../../css/Notification.css';

const NotificationItem = ({ notification }) => {
  const { markAsRead, deleteNotification } = useNotifications();
  
  // Format timestamp to a readable format
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // difference in seconds
    
    if (diff < 60) {
      return 'Just now';
    } else if (diff < 3600) {
      const minutes = Math.floor(diff / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diff < 86400) {
      const hours = Math.floor(diff / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diff < 604800) {
      const days = Math.floor(diff / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // Get correct icon based on notification type
  const getIcon = (type) => {
    switch (type) {
      case 'comment':
      case 'reply':
        return <MessageSquare size={18} className="notification-icon comment-icon" />;
      case 'like':
        return <Heart size={18} className="notification-icon like-icon" />;
      default:
        return <Check size={18} className="notification-icon" />;
    }
  };
  
  // Get correct URL to redirect to based on notification type
  const getRedirectUrl = () => {
    const { resourceType, resourceId } = notification;
    
    if (resourceType === 'post') {
      return `/post/${resourceId}`;
    } else if (resourceType === 'comment') {
      // This might need to be updated based on your routing
      return `/post/${notification.postId}#comment-${resourceId}`;
    }
    
    return '#';
  };
  
  const handleClick = () => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };
  
  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    deleteNotification(notification.id);
  };
  
  return (
    <Link 
      to={getRedirectUrl()} 
      className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
      onClick={handleClick}
    >
      <div className="notification-content">
        <div className="notification-icon-container">
          {getIcon(notification.type)}
        </div>
        <div className="notification-details">
          <p className="notification-message">{notification.message}</p>
          <span className="notification-time">{formatTimestamp(notification.createdAt)}</span>
        </div>
      </div>
      <button className="notification-delete-btn" onClick={handleDelete}>
        <X size={16} />
      </button>
    </Link>
  );
};

export default NotificationItem;
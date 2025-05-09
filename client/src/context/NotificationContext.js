import React, { createContext, useState, useEffect, useContext } from 'react';
import NotificationApi from '../api/NotificationApi';

// Create context
const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Get user ID from localStorage
    const getUserId = () => {
        const userData = localStorage.getItem('userData');
        if (userData) {
            return JSON.parse(userData).id;
        }
        return null;
    };

    // Fetch notifications for the current user
    const fetchNotifications = async () => {
        const userId = getUserId();
        if (!userId) return;

        setLoading(true);
        try {
            const notificationsData = await NotificationApi.getUserNotifications(userId);
            setNotifications(notificationsData);
            setError(null);
        } catch (err) {
            setError('Failed to fetch notifications');
            console.error('Error fetching notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch unread count
    const fetchUnreadCount = async () => {
        const userId = getUserId();
        if (!userId) return;

        try {
            const count = await NotificationApi.getUnreadCount(userId);
            setUnreadCount(count);
        } catch (err) {
            console.error('Error fetching unread count:', err);
        }
    };

    // Mark a notification as read
    const markAsRead = async (notificationId) => {
        try {
            await NotificationApi.markAsRead(notificationId);
            // Update local state
            setNotifications(notifications.map(notification =>
                notification.id === notificationId
                    ? { ...notification, isRead: true }
                    : notification
            ));
            // Update unread count
            fetchUnreadCount();
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    };

    // Mark all notifications as read
    const markAllAsRead = async () => {
        const userId = getUserId();
        if (!userId) return;

        try {
            await NotificationApi.markAllAsRead(userId);
            // Update local state
            setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error('Error marking all notifications as read:', err);
        }
    };

    // Delete a notification
    const deleteNotification = async (notificationId) => {
        try {
            await NotificationApi.deleteNotification(notificationId);
            // Update local state
            setNotifications(notifications.filter(notification => notification.id !== notificationId));
            // Update unread count
            fetchUnreadCount();
        } catch (err) {
            console.error('Error deleting notification:', err);
        }
    };

    // Poll for new notifications every minute
    useEffect(() => {
        const userId = getUserId();
        if (!userId) return;

        // Initial fetch
        fetchNotifications();
        fetchUnreadCount();

        // Set up polling
        const intervalId = setInterval(() => {
            fetchUnreadCount();
        }, 60000); // Every minute

        // Clean up on unmount
        return () => clearInterval(intervalId);
    }, []);

    // Value to be provided by the context
    const value = {
        notifications,
        unreadCount,
        loading,
        error,
        fetchNotifications,
        fetchUnreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
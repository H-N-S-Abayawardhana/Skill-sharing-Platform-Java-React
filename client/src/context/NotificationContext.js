import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import NotificationApi from '../api/NotificationApi';

// Create context
const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check authentication status
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('userData');
        setIsAuthenticated(!!(token && userData));
    }, []);

    // Get user ID from localStorage
    const getUserId = useCallback(() => {
        try {
            const userData = localStorage.getItem('userData');
            if (userData) {
                return JSON.parse(userData).id;
            }
        } catch (error) {
            console.error('Error parsing user data:', error);
        }
        return null;
    }, []);

    // Fetch notifications for the current user
    const fetchNotifications = useCallback(async () => {
        const userId = getUserId();
        if (!userId || !isAuthenticated) {
            setNotifications([]);
            return;
        }

        setLoading(true);
        try {
            const notificationsData = await NotificationApi.getUserNotifications(userId);
            // Sort notifications by date (newest first)
            notificationsData.sort((a, b) => 
                new Date(b.createdAt) - new Date(a.createdAt)
            );
            setNotifications(notificationsData);
            setError(null);
        } catch (err) {
            setError('Failed to fetch notifications');
            console.error('Error fetching notifications:', err);
        } finally {
            setLoading(false);
        }
    }, [getUserId, isAuthenticated]);

    // Fetch unread count
    const fetchUnreadCount = useCallback(async () => {
        const userId = getUserId();
        if (!userId || !isAuthenticated) {
            setUnreadCount(0);
            return;
        }

        try {
            const count = await NotificationApi.getUnreadCount(userId);
            setUnreadCount(count);
        } catch (err) {
            console.error('Error fetching unread count:', err);
            // Don't update state to avoid UI flickering
        }
    }, [getUserId, isAuthenticated]);

    // Mark a notification as read
    const markAsRead = useCallback(async (notificationId) => {
        if (!isAuthenticated) return;

        try {
            await NotificationApi.markAsRead(notificationId);
            // Update local state
            setNotifications(prevNotifications => 
                prevNotifications.map(notification =>
                    notification.id === notificationId
                        ? { ...notification, isRead: true }
                        : notification
                )
            );
            // Update unread count
            setUnreadCount(prevCount => Math.max(0, prevCount - 1));
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    }, [isAuthenticated]);

    // Mark all notifications as read
    const markAllAsRead = useCallback(async () => {
        const userId = getUserId();
        if (!userId || !isAuthenticated) return;

        try {
            await NotificationApi.markAllAsRead(userId);
            // Update local state
            setNotifications(prevNotifications => 
                prevNotifications.map(notification => ({ ...notification, isRead: true }))
            );
            setUnreadCount(0);
        } catch (err) {
            console.error('Error marking all notifications as read:', err);
        }
    }, [getUserId, isAuthenticated]);

    // Delete a notification
    const deleteNotification = useCallback(async (notificationId) => {
        if (!isAuthenticated) return;

        try {
            await NotificationApi.deleteNotification(notificationId);
            // Update local state
            setNotifications(prevNotifications => 
                prevNotifications.filter(notification => notification.id !== notificationId)
            );
            // Check if the deleted notification was unread
            const wasUnread = notifications.find(n => n.id === notificationId && !n.isRead);
            if (wasUnread) {
                setUnreadCount(prevCount => Math.max(0, prevCount - 1));
            }
        } catch (err) {
            console.error('Error deleting notification:', err);
        }
    }, [notifications, isAuthenticated]);

    // Poll for new notifications every minute
    useEffect(() => {
        if (!isAuthenticated) return;

        // Initial fetch
        fetchNotifications();
        fetchUnreadCount();

        // Set up polling
        const intervalId = setInterval(() => {
            fetchUnreadCount();
        }, 60000); // Every minute

        // Clean up on unmount
        return () => clearInterval(intervalId);
    }, [isAuthenticated, fetchNotifications, fetchUnreadCount]);

    // Value to be provided by the context
    const value = {
        notifications,
        unreadCount,
        loading,
        error,
        isAuthenticated,
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
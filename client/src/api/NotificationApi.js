import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/notifications';

class NotificationApi {
  // Get all notifications for a user
  static async getUserNotifications(userId) {
    try {
      const response = await axios.get(`${BASE_URL}/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  // Get only unread notifications for a user
  static async getUnreadNotifications(userId) {
    try {
      const response = await axios.get(`${BASE_URL}/user/${userId}/unread`);
      return response.data;
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
      throw error;
    }
  }

  // Get count of unread notifications for a user
  static async getUnreadCount(userId) {
    try {
      const response = await axios.get(`${BASE_URL}/user/${userId}/unread/count`);
      return response.data.count;
    } catch (error) {
      console.error('Error fetching unread notification count:', error);
      throw error;
    }
  }

  // Mark a single notification as read
  static async markAsRead(notificationId) {
    try {
      const response = await axios.put(`${BASE_URL}/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Mark all notifications as read for a user
  static async markAllAsRead(userId) {
    try {
      await axios.put(`${BASE_URL}/user/${userId}/mark-all-read`);
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  // Delete a notification
  static async deleteNotification(notificationId) {
    try {
      await axios.delete(`${BASE_URL}/${notificationId}`);
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }
}

export default NotificationApi;
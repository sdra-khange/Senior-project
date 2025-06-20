import axiosChat from '../utils/axiosChat';
import Cookie from 'cookie-universal';

const cookie = Cookie();

class ChatService {
  constructor() {
    this.socket = null;
    this.messageHandlers = new Set();
    this.roomUpdateHandlers = new Set();
  }

  // WebSocket connection
  connectWebSocket(roomId) {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    const token = cookie.get("auth-token");
    if (!token) {
      console.error('No authentication token found');
      return;
    }

    if (!roomId) {
      console.error('No room ID provided');
      return;
    }

    const wsUrl = `${process.env.REACT_APP_WS_URL || 'ws://127.0.0.1:8000/ws/chat/'}${roomId}/`;
    
    // Add token to WebSocket URL as a query parameter
    const wsUrlWithToken = `${wsUrl}?token=${token}`;
    this.socket = new WebSocket(wsUrlWithToken);

    this.socket.onopen = () => {
      console.log('WebSocket connected');
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket message received:', data);
        
        if (data.type === 'message') {
          this.messageHandlers.forEach(handler => handler(data.message));
        } else if (data.type === 'room_update') {
          this.roomUpdateHandlers.forEach(handler => handler(data.room));
        } else if (data.type === 'error') {
          console.error('WebSocket error:', data.message);
          // Handle specific error cases
          if (data.message.includes('not authenticated')) {
            // Handle authentication error
            console.error('Authentication failed. Please log in again.');
          } else if (data.message.includes('not a participant')) {
            // Handle participant error
            console.error('You are not a participant in this chat room.');
          }
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason);
      this.socket = null;
      
      // Only attempt to reconnect if the connection was closed unexpectedly
      if (event.code !== 1000) {
        // Attempt to reconnect after 5 seconds
        setTimeout(() => this.connectWebSocket(roomId), 5000);
      }
    };
  }

  // Subscribe to new messages
  subscribeToMessages(handler, roomId) {
    this.messageHandlers.add(handler);
    if (!this.socket) {
      this.connectWebSocket(roomId);
    }
  }

  // Subscribe to room updates
  subscribeToRoomUpdates(handler, roomId) {
    this.roomUpdateHandlers.add(handler);
    if (!this.socket) {
      this.connectWebSocket(roomId);
    }
  }

  // Unsubscribe from messages
  unsubscribeFromMessages(handler) {
    this.messageHandlers.delete(handler);
  }

  // Unsubscribe from room updates
  unsubscribeFromRoomUpdates(handler) {
    this.roomUpdateHandlers.delete(handler);
  }

  // Messages
  async getMessages(roomId, page = 1, pageSize = 50) {
    try {
      const response = await axiosChat.get(`/app/chat/rooms/${roomId}/messages/`, {
        params: { page, page_size: pageSize }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  async sendMessage(roomId, messageData) {
    try {
      console.log('Sending message to room:', roomId, 'Data:', messageData);
      const response = await axiosChat.post(`/app/chat/rooms/${roomId}/messages/`, messageData);
      console.log('Message sent successfully:', response.data);
      
      if (!response.data.sender) {
        console.error('Server response missing sender info:', response.data);
        throw new Error('Server response missing sender information');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error.response?.data || error);
      throw error;
    }
  }

  async markMessagesAsRead(roomId) {
    try {
      const response = await axiosChat.post(`/app/chat/rooms/${roomId}/mark-read/`);
      // Emit a room update event to set unread_count to 0
      this.roomUpdateHandlers.forEach(handler => handler({
        id: roomId,
        unread_count: 0
      }));
      return response.data;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  }

  async getUnreadCount(roomId) {
    try {
      const response = await axiosChat.get(`/app/chat/rooms/${roomId}/unread-count/`);
      return response.data;
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }
  }

  // Participants (Doctor only)
  async addParticipants(roomId, userIds) {
    try {
      const response = await axiosChat.post(`/app/chat/rooms/${roomId}/participants/`, {
        user_ids: userIds
      });
      return response.data;
    } catch (error) {
      console.error('Error adding participants:', error);
      throw error;
    }
  }

  async removeParticipant(roomId, userId) {
    try {
      const response = await axiosChat.delete(`/app/chat/rooms/${roomId}/participants/`, {
        data: { user_id: userId }
      });
      return response.data;
    } catch (error) {
      console.error('Error removing participant:', error);
      throw error;
    }
  }

  // Utility methods
  formatMessageTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
  }

  formatRoomLastActivity(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  }
}

const chatService = new ChatService();
export default chatService;

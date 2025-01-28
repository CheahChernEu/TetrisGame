import axios from 'axios';
import { LeaderboardEntry } from '../types/tetris';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3003';

export const leaderboardService = {
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/leaderboard`);
      return response.data;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }
  },

  async addEntry(entry: LeaderboardEntry): Promise<LeaderboardEntry[]> {
    try {
      const response = await axios.post(`${API_BASE_URL}/leaderboard`, entry);
      return response.data;
    } catch (error) {
      console.error('Error adding leaderboard entry:', error);
      throw error;
    }
  },

  // WebSocket connection for real-time updates with auto-reconnect
  subscribeToUpdates(callback: (leaderboard: LeaderboardEntry[]) => void): WebSocket {
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;
    const reconnectDelay = 1000; // Start with 1 second delay

    const connect = (): WebSocket => {
      const ws = new WebSocket(`${API_BASE_URL.replace('http', 'ws')}/leaderboard-updates`);
      
      ws.onmessage = (event) => {
        try {
          const leaderboard = JSON.parse(event.data);
          callback(leaderboard);
        } catch (error) {
          console.error('Error parsing leaderboard data:', error);
        }
      };

      ws.onclose = () => {
        if (reconnectAttempts < maxReconnectAttempts) {
          reconnectAttempts++;
          const delay = reconnectDelay * Math.pow(2, reconnectAttempts - 1); // Exponential backoff
          console.log(`WebSocket closed. Reconnecting in ${delay}ms...`);
          setTimeout(() => connect(), delay);
        } else {
          console.error('WebSocket connection failed after maximum attempts');
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onopen = () => {
        console.log('WebSocket connected');
        reconnectAttempts = 0; // Reset reconnect attempts on successful connection
      };

      return ws;
    };

    return connect();
  }
};
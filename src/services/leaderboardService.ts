import axios from 'axios';
import { LeaderboardEntry } from '../types/tetris';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3005';

export const leaderboardService = {
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/leaderboard`);
      return response.data;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      // Fallback to localStorage if API fails
      const storedLeaderboard = localStorage.getItem('tetrisLeaderboard');
      return storedLeaderboard ? JSON.parse(storedLeaderboard) : [];
    }
  },

  async addEntry(entry: LeaderboardEntry): Promise<LeaderboardEntry[]> {
    try {
      const response = await axios.post(`${API_BASE_URL}/leaderboard`, entry);
      return response.data;
    } catch (error) {
      console.error('Error adding leaderboard entry:', error);
      // Fallback to localStorage if API fails
      const storedLeaderboard = localStorage.getItem('tetrisLeaderboard');
      const currentLeaderboard = storedLeaderboard ? JSON.parse(storedLeaderboard) : [];
      const updatedLeaderboard = [...currentLeaderboard, entry]
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
      localStorage.setItem('tetrisLeaderboard', JSON.stringify(updatedLeaderboard));
      return updatedLeaderboard;
    }
  },

  // WebSocket connection for real-time updates
  subscribeToUpdates(callback: (leaderboard: LeaderboardEntry[]) => void): WebSocket {
    const ws = new WebSocket(`${API_BASE_URL.replace('http', 'ws')}/leaderboard-updates`);
    
    ws.onmessage = (event) => {
      const leaderboard = JSON.parse(event.data);
      callback(leaderboard);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return ws;
  }
};
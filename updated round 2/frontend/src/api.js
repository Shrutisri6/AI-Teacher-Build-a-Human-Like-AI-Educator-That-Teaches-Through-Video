const API_BASE_URL = 'http://localhost:8000/api';

export const api = {
  // Student Profile
  createProfile: async (profileData) => {
    const response = await fetch(`${API_BASE_URL}/student/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
    if (!response.ok) throw new Error('Failed to create profile');
    return response.json();
  },

  getProfile: async (studentId) => {
    const response = await fetch(`${API_BASE_URL}/student/profile/${studentId}`);
    if (!response.ok) throw new Error('Failed to get profile');
    return response.json();
  },

  getDashboardStats: async (studentId) => {
    const response = await fetch(`${API_BASE_URL}/student/dashboard/${studentId}`);
    if (!response.ok) throw new Error('Failed to fetch dashboard stats');
    return response.json();
  },

  // Lesson
  generateLesson: async (topic, studentId) => {
    const response = await fetch(`${API_BASE_URL}/lesson/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic, student_id: studentId }),
    });
    if (!response.ok) throw new Error('Failed to generate lesson');
    return response.json();
  },

  // Upload
  uploadDocument: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/upload/document`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload document');
    return response.json();
  },

  // Chat Interaction
  chatInteraction: async (data) => {
    const response = await fetch(`${API_BASE_URL}/chat/interaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to get chat response');
    return response.json();
  },
};

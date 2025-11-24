import { useState } from 'react';
import type { TeacherProfile, TeacherMatchRequest } from '../types';

const API_BASE_URL = 'http://localhost:5000';

export function useTeacherMatch() {
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const findTeachers = async (request: TeacherMatchRequest) => {
    setLoading(true);
    setError(null);

    try {
      console.log('Calling teacher match API:', `${API_BASE_URL}/api/match/teachers`, request);

      const response = await fetch(`${API_BASE_URL}/api/match/teachers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers.get('content-type'));

      // Check if response is HTML (error page) instead of JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        throw new Error('Backend server is not responding correctly. Please ensure the backend is running on port 5000.');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Teacher match results:', data);
      
      setTeachers(data.teachers || []);
      return data.teachers;
    } catch (err: any) {
      console.error('Teacher match error:', err);
      setError(err.message || 'Failed to find teachers');
      setTeachers([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setTeachers([]);
    setError(null);
    setLoading(false);
  };

  return {
    teachers,
    loading,
    error,
    findTeachers,
    reset,
  };
}

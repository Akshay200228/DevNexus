import { useState, useEffect } from 'react';
import axios from 'axios';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export function useAuth() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getCookie('token'); // Get the user's token from cookies

    if (token) {
      fetchUserData(token);
    } else {
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      console.log('Sending request to retrieve user data...');

      const apiUrl = process.env.NEXT_PUBLIC || 'https://devnexus-server.onrender.com';
      const response = await axios.get(`${apiUrl}/api/users/authUser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Response data:', response.data);

      setUser(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError(error);
      setIsLoading(false);
    }
  };

  return { user, error, isLoading };
}

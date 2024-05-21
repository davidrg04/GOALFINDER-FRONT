import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const useUserId = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
    }
  }, []);

  return userId;
};

export default useUserId;

import { useMutation } from 'react-query';

export const useChangePassword = () => {
  return useMutation(async ({ oldPassword, newPassword }) => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      throw new Error('Error, no se encuentra el token de autenticación');
    }

    const response = await fetch('http://localhost/GOALFINDER/src/API/ACCESS/changePassword.php', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    const result = await response.json(); 

    if (!response.ok) {
      const error = new Error(result.message || 'Error desconocido');
      error.status = response.status;
      throw error;
    }

    return result; 
  });
};

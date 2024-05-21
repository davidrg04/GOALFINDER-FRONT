 import { useMutation } from 'react-query';

export const useNewPublication = () => {
  return useMutation(async ({ content, file}) => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      message.error('Error, no se encuentra el token de autenticación');
      throw new Error('Error, no se encuentra el token de autenticación');
  }

    const formData = new FormData();
    formData.append('content', content);
    formData.append('file', file);

    const response = await fetch('https://goalfinder-back-production.up.railway.app/API/PUBLICATIONS/newPublication.php', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Falló la creación de la publicación');
    }

    return response.json();
  });
};

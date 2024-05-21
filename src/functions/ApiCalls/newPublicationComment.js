import { useMutation } from 'react-query';

export const useNewPublicationComment = () => {
  return useMutation(async ({ comment, idPublication, userId}) => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
        message.error('Error, no se encuentra el token de autenticación');
        throw new Error('Error, no se encuentra el token de autenticación');
    }

    const response = await fetch('https://goalfinder-back-production.up.railway.app/API/PUBLICATIONS/newCommentPublication.php', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({comment, idPublication, userId})
    });

    if (!response.ok) {
      throw new Error('Falló el envío del comentario');
    }

    return response.json();
  });
};

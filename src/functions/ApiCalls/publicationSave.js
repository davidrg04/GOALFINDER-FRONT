import { useMutation } from 'react-query';

export const usePublicationSaves = () => {
  return useMutation(async ({idPublication, isSave}) => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      message.error('Error, no se encuentra el token de autenticación');
      throw new Error('Error, no se encuentra el token de autenticación');
  }

    const response = await fetch('https://goalfinder-back-production.up.railway.app/API/PUBLICATIONS/publicationSaves.php', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
        body: JSON.stringify({idPublication, isSave}),
    });

    if (!response.ok) {
      throw new Error('Falló al guardar la publicación');
    }

    return response.json();
  });
};

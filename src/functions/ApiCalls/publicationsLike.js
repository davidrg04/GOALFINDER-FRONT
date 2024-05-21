import { useMutation } from 'react-query';

export const usePublicationLikes = () => {
  return useMutation(async ({idPublication, isLike}) => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      message.error('Error, no se encuentra el token de autenticación');
      throw new Error('Error, no se encuentra el token de autenticación');
    }

    const response = await fetch('http://localhost/GOALFINDER/src/API/PUBLICATIONS/publicationLikes.php', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
        body: JSON.stringify({idPublication, isLike}),
    });

    if (!response.ok) {
      throw new Error('Falló al dar like a la publicación');
    }

    return response.json();
  });
};

import { useMutation } from 'react-query';

export const useDeletePublications = () => {
  return useMutation(async ({idPublication}) => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      message.error('Error, no se encuentra el token de autenticación');
      throw new Error('Error, no se encuentra el token de autenticación');
  }

    const response = await fetch('http://localhost/GOALFINDER/src/API/PUBLICATIONS/deletePublication.php', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
        body: JSON.stringify({idPublication}),
    });

    if (!response.ok) {
      throw new Error('Falló al eliminar la publicación');
    }

    return response.json();
  });
};

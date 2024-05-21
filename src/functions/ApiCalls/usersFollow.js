import { useMutation } from 'react-query';

export const useUsersFollow = () => {
  return useMutation(async ({user, isFollow}) => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      message.error('Error, no se encuentra el token de autenticación');
      throw new Error('Error, no se encuentra el token de autenticación');
  }

    const response = await fetch('https://goalfinder-back-production.up.railway.app/src/API/ACCESS/usersFollow.php', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
        body: JSON.stringify({user, isFollow}),
    });

    if (!response.ok) {
      throw new Error('Falló al dar like a la publicación');
    }

    return response.json();
  });
};

import { useMutation } from 'react-query';

export const useDeleteComment = () => {
  return useMutation(async ({idPublication, idComment}) => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      message.error('Error, no se encuentra el token de autenticación');
      throw new Error('Error, no se encuentra el token de autenticación');
  }

    const response = await fetch('https://goalfinder-back-production.up.railway.app/API/PUBLICATIONS/deleteComment.php', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
        body: JSON.stringify({idPublication,idComment}),
    });

    if (!response.ok) {
      throw new Error('Falló al eliminar el comentario');
    }

    return response.json();
  });
};

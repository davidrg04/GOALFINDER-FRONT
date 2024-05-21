import { useMutation } from 'react-query';

export const useNewOffer = () => {
  return useMutation(async (content) => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      message.error('Error, no se encuentra el token de autenticación');
      throw new Error('Error, no se encuentra el token de autenticación');
    }

    const startDate = content.duration[0].format('YYYY-MM');
    const endDate = content.duration[1].format('YYYY-MM');

    const newContent = {
        ...content,
        startDate : startDate,
        endDate : endDate,
    };

    const response = await fetch('https://goalfinder-back-production.up.railway.app/API/OFFERS/newOffer.php', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(newContent),
    });

    if (!response.ok) {
      throw new Error('Falló la creación de la publicación');
    }

    return response.json();
  });
};

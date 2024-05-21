import { useMutation } from 'react-query';

export const useOfferInscribe = () => {
  return useMutation(async ({offerId, isInscribe}) => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      message.error('Error, no se encuentra el token de autenticación');
      throw new Error('Error, no se encuentra el token de autenticación');
    }

    const response = await fetch('https://goalfinder-back-production.up.railway.app/API/OFFERS/offerInscribe.php', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
        body: JSON.stringify({offerId, isInscribe}),
    });

    if (!response.ok) {
      throw new Error('Falló al inscribirse en la oferta');
    }

    return response.json();
  });
};

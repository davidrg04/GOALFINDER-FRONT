import { useQuery } from 'react-query';
import { message } from 'antd';

async function getProfilePicture( idUser ) {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
        message.error('Error, no se encuentra el token de autenticación');
        throw new Error('Error, no se encuentra el token de autenticación');
    }

    const response = await fetch('http://localhost/GOALFINDER/src/API/ACCESS/getUserProfilePicture.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        },
        body: JSON.stringify({ idUser })
    });

    if (!response.ok) {
        message.error('Error. No se pueden obtener los datos');
        throw new Error('Error al obtener los datos del usuario');
    }

    return response.json();
}

export function useUserProfilePicture(idUser) {
    return useQuery(['userProfilePicture', idUser], () => getProfilePicture(idUser), {
        enabled: !!idUser 
    });
}

import { message } from "antd";
import { useQuery } from 'react-query';

export async function getOtherUserExperience(idUser) {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
        message.error('Error, no se encuentra el token de autenticación');
        throw new Error('Error, no se encuentra el token de autenticación');
    }

    const response = await fetch('https://goalfinder-back-production.up.railway.app/API/ACCESS/getOtherUserExperience.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        },
        body: JSON.stringify({ idUser })
    });

    if (!response.ok) {
        message.error('Error. No se pueden obtener los datos');
        throw new Error('HTTP status ' + response.status);
    }

    return response.json();
}

export function useOtherUserExperience(idUser) {
    const { data: experiences = [], isLoading, isError, refetch } = useQuery(
        ['userExperience', idUser],
        () => getOtherUserExperience(idUser),
        {
            initialData: [] 
        }
    );
    return { experiences, isLoading, isError, refetch };
}

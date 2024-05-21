import { message } from "antd";

export async function getUserExperience() {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
        message.error('Error, no se encuentra el token de autenticación');
        throw new Error('Error, no se encuentra el token de autenticación');
    }

    const response = await fetch('https://goalfinder-back-production.up.railway.app/API/ACCESS/getUserExperience.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        }
    });

    if (!response.ok) {
        message.error('Error. No se pueden obtener los datos');
        throw new Error('HTTP status ' + response.status);
    }

    return response.json();
}

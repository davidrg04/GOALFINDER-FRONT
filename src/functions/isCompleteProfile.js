import { useQuery } from 'react-query';

async function fetchUserData(jwt) {
  const response = await fetch('http://localhost/GOALFINDER/src/API/ACCESS/getUsersData.php', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`
    }
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
}
export default function useUserData(jwt) {
  return useQuery('userData', () => fetchUserData(jwt));
}
  

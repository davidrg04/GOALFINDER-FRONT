import { useQuery } from 'react-query';
import { getUserExperience } from './ApiCalls/getUserExperience';

export function useUserExperience() {
    const { data: experiences = [], refetch, isLoading, isError } = useQuery(['userProfileExperience'], getUserExperience, {
        initialData: [] 
    });
    return { experiences, refetch, isLoading, isError };
}

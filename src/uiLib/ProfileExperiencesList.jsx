import ExperienceCard from "../uiLib/ExperienceCard";
import { useUserExperience } from "../functions/useGetUserExperience";
import { useOtherUserExperience } from "../functions/ApiCalls/getOtherUserExperience";
const ProfileExperiencesList = ({otherUser}) => {
    const { experiences, isLoading, isError } = otherUser
    ? useOtherUserExperience(otherUser) 
    : useUserExperience();
    
    if (isLoading) return <div>Cargando experiencias...</div>;
    if (isError) return <div>Error al cargar las experiencias.</div>;
    
    if (experiences.length === 0) {
        return(
            <div className="flex flex-col justify-center items-center mt-3">
                <figure>
                    <img src="http://localhost/GOALFINDER/src/assets/img/page-not-found.png" alt="Sin resultados"  className="w-64"/>
                    <figcaption className="text-emerald-950 text-2xl font-semibold text-center">No hay experiencias</figcaption>
                </figure>
            </div>
        ) 
    }
    return (
        <div className="flex flex-col gap-3 w-full items-center">
            {experiences.map((experience) => (
                <ExperienceCard
                    minw="min-w-96"
                    w="w-3/5"
                    p="p-6"
                    key={experience.idExperience}
                    idExperience={experience.idExperience}
                    club={experience.club}
                    startDate={experience.startDate}
                    endDate={experience.endDate}
                    description={experience.description}
                    position={experience.position}
                    url={`http://localhost/GOALFINDER/src/assets/img/CLUBS/${encodeURIComponent(experience.club)}.png`}
                />
            ))}
        </div>
    );
};

export default ProfileExperiencesList;
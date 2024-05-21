import React from "react";
import { jwtDecode } from "jwt-decode";
import Header from "../uiLib/uiComponents/Header";
import ViewSelector from "../uiLib/ViewSelector";
import UserCardProfile from "../uiLib/UserCardProfile";
import { useState, useEffect } from "react";
import SettingsModal from "../uiLib/uiComponents/SettingsModal";
import ProfileExperiencesList from "../uiLib/ProfileExperiencesList";
import { useUserProfile } from "../functions/ApiCalls/getUserData";
import { usePublications } from '../functions/ApiCalls/getPublications';
import Publication from "../uiLib/Publication";
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import FollowAndFollowingModal from "../uiLib/uiComponents/FollowAndFollowingModal";
function ProfileView() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalFollowersVisible, setIsModalFollowersVisible] = useState(false);
    const [activeButton, setActiveButton] = useState('publications');
    const { data, isLoading, isError, error, refetch } = useUserProfile();
    const { data: publications, isLoadingPublications, isErrorPublications, refetch: refetchPub} = usePublications();
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        function checkTokenAndUpdateUserId() {
            const token = localStorage.getItem('jwt');
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    setUserId(decoded.id);
                } catch (error) {
                    console.error('Error decoding token:', error);
                }
            } else {
                setUserId(null);
            }
        }
    
        checkTokenAndUpdateUserId();
        window.addEventListener('storage', checkTokenAndUpdateUserId);
    
        return () => window.removeEventListener('storage', checkTokenAndUpdateUserId);
    }, []);

    const toggleActiveButton = (buttonName) => {
        setActiveButton(buttonName);
    }

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
        refetch();
        refetchPub();
    };

    const toggleModalFollowers = () => {
        setIsModalFollowersVisible(!isModalFollowersVisible);
    };
    if (isLoading) {
        return (
            <div className='flex justify-center items-center h-screen'>
              <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
            </div>
     )
    }

    if(isLoadingPublications){
        return (
            <div className='flex justify-center items-center h-screen'>
              <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
            </div>
        )
    }
    
    if (userId === null) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
            </div>
        );
    }

    return(
        <>
            <Header profileUse name={data?.name} profilePicture={data?.profilePicture} idUser={data?.id}/>
            <div className="relative">
                <div className="fixed top-32 left-32">
                    <UserCardProfile profilePicture={`http://localhost/GOALFINDER/src/API/ACCESS/users/user${data.id}/${data.profilePicture}`} username={data.username} name={data.name} club={(data.club !== "") ? data.club : "Sin Equipo"} position={(data.position !== null) ? data.position : data.footballRole} surnames={data.surnames} community={data.community} city={data.city} description={data.description} followers={data.followers.length} following={data.following.length} openSettings={toggleModal} openSocial={toggleModalFollowers}/>
                </div>
                <div className="w-3/6 flex flex-col absolute top-20 right-72 min-w-96 publicationExperience">
                    <div className="justify-center flex gap-3">
                        <ViewSelector isActive={activeButton === 'publications'} onClick={() => toggleActiveButton('publications')}>PUBLICACIONES</ViewSelector>
                        <ViewSelector isActive={activeButton === 'experience'} onClick={() => toggleActiveButton('experience')}>EXPERIENCÍA</ViewSelector>
                    </div>
                </div>
                <div className="absolute right-72 top-32 p-3 w-2/4 flex flex-col items-center">
                    {activeButton === 'experience' ? 
                    ( <ProfileExperiencesList /> )
                     : (
                        <>
                            {isLoadingPublications && <div>Cargando publicaciones...</div>}
                            {isError && <div>Error al cargar las publicaciones</div>}
                            {publications?.publications.filter(pub => pub.idUser === userId).length === 0 ? 
                             <div className="flex flex-col justify-center items-center mt-3">
                                <figure>
                                    <img src="http://localhost/GOALFINDER/src/assets/img/page-not-found.png" alt="Sin resultados"  className="w-64"/>
                                    <figcaption className="text-emerald-950 text-2xl font-semibold text-center">No hay publicaciones</figcaption>
                                </figure>
                            </div> 
                            : 
                            publications?.publications.filter(pub => pub.idUser === userId).map((publication) => (
                                <Publication
                                    isSave={data?.saves.includes(publication.idPublication)}
                                    isLike={publication.likes.includes(userId)}
                                    updateData={()=> refetchPub()}
                                    profileUse 
                                    key={publication.idPublication}
                                    idPublication={publication.idPublication}
                                    completeName={publication.completeName}
                                    username={publication.username}
                                    date={publication.date}
                                    content={publication.description}
                                    file={publication.file}
                                    likes={publication.likes}
                                    comments={publication.comments}
                                    idUser={publication.idUser}
                                    mediaType={publication.mediaType}
                                />
                            ))}
                        </>                
                     )
                    }
                </div>
            </div>
            {isModalVisible && <SettingsModal isOpen={isModalVisible} isClose={toggleModal}/>}
            {isModalFollowersVisible && <FollowAndFollowingModal isVisible={isModalFollowersVisible} onClose={toggleModalFollowers}/>}
        </>
    )
}
export default ProfileView;
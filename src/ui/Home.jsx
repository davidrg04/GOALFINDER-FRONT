import React from 'react';
import { jwtDecode } from "jwt-decode";
import { useState,useEffect } from 'react'
import {NextUIProvider} from "@nextui-org/react";
import { Spin, Empty } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import Header from '../uiLib/uiComponents/Header';
import NewPublication from '../uiLib/NewPublication';
import UserCard from '../uiLib/UserCard';
import ViewSelector from '../uiLib/ViewSelector';
import Publication from '../uiLib/Publication';
import MaybeYouKnow from '../uiLib/uiComponents/MaybeYouKnow';
import NewPublicationModal from '../uiLib/uiComponents/NewPublicationModal';
import { usePublications } from '../functions/ApiCalls/getPublications';
import { useUserFollowing } from '../functions/ApiCalls/getFollowing';
import { useUserProfile } from '../functions/ApiCalls/getUserData';
import NewOfferModal from '../uiLib/uiComponents/NewOfferModal';
import { message } from 'antd';

function Home(){    
    const [activeButton, setActiveButton] = useState('seeAll');
    const [userId, setUserId] = useState(null);
    const [userRol,setUserRol] = useState(null)
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalOfferVisible, setIsModalOfferVisible] = useState(false);
    const { data, isLoading, isError, refetch} = usePublications();
    const { data: followingData } = useUserFollowing();
    const { data: usersData, isLoading: isLoadingUser, refetch: refetchUser } = useUserProfile();
    const [publications, setPublications] = useState([]);
    const [originalPublications, setOriginalPublications] = useState([]);

    const toggleActiveButton = (buttonName) => {
      setActiveButton(buttonName);
    };

    useEffect(() => {
        if (data && data.publications) {
            setPublications(data.publications);
            setOriginalPublications(data.publications);
        }
    }, [data]);

    
    const handleSearch = (searchTerm) => {
        if (!searchTerm) {
            setPublications(originalPublications);  
        } else {
            const filtered = originalPublications.filter(pub =>
                pub.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                pub.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setPublications(filtered);  
        }
    };


    useEffect(() => {
        function checkTokenAndUpdateUserId() {
            const token = localStorage.getItem('jwt');
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    setUserId(decoded.id);
                    setUserRol(decoded.rol);

                    if (!localStorage.getItem('messageShown') && decoded.completeProfile === false) {
                        message.warning('Por favor completa tu perfil en ajustes, los usuarios quieren conocerte mejor :) !');
                        localStorage.setItem('messageShown', 'true');
                    }
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
    
    

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };
    const toggleModalOffer = () => {
        setIsModalOfferVisible(!isModalOfferVisible);
    };

    if (isLoading || isLoadingUser) {
        return (
            <div className='flex justify-center items-center h-screen'>
              <Spin indicator={<LoadingOutlined style={{ fontSize: 44 }} spin />} />
            </div>
        );
    }

    if (userId === null || userRol === null) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
            </div>
        );
    }
    return(
        <NextUIProvider>
            <Header onSearch={handleSearch} name={usersData?.name} profilePicture={usersData?.profilePicture} idUser={usersData?.id}/>            
            <div className='fixed right-40 top-32 flex flex-col gap-4 items-center'>
                <UserCard username={usersData?.username} followers={usersData?.followers.length} profilePicture={usersData?.profilePicture} idUser={usersData?.id}/>
                <NewPublication onClick={toggleModal}>Nueva Publicación</NewPublication>
                {userRol === "club" && 
                    <NewPublication onClick={toggleModalOffer}>Nueva Oferta</NewPublication>
                }
                <div className='mt-2'>
                    <MaybeYouKnow/>
                </div>
            </div>
            <div className='w-3/6 ml-56 flex flex-col min-w-96'>
                <div className='justify-center flex gap-3 mt-20'>
                    <ViewSelector isActive={activeButton === 'following'} onClick={() => toggleActiveButton('following')}>SIGUIENDO</ViewSelector>
                    <ViewSelector isActive={activeButton === 'seeAll'} onClick={() => toggleActiveButton('seeAll')}>MOSTRAR TODO</ViewSelector>
                </div>
                {isLoading && <div>Cargando publicaciones...</div>}
                {isError && <div>Error al cargar las publicaciones</div>}
                {activeButton == 'seeAll' ? 
                publications.filter(pub => pub.idUser !== userId).length === 0 ? 
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> :
                publications.filter(pub => pub.idUser !== userId).map((publication) => (
                    <Publication
                        isSave={usersData?.saves.includes(publication.idPublication)}
                        isLike={publication.likes.includes(userId)}
                        updateData={()=> refetch()}
                        updateDataUser={()=> refetchUser()} 
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
                    
                )) : 
                    publications.filter(pub => pub.idUser !== userId).filter(pub => followingData?.includes(pub.idUser)).length === 0 ?
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> :
                    publications.filter(pub => pub.idUser !== userId).filter(pub => followingData?.includes(pub.idUser)).map((publication) => (
                    <Publication
                        isSave={usersData?.saves.includes(publication.idPublication)}
                        isLike={publication.likes.includes(userId)}
                        updateData={()=> refetch()} 
                        updateDataUser={()=> refetchUser()}
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
                ))
                }
            </div>
            {isModalOfferVisible && <NewOfferModal isOpen={isModalOfferVisible} isClose={toggleModalOffer}/>}
            {isModalVisible && <NewPublicationModal isOpen={isModalVisible} isClose={toggleModal}/>}
        </NextUIProvider>
    );
}
export default Home;
import {React, useState, useEffect} from "react";
import { Image, message, Popover } from "antd";
import {Avatar} from "@nextui-org/react";
import { Bookmark, BookmarkSolid, ChatBubble, Heart, HeartSolid, Iconoir, IconoirProvider, PlusCircleSolid } from 'iconoir-react';
import CommentsModal from "./uiComponents/CommentsModal";
import ReactPlayer from "react-player/file";
import { useUserProfilePicture } from "../functions/ApiCalls/getProfilePicture";
import { MoreOutlined } from '@ant-design/icons';
import { useDeletePublications } from "../functions/ApiCalls/deletePublications";
import PublicationStatisticsModal from "./uiComponents/PublicationStatisticsModal";
import { usePublicationLikes } from "../functions/ApiCalls/publicationsLike";
import { usePublicationSaves } from "../functions/ApiCalls/publicationSave";
import { Link } from "react-router-dom";

const Publication = ({isSave,isLike,updateDataUser,updateData,profileUse,completeName,username,date,content,file,likes,comments,idUser,mediaType, idPublication}) =>{
    const [isFavorite, setFavorite] = useState(isLike);
    const [isSaved, setSaved] = useState(isSave);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const {data} = useUserProfilePicture(idUser);
    const {mutate: deletePublication, error} = useDeletePublications();
    const {mutate: likePublication} = usePublicationLikes();
    const {mutate: savePublication} = usePublicationSaves();
    const [isVisibleModalStatistics, setIsVisibleModalStatistics] = useState(false);
    const toggleModalStatistics = () => {
        setIsVisibleModalStatistics(!isVisibleModalStatistics);
    };

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    const toggleFavorite = () => {
        const isLike = !isFavorite;
        likePublication({idPublication, isLike}, {
            onSuccess: () => {
                setFavorite(isLike);
                updateData();  
            },
        });
    };
    
    const toggleSave = () =>{
        const saved = !isSaved;
        savePublication({idPublication, isSave: saved}, {
            onSuccess: () => {
                setSaved(saved);
                updateDataUser();
            }
        });
    }

    const handleDeletePublication = () => {
        deletePublication({idPublication}, {
            onSuccess: () => {
                message.success('Publicación eliminada');
                updateData();
            },
            onError: () => {
                message.error('Error al eliminar la publicación');
                console.log(error);
            }
        });
    }

    return(
        <>
        <div className="w-2/3 mt-7 self-center min-w-96 border-2 border-emerald-600 rounded-xl bg-emerald-50 px-6 py-3 flex flex-col gap-3 shadow-xl shadow-emerald-950/15">
            <div className="flex gap-2">
                <Avatar src={`https://goalfinder-back-production.up.railway.app/API/ACCESS/users/user${idUser}/${data}`} size="lg" />
                <div className="flex flex-col justify-center">
                   <Link to={`/profile/${idUser}`}>
                        <span className="text-emerald-950 font-bold transition-colors hover:cursor-pointer hover:text-emerald-900">{completeName}</span>
                   </Link>
                    <span className="text-emerald-950 -mt-2 font-light">@{username}</span>
                </div>
                {profileUse && (
                    <>
                        <div className="flex-grow"></div>
                        <Popover content={<div><div onClick={() => handleDeletePublication()} className="hover:cursor-pointer hover:text-emerald-700 transition-colors">Eliminar</div><div onClick={() => toggleModalStatistics()} className="hover:cursor-pointer hover:text-emerald-700 transition-colors">Estadisticas</div></div>} trigger="click" placement="right">
                            <button className="hover:cursor-pointer">
                                <MoreOutlined/>
                            </button>
                        </Popover>
                    </>    
                )}
            </div>
            <div className="flex flex-col items-center">
                {content && <p className="text-lg ml-4 self-start text-emerald-950">{content}</p>}
                {file &&
                    (mediaType == "photo") ? (
                        <Image width={230} src={`https://goalfinder-back-production.up.railway.app/API/ACCESS/users/user${idUser}/publications/${idPublication}/${file}`} alt = "publication"/>
                    ) : (
                        <ReactPlayer url={`https://goalfinder-back-production.up.railway.app/API/ACCESS/users/user${idUser}/publications/${idPublication}/${file}`} controls width="100%" height="100%"/>
                    )
                }
            </div>
            <div className="w-fit self-end -mt-1 flex gap-2">
                <IconoirProvider
                    iconProps={{
                        color: '#059669',
                        fontSize: '13px'
                    }}  
                >
                    <ChatBubble onClick={toggleModal} className="hover:cursor-pointer"/>
                </IconoirProvider>

                {
                    isFavorite ? 
                    (
                        <IconoirProvider
                        iconProps={{
                            color : "#dc2626",
                            fontSize : "13px"
                        }}
                        >
                           <HeartSolid onClick={toggleFavorite} className="hover:cursor-pointer"/> 
                        </IconoirProvider>
                    ) : (
                        <IconoirProvider
                        iconProps={{
                            color : "#dc2626",
                            fontSize : "13px"
                        }}
                        >
                           <Heart onClick={toggleFavorite} className="hover:cursor-pointer"/> 
                        </IconoirProvider>
                    )
                }
                <span className="text-emerald-950 text-lg relative bottom-1">{likes.length}</span>
                {
                    isSaved ? 
                    (
                        <IconoirProvider
                        iconProps={{
                            color : "#10b981",
                            fontSize : "13px"
                        }}
                        >
                        <BookmarkSolid onClick={toggleSave} className="ml-1 hover:cursor-pointer"/>
                        </IconoirProvider>
                    ) : (
                        <IconoirProvider
                        iconProps={{
                            color : "#10b981",
                            fontSize : "13px"
                        }}
                        >
                        <Bookmark onClick={toggleSave} className="ml-1 hover:cursor-pointer"/>
                        </IconoirProvider>
                    )
                }
                
            </div>
        </div>
        {isModalVisible && <CommentsModal updateData={() => updateData()} isVisible={isModalVisible} onClose={toggleModal} comments={comments} idPublication={idPublication}/>}
        {isVisibleModalStatistics && <PublicationStatisticsModal isVisible={isVisibleModalStatistics} onClose={toggleModalStatistics} likes={likes} comments={comments}/>}
        </>
    );
};

export default Publication
import React, {useState, useEffect} from "react";
import Modal from "../Modal";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useGetUserSaves } from "../../functions/ApiCalls/getUserSaves";
import { useUserProfile } from "../../functions/ApiCalls/getUserData";
import { jwtDecode } from "jwt-decode";

import Publication from "../Publication";
const SaveModal = ({isOpen, isClose}) => {
    const { data: dataUser, isLoading: isLoadingUser} = useUserProfile();
    const { data, isLoading } = useGetUserSaves();
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
    

    if (isLoading || isLoadingUser) {
        return (
            <Modal isOpen={isOpen} isClose={isClose} w="w-2/5" h="h-4/5">
                <div className="flex flex-col gap-4">
                    <h2 className="text-2xl text-emerald-900 font-bold pb-2 border-b-2 border-emerald-900/15">Publicaciones guardadas</h2>
                    <div className='flex justify-center items-center h-screen'>
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                    </div>
                </div>
            </Modal>
            
        )
    }
    if (userId === null) {
        return (
            <Modal isOpen={isOpen} isClose={isClose} w="w-2/5" h="h-4/5">
                <div className="flex flex-col gap-4">
                    <h2 className="text-2xl text-emerald-900 font-bold pb-2 border-b-2 border-emerald-900/15">Publicaciones guardadas</h2>
                    <div className='flex justify-center items-center h-screen'>
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                    </div>
                </div>
            </Modal>
        );
    }

    return(
        <Modal isOpen={isOpen} isClose={isClose} w="w-2/5" h="h-4/5">
            <div className="flex flex-col gap-4">
                <h2 className="text-2xl text-emerald-900 font-bold pb-2 border-b-2 border-emerald-900/15">Publicaciones guardadas</h2>
                {console.log(userId)}
                {data.map((publication, index) => (
                    <Publication
                    isSave={dataUser?.saves.includes(publication.idPublication)}
                    isLike={publication.likes.includes(userId)}
                    key={index}
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
            </div>
        </Modal>
    );
}

export default SaveModal;
import React from "react";
import Modal from "../Modal";
import UserSmallCard from "../UserSmallCard";
import { Empty } from "antd";
const PublicationStatisticsModal = ({isVisible, onClose, likes, comments}) => {
    return(
        <Modal isOpen={isVisible} isClose={onClose} w="w-2/5" h="h-3/4">
            <div className="flex flex-col gap-4">
                <h2 className="text-2xl text-emerald-900 font-bold pb-2 border-b-2 border-emerald-900/15">Estadísticas de la publicación</h2>
                <div className="flex">
                    <div className="w-2/4 border-r-2 border-emerald-950/40">
                        <h2 className="text-xl text-center text-emerald-900 pb-2 border-b-2 border-emerald-900/15">Me gusta <span className="ml-2 font-medium">{likes.length}</span></h2>
                        <div className="flex flex-col gap-3 pt-2">

                         {
                            likes.length === 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> :
                            likes.map((like, index) => (
                                <UserSmallCard key={index} idUser={like}/>
                            ))
                            
                         }

                           
                        </div>
                    </div>
                    <div className="w-2/4">
                        <h2 className="text-xl text-center text-emerald-900 pb-2 border-b-2 border-emerald-900/15">Comentarios <span className="ml-2 font-medium">{comments.length}</span></h2>
                        <div className="flex flex-col gap-3 pl-3 pt-2">
                            {
                                comments.length === 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> :
                                comments.map((comment, index) => (
                                    <div className="flex flex-col gap-1 pb-2 border-b-2 border-slate-200">
                                        <UserSmallCard key={index} idUser={comment.idUser}/>
                                        <p>{comment.comment}</p>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default PublicationStatisticsModal;
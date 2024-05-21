import React from "react";
import Comments from "../Comments";
import NewComment from "../NewComment";
import { Empty } from "antd";
const CommentsModal = ({isVisible, onClose, comments, idPublication, updateData}) => {

    const handleCloseModal = (event) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };
    
    return(
        <div onClick={handleCloseModal} className={`fixed top-0 left-0 z-50 flex w-full h-screen bg-emerald-950/40 justify-center items-center transition-opacity duration-300 ease-out ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} z-20`}>
            <div className={`transition-all duration-300 ease-out transform ${isVisible ? 'scale-100' : 'scale-95'} w-2/6 min-w-96 bg-slate-200 h-3/4 min-h-96 flex flex-col rounded-2xl shadow-2xl shadow-emerald-950/50`}>
                <div className="rounded-t-2xl p-1 flex items-center justify-center bg-emerald-600">
                    <h2 className="text-emerald-50 font-semibold text-xl">Añade un comentario</h2>
                    <div onClick={onClose} className="cursor-pointer absolute right-4 top-1 text-lg font-medium text-emerald-50">X</div>
                </div>
                <div className="overflow-scroll px-4 h-full flex flex-col gap-2 py-4">
                    {comments.length === 0 ? (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    ) : (
                        comments.map((comment, index) => (
                            <Comments updateData={()=> updateData()} key={index} idPublication={idPublication} idComment={comment.id} comment={comment.comment} idUser={comment.idUser}/>
                        ))
                    )}
                </div>
                <NewComment idPublication={idPublication} updateData={()=> updateData()}/>
            </div>
        </div>
    );

}

export default CommentsModal;

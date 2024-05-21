import React, {useState, useEffect} from "react";
import { jwtDecode } from "jwt-decode";
import { message, Popover } from "antd";
import {Avatar} from "@nextui-org/react";
import { useUsersData } from "../functions/ApiCalls/getUsersData";
import { MoreOutlined } from '@ant-design/icons';
import { useDeleteComment } from "../functions/ApiCalls/deleteComment";
const Comments = ({comment, idUser, idPublication, idComment, updateData}) => {
    const { data } = useUsersData(idUser);
    const [isTheUser, setIsTheUser] = useState(false);
    const { mutate: deleteComment, error } = useDeleteComment();

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        if (token) {
            const decoded = jwtDecode(token);
            if (decoded.id === idUser) {
                setIsTheUser(true);
            }
        }
    }, []);
    
    const handleDeleteComment = () => {
        deleteComment({idPublication, idComment}, {
            onSuccess: () => {
                message.success('Comentario eliminado');
                updateData();
            },
            onError: () => {
                message.error('Error al eliminar el comentario');
            }
        });
    }

    return(
        <div className="bg-slate-100 flex flex-col gap-1 w-full p-2 rounded-lg shadow-2xl shadow-emerald-950/20">
            <div className="flex gap-2">
                <Avatar src={`http://localhost/GOALFINDER/src/API/ACCESS/users/user${idUser}/${data?.profilePicture}`} className="border-2 border-emerald-600" />
                <div className="flex flex-col justify-center gap-1">
                    <span className="text-emerald-950 font-semibold text-sm">{data?.name} {data?.surnames}</span>
                    <span className="-mt-2 text-emerald-950 font-light text-sm">@{data?.username}</span>
                </div>
                {isTheUser && (
                    <>
                        <div className="flex-grow"></div>
                        <Popover  content={<div onClick={() => handleDeleteComment()} className="hover:cursor-pointer hover:text-emerald-700 transition-colors">Eliminar</div>} trigger="click" placement="right">
                            <button className="hover:cursor-pointer">
                                <MoreOutlined/>
                            </button>
                        </Popover>
                    </>    
                )}
            </div>
            <div className="w-fit">
                <p className="text-emerald-950">{comment}</p>
            </div>
        </div>
    )
}
export default Comments;
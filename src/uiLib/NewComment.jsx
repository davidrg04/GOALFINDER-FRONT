import {React, useState} from "react";
import {Avatar} from "@nextui-org/react";
import { message, Spin} from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import useUserId from "../functions/getUserId";
import { Iconoir, SendSolid, IconoirProvider} from "iconoir-react";
import { useNewPublicationComment } from "../functions/ApiCalls/newPublicationComment";
import { useUserProfilePicture } from "../functions/ApiCalls/getProfilePicture";
const NewComment = ({idPublication, updateData}) => {
    const { mutate: sendComment, error } = useNewPublicationComment();
    const [comment, setComment] = useState("");
    const userId = useUserId();
    const { data: userProfilePicture, isLoading } = useUserProfilePicture(userId);
    const handleComment = (value) => {
        setComment(value);
    }

    const handleSendComment = () => {
        if(comment === "") {
            message.warning('El comentario no puede estar vacío');
        }else{
            sendComment({comment, idPublication, userId}, {
                onSuccess: () => {
                    setComment("");
                    message.success('Comentario enviado');
                    updateData();   
                },
                onError: () => {
                    message.error('Error al enviar el comentario');
                }
            });
        }
    }

    if (isLoading) {
        return (
            <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        );
    }
    return(
        <div className="flex border-t-2 border-emerald-600 rounded-b-2xl bg-gray-100 py-2 px-4 justify-center items-center gap-2">
            <Avatar src={`https://goalfinder-back-production.up.railway.app/API/ACCESS/users/user${userId}/${userProfilePicture}`} className="border-2 border-emerald-600" />
            <input type="text" value={comment}  onChange={(event) => handleComment(event.target.value)} placeholder="Escribe tu comentario..." className="border-2 bg-gray-200 rounded-2xl px-2 py-1 w-96"/>
            <IconoirProvider
                iconProps={{
                    color: '#059669',
                    fontSize: '20px'
                }}
            >
                <SendSolid onClick={handleSendComment}/>
            </IconoirProvider>
        </div>
    )
}
export default NewComment;
import React from "react";
import { useUsersData } from "../functions/ApiCalls/getUsersData";
import {Avatar} from "@nextui-org/react";
import { Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
const UserSmallCard = ({idUser}) => {
    const { data, isLoading} = useUsersData(idUser);
    if(isLoading){
        return (
            <div className='flex justify-center items-center h-screen'>
              <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
            </div>
        )
    }
    return(
        <div className="flex gap-2">
                <Avatar src={`http://localhost/GOALFINDER/src/API/ACCESS/users/user${idUser}/${data?.profilePicture}`} size="lg" />
                <div className="flex flex-col justify-center">
                    <Link to={`/profile/${idUser}`}>
                        <span className="text-emerald-950 font-bold transition-colors hover:cursor-pointer hover:text-emerald-900">{data?.name} {data?.surnames}</span>
                    </Link>
                    <span className="text-emerald-950 -mt-2 font-light">@{data?.username}</span>
                </div>
        </div>
    );
}

export default UserSmallCard;
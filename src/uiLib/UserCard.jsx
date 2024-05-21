import React from "react";
import {Avatar} from "@nextui-org/react";

function UserCard({username, followers, profilePicture, idUser}) {
    return(
        <div className="w-52 flex flex-col justify-center items-center border-2 border-emerald-600 rounded-xl py-2 px-3 bg-emerald-50">
            <Avatar src={`http://localhost/GOALFINDER/src/API/ACCESS/users/user${idUser}/${profilePicture}`} className="w-20 h-20 text-large border-2 border-emerald-600" />
            <span className="text-emerald-950">@{username}</span>
            <div className="flex justify-around w-full">
                <span className="text-lg font-semibold text-emerald-950">Seguidores</span>
                <span className="text-lg font-semibold text-emerald-600">{followers}</span>
            </div>
        </div>
    )
    
}

export default UserCard;
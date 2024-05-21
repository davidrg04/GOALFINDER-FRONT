import React,{useEffect, useState} from "react"
import {Avatar} from "@nextui-org/react";
import {Iconoir, IconoirProvider, Settings} from "iconoir-react";
import { useUsersFollow } from "../functions/ApiCalls/usersFollow";
import { jwtDecode } from "jwt-decode";
const UserCardProfile = ({idUser,updateData,notUserLoggedProfile,isFollow,openSocial,openSettings, profilePicture , username = "No Data", name = "No Data", surnames = "No Data", city = "No Data", community = "No Data", followers = "No Data", following = "No Data", position = "No Data", club = "No Data", description = "No Data" }) =>{
    const [userRol, setUserRol] = useState(null);
    const [isFollowing, setIsFollowing] = useState(notUserLoggedProfile ? isFollow : false);
    const {mutate: followUser} = useUsersFollow();
    const toggleFollow = () => {
        const setFollow = !isFollowing;
        followUser({user: idUser, isFollow: setFollow}, {
            onSuccess: () => {
                setIsFollowing(setFollow);
                updateData();
            }
        });
    }

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUserRol(decoded.rol);
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, []);

    return(
        <>
        <div className="bg-emerald-50 w-80 border-4 border-emerald-600 rounded-2xl py-4 px-5 flex flex-col gap-2 items-center justify-center shadow-xl shadow-emerald-950/25">   
            {!notUserLoggedProfile ? (
                <div className="absolute top-3 right-3 hover:cursor-pointer">
                    <IconoirProvider
                        iconProps={{
                            color: '#022c22'
                        }}
                    >
                        <Settings onClick={openSettings}/>
                    </IconoirProvider>
                </div>
            ) : (
                <div className="absolute top-3 right-3 hover:cursor-pointer">
                    <div onClick={() => toggleFollow()} className={`rounded-xl text-sm font-bold px-2 transition-colors ${isFollowing ? 'bg-emerald-700 text-emerald-50' : 'text-emerald-700 bg-emerald-50 border-2 border-emerald-700'}`}>{isFollowing ? "Siguiendo" : "Seguir"}</div>
                </div>
            )}
            <Avatar src={profilePicture} className="w-28 h-28 text-large" />
            <div className="flex flex-col  items-center justify-center">
                <span className="text-emerald-950 text-xl font-semibold">{name} {surnames}</span>
                <span className="text-emerald-900 text-lg font-normal">@{username}</span>
                <span className="text-emerald-950 font-light">{city}, {community}</span>
            </div>
            <div>
                {!notUserLoggedProfile ? (
                    <div className="flex gap-2">
                        <span onClick={openSocial} className="text-emerald-950 font-medium cursor-pointer">Seguidores:<span className="text-emerald-600 font-bold"> {followers}</span></span>
                        <span onClick={openSocial} className="text-emerald-950 font-medium cursor-pointer">Siguiendo:<span className="text-emerald-600 font-bold"> {following}</span></span>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <span className="text-emerald-950 font-medium">Seguidores:<span className="text-emerald-600 font-bold"> {followers}</span></span>
                        <span className="text-emerald-950 font-medium">Siguiendo:<span className="text-emerald-600 font-bold"> {following}</span></span>
                    </div>
                )}
               
                <div className="flex gap-2">
                    {userRol == "player" && <span className="text-emerald-950 font-medium">Posición:<span className="text-emerald-600 font-bold"> {position !== "" ? position : "N/A"}</span></span>}
                    <span className="text-emerald-950 font-medium">Club:<span className="text-emerald-600 font-bold"> {club}</span></span>
                </div>
            </div>
            <div className="mt-3 flex flex-wrap justify-center items-center">
                <p className="text-center">{description}</p>
            </div>
        </div>
        </>
    );
}
export default UserCardProfile
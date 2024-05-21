import {React, useState} from "react";
import {Avatar} from "@nextui-org/react";
import { Iconoir, UserPlus, IconoirProvider, UserLove} from "iconoir-react";

const FollowCard = ({name,username}) =>{
    const [isFollowing, setIsFollowing] = useState(false);

    const toggleFollow = () =>{
        setIsFollowing(!isFollowing);
    }

    return(
        <div className="flex items-center gap-3">
            <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026302d" size="lg" className="ml-3"/>
            <div className="flex flex-col w-fit">
                <span className="text-emerald-950  font-semibold">{name}</span>
                <span className="text-emerald-950 font-normal -mt-2">{username}</span>
            </div>
            <div className="ml-auto w-fit mr-3">
                <button onClick={toggleFollow} className={`group relative inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-emerald-900 font-medium text-emerald-50 transition-all duration-300 ${isFollowing ? 'hover:w-32' : 'hover:w-28'}`}>
                    <div className="inline-flex whitespace-nowrap opacity-0 transition-all duration-200 group-hover:-translate-x-3 group-hover:opacity-100">{isFollowing ? 'Siguiendo' : 'Seguir'}</div>
                    <div className={`absolute ${isFollowing ? 'right-3.5' : 'right-3'}`}>
                        {
                           isFollowing ? 
                           (
                                <IconoirProvider
                                iconProps={{
                                    fontSize : "15px"
                                }}
                                >
                                    <UserLove/>
                                </IconoirProvider>
                           ) : (
                            <IconoirProvider
                            iconProps={{
                                fontSize : "15px"
                            }}
                            >
                                <UserPlus/>
                            </IconoirProvider>
                           ) 
                        }
                        
                    </div>
                </button>
            </div>
        </div>
    );
}
export default FollowCard;
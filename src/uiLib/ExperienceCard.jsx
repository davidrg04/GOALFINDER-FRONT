import React, {useEffect, useState} from "react";
import { Iconoir,IconoirProvider, EditPencil, Trash} from "iconoir-react";
import { jwtDecode } from "jwt-decode";
const ExperienceCard = ({idExperience,club,startDate, endDate,description,position, onEdit, onDelete, w = "w-full", editProfile,url, p="p-1", minw = "min-w-0"}) => {
    const [userRol, setUserRol] = useState(null);

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
  
    return (
    <div className={`${minw} ${w} flex justify-between border-emerald-800 overflow-hidden`}>
        <div className={`${p} w-full relative flex flex-col border-2 ${editProfile && `border-e-0`} border-emerald-800 ${(editProfile ? `rounded-s-xl` : `rounded-xl`)} bg-slate-100`}>
            <div className="flex gap-3">
                <h2 className="text-lg text-emerald-600 font-semibold">{club}</h2>
                <span className="text-lg text-emerald-950 font-semibold">{startDate} / {endDate}</span>
            </div>
            {userRol == "player" && <span className="text-base text-emerald-950 font-medium">Posición : <span className="text-emerald-600 font-semibold">{position}</span></span>}
            <div className="text-sm text-emerald-950">{description}</div>
            {
                !editProfile && (
                    <div className="absolute top-2 items-center" style={{ right: '-30px' }}>
                        <div className="w-40 h-20 bg-no-repeat bg-center bg-contain" style={{ backgroundImage: `url(${url})` }}>
                        </div>
                    </div>
                )
            }
        </div>
        {editProfile && (
          <div className="flex flex-col w-14 rounded-e-xl bg-emerald-800">
            <div onClick={onEdit} className="flex justify-center items-center bg-emerald-800 border-emerald-800 h-2/4 rounded-tr-xl hover:cursor-pointer">
                <IconoirProvider
                    iconProps={{
                        color: '#ecfdf5'
                    }}
                >
                    <EditPencil/>
                </IconoirProvider>
            </div>
            <div onClick={onDelete} className="flex justify-center items-center bg-red-600 h-2/4 rounded-br-xl hover:cursor-pointer">
                <IconoirProvider
                    iconProps={{
                        color: '#ecfdf5'
                    }}
                >
                    <Trash/>
                </IconoirProvider>
            </div>
          </div>
        )}
    </div>
  );
};

export default ExperienceCard;
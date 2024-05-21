import React from "react";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@nextui-org/react";
import {Avatar} from "@nextui-org/react";
import { useNavigate } from 'react-router-dom';



export default function Profile({profilePicture, name, idUser}) {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('jwt');
    navigate('/login');
  }

  return (
    <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar src={`https://goalfinder-back-production.up.railway.app/API/ACCESS/users/user${idUser}/${profilePicture}`} className="border-2 border-emerald-600" />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat" className="bg-emerald-600 px-2 rounded-2xl dropDownProfileMenu shadow-emerald-700 shadow-lg">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="text-xl font-semibold text-emerald-50">¡Hola {name}!</p>
            </DropdownItem>
            <DropdownItem key="settings" className="text-emerald-50 hover:bg-emerald-500 rounded-xl" onClick={() => navigate('/profile')}>Mi Perfíl</DropdownItem>
            <DropdownItem key="team_settings" className="text-emerald-50 hover:bg-emerald-500 rounded-xl" onClick={() => navigate('/profile')}>Mis Publicaciones</DropdownItem>
            <DropdownItem key="logout" color="danger" className="text-emerald-900 hover:bg-emerald-500 rounded-xl" onClick={handleLogout}>
              Cerrar Sesión
            </DropdownItem>
          </DropdownMenu>
    </Dropdown>
  );
}

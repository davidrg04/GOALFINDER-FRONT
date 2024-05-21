import React from "react";
import Search from "../Search";
import Profile from "../Profile";
import { useState } from "react";
import NotificationsModal from "../NotificationsModal";
import { Link } from "react-router-dom";
import HeaderOffersModal from "./HeaderOffersModal";
function Header({profileUse, onSearch, profilePicture, name, idUser}){
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isOfferVisible, setIsOfferVisible] = useState(false);
  
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const toggleOffer = () => {
    setIsOfferVisible(!isOfferVisible);
  }

    return (
    <>
     <header className="fixed z-50 w-full p-3 flex justify-between items-center border-b-2 border-emerald-600 bg-emerald-50">
      <Link to={'/'}>
        <h1 className="text-4xl font-black italic text-emerald-600 ml-20 hover:cursor-pointer">GOALFINDER</h1>
      </Link>
      <div className="flex gap-6 items-center">
        <span className="text-emerald-600 font-medium hover:cursor-pointer" onClick={toggleOffer}>Ofertas</span>
        <i className="bi bi-chat-dots text-2xl text-emerald-600 hover:cursor-pointer"></i>
        <i onClick={toggleModal} className={`bi bi-bell-fill text-2xl hover:cursor-pointer ${isModalVisible ? 'text-emerald-500' : 'text-emerald-600'} transition-colors duration-300`}></i>
          {!profileUse && <Search onSearch={onSearch}/>}
        <div className="relative mr-10">
          <Profile idUser={idUser} profilePicture={profilePicture} name={name}/>
        </div>
      </div>
      
     </header>
     {isModalVisible && <NotificationsModal/>}
     {isOfferVisible && <HeaderOffersModal isOpen={isOfferVisible} isClose={toggleOffer}/>}
    </>
  );
}

export default Header;
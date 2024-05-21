import {React, useState} from "react";
import Modal from "../Modal";
import EditProfileModal from "./EditProfileModal.";
import { Iconoir,IconoirProvider, EditPencil, Bookmark, SoccerBall } from "iconoir-react";
import SaveModal from "./SaveModal";
import OffersModal from "./OffersModal";

const SettingsModal = ( { isOpen, isClose } ) => {
    const [isModalVisibleSave, setIsModalVisibleSave] = useState(false);
    const [isEditProfileModalVisible, setIsEditProfileModalVisible] = useState(false);
    const [isOffersModalVisible, setIsOffersModalVisible] = useState(false);
    
    const toggleEditProfileModal = () => {
        setIsEditProfileModalVisible(!isEditProfileModalVisible);
    }

    const toggleSaveModal = () => {
        setIsModalVisibleSave(!isModalVisibleSave);
    }

    const toggleOffersModal = () => {
        setIsOffersModalVisible(!isOffersModalVisible);
    }

    return (
        <>
        <Modal isOpen={isOpen} isClose={isClose} px="px-8" w="w-72">
            <h1 className="text-center font-bold text-xl text-emerald-900 mb-4 border-b-2 py-1 border-emerald-900">Ajustes de Usuario</h1>
            <div className="flex flex-col gap-3 justify-center items-center">
                    <span onClick={toggleEditProfileModal} className="flex shadow-md shadow-emerald-950/25 justify-between gap-2 text-emerald-950 font-medium w-44 py-2 px-6 hover:cursor-pointer bg-slate-300/30 hover:bg-slate-300/70 rounded-xl transition-colors duration-200 ease-in-out">
                        Editar perfil
                        <div className="">
                            <IconoirProvider
                                iconProps={{
                                    color: '#022c22'
                                }}
                            >
                                <EditPencil/>
                            </IconoirProvider>
                        </div>
                    </span>
                <span onClick={toggleSaveModal} className="flex shadow-md shadow-emerald-950/25 justify-between gap-2 text-emerald-950 font-medium w-44 py-2 px-6 hover:cursor-pointer bg-slate-300/30 hover:bg-slate-300/70 rounded-xl transition-colors duration-200 ease-in-out">
                    Guardados
                    <div className="">
                        <IconoirProvider
                            iconProps={{
                                color: '#022c22'
                            }}
                        >
                            <Bookmark/>
                        </IconoirProvider>
                    </div>   
                </span>
                <span onClick={toggleOffersModal} className="flex shadow-md shadow-emerald-950/25 justify-between gap-2 text-emerald-950 font-medium w-44 py-2 px-6 hover:cursor-pointer bg-slate-300/30 hover:bg-slate-300/70 rounded-xl transition-colors duration-200 ease-in-out">
                    Mis ofertas
                    <div className="">
                        <IconoirProvider
                            iconProps={{
                                color: '#022c22'
                            }}
                        >
                            <SoccerBall/>
                        </IconoirProvider>
                    </div>
                </span>
            </div>
        </Modal>
        {isEditProfileModalVisible && <EditProfileModal isOpen={isEditProfileModalVisible} isClose={toggleEditProfileModal}/>}
        {isModalVisibleSave && <SaveModal isOpen={isModalVisibleSave} isClose={toggleSaveModal}/>}
        {isOffersModalVisible && <OffersModal isOpen={isOffersModalVisible} isClose={toggleOffersModal}/>}
        </>
    );
}

export default SettingsModal;   
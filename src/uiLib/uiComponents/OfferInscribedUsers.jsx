import React from "react";
import Modal from "../Modal";
import UserSmallCard from "../UserSmallCard";
import { Empty } from "antd";
const OfferInscribedUserModal = ({isVisible, onClose, inscribes}) => {
    return(
        <Modal isOpen={isVisible} isClose={onClose} w="w-2/6" h="h-2/5" h1={"Inscritos"}>
                <h2 className="text-xl text-center text-emerald-900 pb-2 border-b-2 border-emerald-900/15">Total: <span className="ml-2 font-medium">{inscribes.length}</span></h2>
                <div className="flex flex-col gap-3 pl-3 pt-2 items-center">
                    {
                    inscribes.length === 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> :
                    
                    inscribes.map((user, index) => (
                            <UserSmallCard key={index} idUser={user}/>
                    ))
                    
                    }
                </div>
        </Modal>
    );
}

export default OfferInscribedUserModal;
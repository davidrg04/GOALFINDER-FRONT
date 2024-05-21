import React from "react";
import { jwtDecode } from "jwt-decode";
import Modal from "../Modal";
import { useState, useEffect } from "react";
import { useGetOffers } from "../../functions/ApiCalls/getOffers";
import { useGetInscribedOffers } from "../../functions/ApiCalls/getInscribedOffers";
import OfferCard from "../OfferCard";
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Empty } from 'antd';
import OfferInscribedUserModal from "./OfferInscribedUsers";

const OffersModal = ({ isOpen,isClose}) => {
    const [userRol, setUserRol] = useState(null);
    const [userId, setUserId] = useState(null);
    const { data: inscribedData, isLoading, refetch } = useGetInscribedOffers();
    const { data: offers, isLoading: isLoadingOffers} = useGetOffers();
    const [inscribedUserModal, setInscribedUserModal] = useState(false);
    const [inscribes, setInscribes] = useState();

    useEffect(() => {
        function checkTokenAndUpdateUserId() {
            const token = localStorage.getItem('jwt');
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    setUserRol(decoded.rol);
                    setUserId(decoded.id);
                } catch (error) {
                    console.error('Error decoding token:', error);
                }
            } else {
                setUserRol(null);
            }
        }
        checkTokenAndUpdateUserId();
        window.addEventListener('storage', checkTokenAndUpdateUserId);
    
        return () => window.removeEventListener('storage', checkTokenAndUpdateUserId);
    }, []);

    const toggleInscribedUserModal = (inscribes) => {
        setInscribes(inscribes);
        setInscribedUserModal(!inscribedUserModal);
    }
    

    if (isLoading && userRol === null && isLoadingOffers) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <Modal isOpen={isOpen} isClose={isClose} h1={"Ofertas "}>
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                </Modal>
            </div>
        );
        
    }

    return (
        <>
        <Modal isOpen={isOpen} isClose={isClose} h1={"Ofertas "} minw="min-w-96" w="w-3/5" h="h-4/5">
            <div className="flex">
                <div className="w-full flex-col gap-3 mt-2">
                    <h2 className="text-xl text-center text-emerald-900 pb-3 border-b-2 border-emerald-900/15">Inscritas <span className="ml-2 font-medium">{inscribedData?.inscribedOffers.length}</span></h2>
                    <div className="p-2">
                    {
                        inscribedData?.inscribedOffers.length === 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> :
                        inscribedData?.inscribedOffers.map((offer,index) => (
                            <OfferCard key={index} offerId={offer} updateData={() => refetch()} />
                        ))
                    }
                    </div>
                   
                </div>
               {userRol === "club" &&
                <div className="w-full flex-col gap-3 mt-2">
                    <h2 className="text-xl text-center text-emerald-900 pb-3 border-b-2 border-emerald-900/15">Ofertas Propias<span className="ml-2 font-medium">{ offers?.myOffers.filter(offer => offer.idUser === userId).length}</span></h2>
                    <div className="p-2 flex flex-col gap-4">
                    {
                        offers?.myOffers.filter(offer => offer.idUser === userId).length === 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> :
                        offers?.myOffers.filter(offer => offer.idUser === userId).map((offer,index) => (
                            <OfferCard key={index} offerId={offer.idOffer} toggle={toggleInscribedUserModal} profileUse/>
                        ))
                    }
                    </div>   
                </div>
                }
            </div>
        </Modal>
        {inscribedUserModal && <OfferInscribedUserModal isVisible={inscribedUserModal} onClose={toggleInscribedUserModal} inscribes={inscribes} />}
        </>
        
    );
};
export default OffersModal;
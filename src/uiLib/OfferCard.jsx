import React, {useState, useEffect} from "react";
import { Collapse,ConfigProvider, theme } from 'antd';
import UserSmallCard from "./UserSmallCard";
import { useGetOffers } from "../functions/ApiCalls/getOffers";
import {Spin} from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { useGetInscribedOffers } from "../functions/ApiCalls/getInscribedOffers";
import { useOfferInscribe } from "../functions/ApiCalls/offerInscribe";

const OfferCard = ({offerId, profileUse, updateData, toggle}) => {
    const {mutate: inscribeOffer} = useOfferInscribe();
    const { data, isLoading } = useGetOffers(offerId ? offerId : null);
    const { data: inscribedOffersData, isLoading: isLoadingInscribed } = useGetInscribedOffers();
    const [isInscribed, setIsInscribed] = useState(null);

    useEffect(() => {
        if (inscribedOffersData && data) {
            const isOfferInscribed = inscribedOffersData.inscribedOffers.includes(data?.myOffers[0].idOffer);
            setIsInscribed(isOfferInscribed);
        }
    }, [inscribedOffersData, data]);


    if(isLoading || isLoadingInscribed || isInscribed === null){
        return (
            <div className="border-2 border-emerald-700 pt-2 px-2 flex-col">
                <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
           </div>
        )
    }

    const toggleInscribe= () =>{
        const inscribe = !isInscribed;
        inscribeOffer({offerId, isInscribe: inscribe}, {
            onSuccess: () => {
                setIsInscribed(inscribe);
                updateData();
            }
        });
    }

    const toggleInscribedUserModal = () => {
        toggle(data?.myOffers[0].inscribes);
    }

    return (
        <>
        <div className="border-2 border-emerald-700 pt-2 flex-col rounded-xl shadow-xl">
                <ConfigProvider
                theme={{
                    token: {
                        colorBgContainer: '#34d399',
                    },
                    components: {
                        Collapse: {
                            backgroundColor: '#34d399',
                        },
                    },
                }}
                >
                    <div className="px-4 pt-2">
                        <UserSmallCard idUser={data?.myOffers[0].idUser}/>
                    </div>
                    <div className="mt-3 px-4">
                        <div className="flex gap-4">
                            <span className="text-lg font-semibold text-emerald-700">Oferta de :<span className="text-emerald-950 ml-1">{data?.myOffers[0].position !== null ? data?.myOffers[0].position : data?.myOffers[0].footballRole}</span></span>
                            <span className="text-lg font-semibold text-emerald-700">Duración :<span className="text-emerald-950 ml-1">{data?.myOffers[0].startDate} - {data?.myOffers[0].endDate}</span></span>
                       </div>
                       <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-emerald-700">Club : <span className="text-emerald-950">{data?.myOffers[0].club}</span></span>
                        {!profileUse &&
                            <div onClick={toggleInscribe} className={`rounded-xl text-sm font-semibold px-3 transition-colors cursor-pointer ${isInscribed ? `border-2 border-emerald-700 text-emerald-700 bg-emerald-50` : `bg-emerald-700 text-emerald-50`}`}>{isInscribed ? 'Inscrito' : 'Inscribirse'}</div>
                        }
                        {profileUse &&
                            <div onClick={toggleInscribedUserModal} className={`rounded-xl text-sm font-semibold px-3 transition-colors cursor-pointer bg-emerald-700 text-emerald-50`}>Ver inscritos</div>
                        }
                       </div>
                    </div>
                    <Collapse bordered={false} className="bg-emerald-300/70 rounded-t-none rounded-b-xl mt-2">
                        <Collapse.Panel header="Descripción" key="1">
                            <p style={{ whiteSpace: 'pre-line' }}>
                                {data?.myOffers[0].description}
                            </p>
                        </Collapse.Panel>
                    </Collapse>
                </ConfigProvider>     
        </div>
       </>
    );
}
export default OfferCard;
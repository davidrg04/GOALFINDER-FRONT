import React from "react";
import { useState, useEffect } from "react";
import Modal from "../Modal";
import { Select, Form, AutoComplete, Button, ConfigProvider } from "antd";
import clubsData from "../../API/CLUBS/clubs.json";
import { useGetOffers } from "../../functions/ApiCalls/getOffers";
import {Spin} from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { Empty } from 'antd';
import OfferCard from "../OfferCard";
import { jwtDecode } from "jwt-decode";
const HeaderOffersModal = ({isOpen, isClose}) => {
    const { data: offers, isLoading, refetch } = useGetOffers();
    const [footballRole, setFootballRole] = useState(null);
    const [form] = Form.useForm();
    const { Option } = Select;
    const [inputClubValue, setInputClubValue] = useState("");
    const [clubs, setClubs] = useState([]);
    const [userId, setUserId] = useState(null);
    const [offersFiltered, setOffersFiltered] = useState([]);

    useEffect(() => {
        function checkTokenAndUpdateUserId() {
            const token = localStorage.getItem('jwt');
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    setUserId(decoded.id);
                } catch (error) {
                    console.error('Error decoding token:', error);
                }
            }
        }
        checkTokenAndUpdateUserId();
        window.addEventListener('storage', checkTokenAndUpdateUserId);
    
        return () => window.removeEventListener('storage', checkTokenAndUpdateUserId);
    }, []);

    useEffect(() => {
        if (clubsData && clubsData.clubs) {
            const initialClubs = clubsData.clubs.map(club => ({
                value: club,
                label: club
            }));
            setClubs(initialClubs);
        }
    }, []);

    const onSelectClub = (value) => {
        setInputClubValue(value);
    };

    const onSearchClub = (searchText) => {
        setInputClubValue(searchText);
        if (!searchText) {
            setClubs(clubsData.clubs.map(club => ({ value: club, label: club })));
        } else {
            const filteredClubs = clubsData.clubs.filter(club =>
                club.toLowerCase().includes(searchText.toLowerCase())
            );
            setClubs(filteredClubs.map(club => ({ value: club, label: club })));
        }
    };

    if (isLoading && userId === null ) {
        <Modal isOpen={isOpen} isClose={isClose} h1={"Ofertas"} minw="min-w-96" w="w-3/5" h="h-3/4">
            <Spin indicator={<LoadingOutlined style={{ fontSize: 44 }} spin />} />
        </Modal>
    }

    useEffect(() => {
        setOffersFiltered(offers?.myOffers.filter(offer => offer.idUser !== userId) || []);
    }, [offers, userId]);
    

    const isPositionSelectDisabled = !footballRole;

    const handleFootballRoleChange = (value) => {
        setFootballRole(value);
        form.setFieldsValue({ position: undefined });
    };

    const getPosition = (footballRole) => {
        switch (footballRole) {
            case "coach":
                return ["DT"];
            case "defender":
                return ["DFC", "LD", "LI"];
            case "midfielder":
                return ["MCD", "MC", "MCO"];
            case "forward":
                return ["DC", "SD", "EI", "ED"];
            default:
                return [];
        }
    };

    const handleSearch = () => {
        const footballRole = form.getFieldValue('footballRole');
        const position = form.getFieldValue('position');
        const club = form.getFieldValue('club');
        const filtered = offers?.myOffers.filter(offer => {
            return (
                (!footballRole || offer.footballRole === footballRole) &&
                (!position || offer.position === position) &&
                (!club || offer.club === club) &&
                offer.idUser !== userId
            );
        }) || [];

        setOffersFiltered(filtered);
    };

    return (
        <Modal isOpen={isOpen} isClose={isClose} h1={"Ofertas"} minw="min-w-96" w="w-3/5" h="h-4/5">
           <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-3 mt-3 items-center">
                    <span className="w-full text-emerald-950 font-bold text-lg text-center">Aplica los filtros que desees</span>
                    <ConfigProvider
                        theme={{
                            components: {
                                Button: {
                                    defaultColor: '#022c22',
                                    defaultBorderColor: '#022c22',
                                    defaultHoverColor: '#059669',
                                    defaultHoverBorderColor: '#059669',
                                    defaultActiveBorderColor: '#06c689',
                                    defaultActiveColor: '#06c689',
                                    algorithm: true,
                                    colorPrimaryHover: '#059669',
                                    colorPrimaryActive: '#065f46',
                                },
                            },
                        }}
                    >
                        <Form form={form} layout="inline" className="grid grid-cols-3 w-full">
                            <Form.Item label="Rol" name="footballRole">
                                <Select placeholder="Selecciona un Rol" size="middle" onChange={(value) => handleFootballRoleChange(value)} allowClear>
                                        <Option value="coach">Entrenador</Option>
                                        <Option value="defender">Defensa</Option>
                                        <Option value="midfielder">Mediocentro</Option>
                                        <Option value="forward">Delantero</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label="Posición" name="position">
                                <Select placeholder="Selecciona una Posición" size="middle" disabled={isPositionSelectDisabled} allowClear>
                                    {getPosition(footballRole).map((position) => (
                                                <Option key={position} value={position}>{position}</Option>
                                            ))}
                                </Select>
                            </Form.Item>
                            <Form.Item label="Club" name='club'>
                                <AutoComplete
                                    options={clubs.map((club) => ({
                                        value: club.value,
                                        label: club.label
                                    }))}
                                    onSelect={(value) => onSelectClub(value)}
                                    onSearch={(searchText) => onSearchClub(searchText)}
                                    value={inputClubValue}
                                    placeholder="Busca un Club"
                                    size="middle"
                                    allowClear
                            />
                            </Form.Item>
                            <div className="flex justify-center col-span-3 mt-5">
                                <Form.Item>
                                    <Button type="primary" onClick={handleSearch} className="bg-emerald-700 text-base flex justify-center items-center">
                                        Buscar
                                    </Button> 
                                </Form.Item>
                            </div>
                                 
                        </Form>
                    </ConfigProvider>
                </div>
                <div className="flex flex-col gap-3 items-center justify-center">
                    {
                        offersFiltered.length === 0 
                            ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                            : offersFiltered.map((offer, index) => (
                                <OfferCard key={index} offerId={offer.idOffer} updateData={()=> refetch()}/>
                            ))
                    }
                </div>
           </div>
        </Modal>
    );
}
export default HeaderOffersModal;
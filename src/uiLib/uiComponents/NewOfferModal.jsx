import React,{useState,useEffect} from "react";
import Modal from "../Modal";
import { Form,Input, Select, AutoComplete,DatePicker, Button, ConfigProvider, message } from "antd";
import clubsData from "../../API/CLUBS/clubs.json";
import RequiredFieldsText from "../RequiredFieldsText";
import { useNewOffer } from "../../functions/ApiCalls/newOffer";
const NewOfferModal = ({isOpen, isClose}) => {
    const [form] = Form.useForm();
    const [footballRole, setFootballRole] = useState("");
    const isPositionSelectDisabled = !footballRole;
    const [inputClubValue, setInputClubValue] = useState("");
    const [clubs, setClubs] = useState([]);
    const { RangePicker } = DatePicker;
    const {mutate: newOffer, isSuccess} = useNewOffer();

    if(isSuccess){
        message.success("Oferta creada con éxito");
        isClose();
    }

    useEffect(() => {
        if (clubsData && clubsData.clubs) {
            const initialClubs = clubsData.clubs.map(club => ({
                value: club,
                label: club
            }));
            setClubs(initialClubs);
        }
    }, []);

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
            ).map(club => ({
                value: club,
                label: club,
            }));
            setClubs(filteredClubs);
        }
    };

    const onBlurClub = () => {
        const isValidClub = clubs.some(club => club.value === inputClubValue);
        if (!isValidClub && inputClubValue) {
            form.setFields([
                {
                    name: 'club',
                    errors: ['Por favor, selecciona un club válido'],
                },
            ]);
        }
    };

   

    return(
        <Modal isOpen={isOpen} isClose={isClose} w="w-2/6" h1={"Añade una oferta"}>
            <div className="flex flex-col">
                <div className="mt-2">
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
                            Select: {
                                optionActiveBg: '#e2e8f0',
                            },
                            Upload: {
                                colorPrimary: '#059669',
                            },
                        },
                    }}
                    >
                    <Form
                        name="newOfferForm"
                        layout="vertical"
                        form={form}
                        autoComplete="off"
                        className="grid grid-cols-1 gap-3 xl:grid-cols-2"
                        onFinish={formValues => newOffer(formValues)}
                    >
                        <RequiredFieldsText />
                        <Form.Item
                            label="Desempeño"
                            name="footballRole"
                            rules={[{ required: true, message: 'Selecciona una opción' }]}
                        >
                            <Select
                                placeholder="Selecciona una opción"
                                allowClear
                                onChange={(value) => handleFootballRoleChange(value)}
                            >
                                <Option value="coach">Entrenador</Option>
                                <Option value="defender">Defensa</Option>
                                <Option value="midfielder">Mediocentro</Option>
                                <Option value="forward">Delantero</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Posición"
                            name="position"
                        >
                            <Select
                                placeholder="Selecciona una opción"
                                allowClear
                                disabled={isPositionSelectDisabled}
                            >
                                {getPosition(footballRole).map((position) => (
                                    <Option key={position} value={position}>{position}</Option>
                                ))}
                            </Select>
                        
                        </Form.Item>
                        <Form.Item
                        label="Equipo"
                        name="club"
                        rules={[{ required: true, message: "Por favor, introduzca un equipo" }]}
                        >
                            <AutoComplete
                                value={inputClubValue}
                                options={clubs}
                                onSelect={onSelectClub}
                                onSearch={onSearchClub}
                                onBlur={onBlurClub}
                                placeholder="Introduce tu equipo"
                            />
                        </Form.Item>
                        <Form.Item 
                        label="Duración"
                        name="duration"
                        rules={[{ required: true, message: "Por favor, introduzca la duración del contrato" }]}
                        >
                            <RangePicker picker="month" placeholder={["Inicio","Fin"]}/>
                        </Form.Item>
                        <Form.Item
                        label="Añade una descripción del puesto"
                        name="description"
                        className="xl:col-span-2"
                        rules={[{ required: true, message: "Por favor, añade una descripción del puesto" }]}
                        >
                            <Input.TextArea className="min-w-44" maxLength={530}  autoSize={{ minRows: 4, maxRows: 9 }}/>
                        </Form.Item>
                        <Button type="primary" htmlType="submit" className="bg-emerald-700 hover:bg-emerald-600 text-base flex justify-center items-center xl:col-start-2">
                            Guardar
                        </Button>
                    </Form>
                </ConfigProvider>
                </div>
            </div>
        </Modal>
    )
}

export default NewOfferModal;
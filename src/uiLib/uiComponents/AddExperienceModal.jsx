import {React, useState, useEffect} from "react";
import Modal from "../Modal";
import { Input, Form, Select, Button, ConfigProvider, DatePicker, message, Checkbox, AutoComplete} from "antd";
import {useMutation, useQuery } from 'react-query';
import RequiredFieldsText from "../RequiredFieldsText";
import dayjs from 'dayjs';
import clubsData from "../../assets/clubs.json";
import { jwtDecode } from "jwt-decode";



const AddExperienceModal = ({isOpen,isClose, use, initialValues = {} }) => {
    const ADD_USER_EXPERIENCE_URL = 'https://goalfinder-back-production.up.railway.app/API/ACCESS/addUserExperience.php';
    const EDIT_USER_EXPERIENCE_URL = 'https://goalfinder-back-production.up.railway.app/API/ACCESS/editUserExperience.php';
    const [clubs, setClubs] = useState([]);
    const [selectedClub, setSelectedClub] = useState(null);
    const [inputClubValue, setInputClubValue] = useState("");
    const [form] = Form.useForm();
    const { RangePicker } = DatePicker;
    const { Option } = Select;
    const [footballRole, setFootballRole] = useState("");
    const isPositionSelectDisabled = !footballRole;
    const [isCurrentTeam, setIsCurrentTeam] = useState(false);
    const [isCurrentClub, setIsCurrentClub] = useState(false);
    const { data } = useQuery(['userClub'], getUserClub, {
        enabled: !!initialValues
    });
    const [userRol, setUserRol] = useState(null);
    console.log("Valores iniciales",initialValues)
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

    useEffect(() => {
        if (clubsData && clubsData.clubs) {
            const initialClubs = clubsData.clubs.map(club => ({
                value: club,
                label: club
            }));
            setClubs(initialClubs);
        }
    }, []);
    

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
    

    const onSelectClub = (value) => {
        setInputClubValue(value);
        const selectedClub = clubs.find(club => club.value === value);
        setSelectedClub(selectedClub || null);
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
    

    async function getUserClub() {
        const jwt = localStorage.getItem('jwt'); 
        if (!jwt) {
            message.error('Error de autenticación, por favor inicia sesión nuevamente');
            throw new Error('Error, no se encuentra el token de autenticación');
        }
    
        const response = await fetch('https://goalfinder-back-production.up.railway.app/API/ACCESS/getUserClub.php', {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}` 
            }
        });
    
        if (!response.ok) {
            message.error('Error al obtener los datos del club');
            throw new Error('Error al obtener los datos del club');
        }
    
        return response.json();
    }
    
    useEffect(() => {
        if (initialValues && initialValues.startDate && initialValues.endDate && data && data) { 
            const isCurrentClub = (initialValues.club === data.club) ? true : false;
            const currentMonth = dayjs().startOf('month');
            const isCurrentOrFutureMonth = dayjs(initialValues.endDate).isAfter(currentMonth) ||
                                            dayjs(initialValues.endDate).isSame(currentMonth);
            setIsCurrentTeam(isCurrentOrFutureMonth);
            setIsCurrentClub(isCurrentClub);
    
            form.setFieldsValue({
                club: initialValues.club,
                duration: [dayjs(initialValues.startDate), dayjs(initialValues.endDate)],
                footballRole: initialValues.footballRole,
                position: initialValues.position,
                description: initialValues.description,
            });
        }

    }, [initialValues, data]);


    const onCurrentClubChange = (e) => {
        setIsCurrentClub(e.target.checked);
    };
    const handleDateChange = (dates) => {
        if (dates && dates.length === 2) {
            const endDate = dayjs(dates[1]).startOf('month');
            const currentMonth = dayjs().startOf('month');
            const isCurrentOrFutureMonth = endDate.isAfter(currentMonth) ||
                                           endDate.isSame(currentMonth);
    
            setIsCurrentTeam(isCurrentOrFutureMonth);
        } else {
            setIsCurrentTeam(false);
        }
    };
    

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

    const updateUserExperience = async (userExperience) => {
        const jwt = localStorage.getItem('jwt');
        if (!jwt) {
            message.error('Error de autenticación, por favor inicia sesión nuevamente');
            throw new Error('Error, no se encuentra el token de autenticación');
        }
        const startDate = userExperience.duration[0].format('YYYY-MM');
        const endDate = userExperience.duration[1].format('YYYY-MM');
        const dataToSubmit = {
            ...userExperience,
            startDate: startDate,
            endDate: endDate,
            isCurrentClub: isCurrentClub,
            idExperience : initialValues.idExperience
        };
        console.log("Lo que envia",dataToSubmit)
        const response = await fetch(initialValues.club ? `${EDIT_USER_EXPERIENCE_URL}` : `${ADD_USER_EXPERIENCE_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            },
            body: JSON.stringify(dataToSubmit)
        });
    
        if (!response.ok) {
            message.error('Error al guardar la experiencia');
            throw new Error('Error al guardar la experiencia');
        }
    
        return response.json();
    };

    const { mutate: addExperience} = useMutation(updateUserExperience, {
        onSuccess: () => {
            message.success('Experiencia añadida correctamente');
            isClose();
        },
    });

    return (
        <Modal isOpen={isOpen} isClose={isClose} w="w-2/6">
            <h1 className="text-2xl text-emerald-900 font-bold pb-2 border-b-2 border-emerald-900/15">
                {use}
            </h1>
            <RequiredFieldsText/>
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
                name="addExperienceForm"
                initialValues={{ remember: true }}
                layout="vertical"
                form={form}
                onFinish={formValues => addExperience(formValues)}
                autoComplete="off"
                className="grid grid-cols-1 gap-3 xl:grid-cols-2 mt-5"
                >
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
                    <RangePicker picker="month" placeholder={["Inicio","Fin"]} onChange={handleDateChange}/>
                </Form.Item>
                {isCurrentTeam && (
                    <Form.Item
                        name="isCurrentClub"
                        valuePropName="checked"
                        className="xl:col-span-2 xl:col-start-2 flex items-center"
                    >
                        <label className="mr-2">¿Es tu club actual?</label>
                        <Checkbox checked={isCurrentClub} onChange={onCurrentClubChange}>Si</Checkbox>
                    </Form.Item>
                )}
                {userRol == "player" &&
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
                }
                {userRol == "player" &&
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
                }
                <Form.Item
                    label="¿Algo que contar de tu paso por el equipo?"
                    name="description"
                    className="xl:col-span-2"

                >
                    <Input.TextArea className="min-w-44" maxLength={130}  autoSize={{ minRows: 3, maxRows: 5 }}/>
                </Form.Item>
                <Button type="primary" htmlType="submit" className="bg-emerald-700 hover:bg-emerald-600 text-base flex justify-center items-center xl:col-start-2">
                    {initialValues.club ? 'Actualizar' : 'Guardar'}
                </Button>   
                </Form>
                </ConfigProvider>
        </Modal> 
    );
};

export default AddExperienceModal;

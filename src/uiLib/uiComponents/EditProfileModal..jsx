import { React, useState, useEffect } from "react";
import Modal from "../Modal";
import { Input, Form, Select, Button, ConfigProvider, DatePicker, AutoComplete, message} from "antd";
import citiesData from "../../API/UBICATIONS/arbol.json";
import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import NewPublication from "../NewPublication";
import ExperienceCard from "../ExperienceCard";
import AddExperienceModal from "./AddExperienceModal";
import { useQuery, useMutation } from 'react-query';
import moment from 'moment';
import DeleteExperiencesModal from "./DeleteExperiencesModal";
import { jwtDecode } from "jwt-decode";
import ChangePasswordModal from "./ChangePasswordModal";

function beforeUpload(file) {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("Solo puede surbir archivos JPG/PNG!");
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("La imagen pesa demasiado, debe ser inferior a 2MB!");
      return false;
    }
    return true;  
}

const EditProfileModal = ({ isOpen, isClose}) => {
    const [modalState, setModalState] = useState({
        visible: false,
        mode: null, 
        experience: null, 
    });
      
    const { Option } = Select;
    const [footballRole, setFootballRole] = useState("");
    const [form] = Form.useForm();
    const [comunidades, setComunidades] = useState([]);
    const [selectedCommunity, setSelectedCommunity] = useState(null);
    const [cities, setCities] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [cityInputValue, setCityInputValue] = useState("");
    const [loadingImg, setLoadingImg] = useState(false);
    const [imagePath, setImagePath] = useState("");
    const [messageApi, contextHolder] = message.useMessage();
    const { data } = useQuery(['userProfile'], getUserData);
    const [userExperience, setUserExperience] = useState([{}]);
    const { data: experiences, refetch } = useQuery(['userProfileExperience'], getUserExperience);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [selectedExperienceId, setSelectedExperienceId] = useState(null);
    const [userRol, setUserRol] = useState(null);
    const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] = useState(false);
    const [isFormChanged, setIsFormChanged] = useState(false);

    const toggleChangePasswordModal = () => {
        setIsChangePasswordModalVisible(!isChangePasswordModalVisible);
    }

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



    async function getUserData() {
        const jwt = localStorage.getItem('jwt'); 
        if (!jwt) {
            messageApi.open({
                type: 'error',
                content: 'Error, no se encuentra el token de autenticación',
            }); 
            throw new Error('Error, no se encuentra el token de autenticación');
        }
    
        const response = await fetch('http://localhost/GOALFINDER/src/API/ACCESS/getUsersData.php', {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}` 
            }
        });
    
        if (!response.ok) {
            messageApi.open({
                type: 'error',
                content: 'Error. No se pueden obtener los datos',
            });
        }
    
        return response.json();
    }
    const updateUserData = async (userData) => {
        const jwt = localStorage.getItem('jwt');
        if (!jwt) {
            messageApi.open({
                type: 'error',
                content: 'Error, no se encuentra el token de autenticación',
            }); 
            throw new Error('Error, no se encuentra el token de autenticación');
        }
    
        const response = await fetch('http://localhost/GOALFINDER/src/API/ACCESS/updateUserData.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            },
            body: JSON.stringify(userData)
        });
    
        if (!response.ok) {
            messageApi.open({
                type: 'error',
                content: 'Error al actualizar los datos del usuario',
            });
            throw new Error('Failed to update user data');
        }
    
        return response.json();
    };

    const { mutate: updateUser, isLoading} = useMutation(updateUserData, {
        onSuccess: () => {
            console.log('Mutation successful');
            message.success('Perfil actualizado correctamente');
        },
        onError: () => {
            console.log('Mutation failed');
            message.error('Error al actualizar el perfil');
        }
    });

    useEffect(() => {
        if (data) {
            form.setFieldsValue({
                name: data.name,
                username: data.username,
                surname: data.surnames,
                birthDate: data.birthDate ? moment(data.birthDate) : null,
                footballRole: (data.footballRole === "") ? "" : data.footballRole,
                position: (data.position === "") ? "" : data.position,
                community : (data.community === "") ? "" : data.community,
                city: (data.city === "") ? "" : data.city,
                description: (data.description === "") ? "" : data.description,
            });
            if (data.profilePicture) {
                setImagePath(`http://localhost/GOALFINDER/src/API/ACCESS/users/user${data.id}/${data.profilePicture}`);
            }
        }
    }, [data, form]);

    async function getUserExperience() {
        const jwt = localStorage.getItem('jwt'); 
        if (!jwt) {
            messageApi.error('Error, no se encuentra el token de autenticación');
            throw new Error('Error, no se encuentra el token de autenticación');
        }
    
        const response = await fetch('http://localhost/GOALFINDER/src/API/ACCESS/getUserExperience.php', {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}` 
            }
        });
    
        if (!response.ok) {
            message.error('Error. No se pueden obtener los datos de la experiencia');
        }

        return response.json();
    }

    useEffect(() => {
        if (experiences) {
            setUserExperience(experiences);  
        }
    }, [experiences]);


    const openAddModal = () => {
        setModalState({ visible: true, mode: 'add', experience: null });
    };
      
    const openEditModal = (experience) => {
        setModalState({ visible: true, mode: 'edit', experience });
    };
      
    const closeModal = () => {
        setModalState({ visible: false, mode: null, experience: null });
        refetch();
    };

    const toggleDeleteModal = (idExperience) => {
        setIsDeleteModalVisible(!isDeleteModalVisible);
        setSelectedExperienceId(idExperience);
    };

    const deleteUserExperience = async (idExperience) => {
        const jwt = localStorage.getItem('jwt');
        if (!jwt) {
            message.error('Error, no se encuentra el token de autenticación');
            throw new Error('Error, no se encuentra el token de autenticación');
        }
        console.log(idExperience);

        const response = await fetch('http://localhost/GOALFINDER/src/API/ACCESS/deleteUserExperience.php', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            },
            body: JSON.stringify({'idExperience': idExperience})
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al eliminar la experiencia');
        }
        return response.json();
    };

    const { mutate: deleteExperience } = useMutation(deleteUserExperience, {
        onSuccess: () => {
            message.success('Experiencia eliminada correctamente');
            setIsDeleteModalVisible(false);
            refetch();
        },
        onError: () => {
            message.error('Error al eliminar la experiencia');
        }
    });

    const deleteExperienceHandler = () => {
        if (selectedExperienceId) {
            deleteExperience(selectedExperienceId);
        }
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

    useEffect(() => {
        const comunidadesOptions = citiesData.map((comunidad) => ({
            value: comunidad.label,
            label: comunidad.label,
            provinces: comunidad.provinces
        }));
        setComunidades(comunidadesOptions);
    }, []);

    useEffect(() => {
        if (selectedCommunity && Array.isArray(selectedCommunity.provinces)) {
            const cityOptions = selectedCommunity.provinces.reduce((acc, province) => {
                if (Array.isArray(province.towns)) {
                    const towns = province.towns.map(town => ({
                        value: town.label,
                        label: town.label
                    }));
                    return [...acc, ...towns];
                } else {
                    return acc;
                }
            }, []);
            setCities(cityOptions);
        } else {
            setCities([]);  
            setCityInputValue("");  
        }
    }, [selectedCommunity]);
    
    

    const onSearch = (searchText) => {
        setInputValue(searchText);
        setComunidades(
            citiesData
                .filter((comunidad) =>
                    comunidad.label.toLowerCase().includes(searchText.toLowerCase())
                )
                .map((comunidad) => ({
                    value: comunidad.label,
                    label: comunidad.label,
                    provinces: comunidad.provinces 
                }))
        );
    };

      const onSelect = (value) => {
        setInputValue(value);
        const selectedComunidad = comunidades.find(comunidad => comunidad.label === value);
        if (selectedComunidad) {
            setSelectedCommunity(selectedComunidad);
        } else {
            setSelectedCommunity(null);  
        }
    };

    const isPositionSelectDisabled = !footballRole;
    const handleFootballRoleChange = (value) => {
        setFootballRole(value);
        form.setFieldsValue({ position: undefined });
    };
    const onBlurCommunity = () => {
        const isValidComunidad = comunidades.some(option => option.value === inputValue);
        if (!isValidComunidad) {
            form.setFields([
                {
                    name: 'community',
                    errors: ['Por favor, selecciona una opción válida de la lista'],
                },
            ]);
        } else {
            console.log('Comunidad válida:', inputValue);
        }
    };
    const onBlurCity = () => {
        const isValidCity = cities.some(option => option.value === cityInputValue);
        if (!isValidCity) {
            console.log("Ciudad no válida");
            form.setFields([
                {
                    name: 'city',
                    errors: ['Por favor, selecciona una opción válida de la lista'],
                },
            ]);
        } else {
            console.log('Ciudad válida:', cityInputValue);
        }
    };
    
    const uploadButton = (
        <div>
          {loadingImg ? <LoadingOutlined /> : <PlusOutlined />}
          <div style={{ marginTop: 8 }}>Editar foto</div>
        </div>
      );
      const handleChange = info => {
        if (info.file.status === 'uploading') {
            setLoadingImg(true);
        } else if (info.file.status === 'done') {
            setLoadingImg(false);
            if (info.file.response && info.file.response.url) {
                setImagePath(info.file.response.url);
            } else {
                message.error('Error al cargar la imagen');
            }
        } else if (info.file.status === 'error') {
            setLoadingImg(false);
            message.error(`Error al subir la imagen: ${info.file.response.error}`);
        }
    };

    const checkUsernameAvailability = async (username) => {
        const response = await fetch(`http://localhost/GOALFINDER/src/API/ACCESS/checkUsername.php?username=${username}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("jwt")}`
            }
        });
        const result = await response.json();
        return result.exists;
    };
    
    const handleFieldsChange = () => {
        setIsFormChanged(form.isFieldsTouched());
    };

    return (
        <>
        <Modal isOpen={isOpen} isClose={isClose} w="w-2/6" minw="min-w-96" h="h-4/5" px={"px-7"}>
            <h1 className="text-2xl text-emerald-900 font-bold pb-2 border-b-2 border-emerald-900/15">
                Editar Perfil
            </h1>
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
                        name="editProfileForm"
                        initialValues={{ remember: true }}
                        layout="vertical"
                        form={form}
                        onFinish={formValues => updateUser(formValues)}
                        onFieldsChange={handleFieldsChange}
                        autoComplete="off"
                        className="grid grid-cols-1 gap-3 xl:grid-cols-2"
                        >
                            <p className="text-emerald-950 text-xs xl:col-span-2">*El asterisco indica que es obligatorio</p>
                            <Form.Item
                                id="profilePicture"
                                label="Foto de perfil"
                                name="profilePicture"
                                className="justify-self-center xl:col-span-2"
                            >
                                <ImgCrop rotationSlider cropShape="round" modalTitle="Ajuste su foto">
                                    <Upload
                                        progress={ { strokeColor: { '0%': '#108ee9', '100%': '#87d068' }, strokeWidth: 3, showInfo: false } }
                                        name="profilePicture"
                                        action="http://localhost/GOALFINDER/src/API/ACCESS/uploadProfilePicture.php"
                                        headers={{
                                            Authorization: `Bearer ${localStorage.getItem("jwt")}`
                                        }}
                                        listType="picture-circle"
                                        showUploadList={false}
                                        maxCount={1}
                                        beforeUpload={beforeUpload}
                                        onChange={handleChange}
                                    >
                                        {imagePath ? (
                                            <img src={imagePath} alt="avatar" style={{ width: "100%", height: "auto", borderRadius: '50%' }} />

                                        ) : (
                                            uploadButton
                                        )}
                                    </Upload>
                                </ImgCrop>
                            </Form.Item>
                            <Form.Item
                                label="Nombre"
                                name="name"
                                rules={[
                                    { required: true, message: 'Por favor, introduce tu nombre' },
                                    { max: 20, message: 'El nombre no puede tener más de 20 caracteres' }
                                ]}
                            >
                                <Input className="min-w-44" />
                            </Form.Item>
                        
                        
                            <Form.Item
                                label="Apellidos"
                                name="surname"
                                rules={[
                                    { required: true, message: 'Por favor, introduce tus apellidos' },
                                    { max: 50, message: 'Los apellidos no puede tener más de 50 caracteres' }

                                ]}
                            >
                                <Input className="min-w-44" />
                            </Form.Item>

                            <Form.Item
                                label="Nombre de usuario"
                                name="username"
                                rules={[
                                    { required: true, message: 'Por favor, introduce tu nombre de usuario' },
                                    { pattern: /^[a-zA-Z0-9]*$/, message: 'El nombre de usuario solo puede contener letras y números' },
                                    { pattern: /[a-zA-Z]/, message: 'El nombre de usuario debe contener al menos una letra' },
                                    { max: 25, message: 'El nombre de usuario no puede tener más de 25 caracteres' },
                                    {
                                        validator: async (_, value) => {
                                            if (value) {
                                                const exists = await checkUsernameAvailability(value);
                                                if (exists) {
                                                    return Promise.reject(new Error('El nombre de usuario ya existe'));
                                                }
                                            }
                                            return Promise.resolve();
                                        }
                                    }
                                ]}
                            >
                                <Input className="min-w-44" />
                            </Form.Item>
                            <Form.Item
                                label="Fecha de nacimiento"
                                name="birthDate"
                                rules={[
                                    { required: true, message: 'Por favor, introduce tu fecha de nacimiento' },
                                    {
                                        validator: (_, value) => {
                                            if (value && value.isAfter(moment())) {
                                                return Promise.reject(new Error('La fecha de nacimiento no puede ser una fecha futura'));
                                            }
                                            return Promise.resolve();
                                        }
                                    }
                                ]}
                            >
                                <DatePicker className="w-full"/>
                            </Form.Item>
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
                                label="Comunidad"
                                name="community"
                                rules={[{ required: true, message: 'Por favor, introduce tu comunidad' }]}
                            >
                                <AutoComplete
                                   value={inputValue}
                                   options={comunidades}
                                   onSelect={onSelect}
                                   onSearch={onSearch}
                                   onBlur={onBlurCommunity}
                                   placeholder="Introduce tu comunidad"
                                />
                            </Form.Item>
                            <Form.Item
                                label="Ciudad"
                                name="city"
                                rules={[{ required: true, message: 'Por favor, selecciona tu ciudad' }]}
                            >
                                <AutoComplete
                                    value={cityInputValue}
                                    options={cities}
                                    onSelect={(value) => setCityInputValue(value)}
                                    onBlur={onBlurCity}
                                    onSearch={(searchText) => {
                                        setCityInputValue(searchText);
                                        const filteredCities = selectedCommunity.provinces.flatMap(province =>
                                            province.towns.filter(town =>
                                                town.label.toLowerCase().includes(searchText.toLowerCase())
                                            ).map(town => ({
                                                value: town.label,
                                                label: town.label
                                            }))
                                        );
                                        setCities(filteredCities);
                                    }}
                                    placeholder="Introduce tu ciudad"
                                    disabled={cities.length === 0}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Descripción"
                                name="description"
                                className="xl:col-span-2"

                            >
                                <Input.TextArea className="min-w-44" maxLength={130}  autoSize={{ minRows: 3, maxRows: 5 }}/>
                            </Form.Item>
                            <span onClick={toggleChangePasswordModal} className="hover:cursor-pointer text-emerald-800 hover:text-emerald-600 transition-colors *:">¿Quieres cambiar tu contraseña?</span>
                            <div></div>
                            <h2 className="text-2xl text-emerald-900 font-bold pb-2 border-b-2 border-emerald-900/15 xl:col-span-2">
                                Experiencia
                            </h2>
                            <p className="text-emerald-950 text-xs xl:col-span-2">Consulta tu experiencia y añade nuevas</p>
                            <div className="justify-self-center xl:col-span-2 mt-1">
                                <NewPublication onClick={openAddModal} w="w-fit" bg="bg-slate-100" fontSize="text-sm">Añadir Experiencia</NewPublication>
                            </div>
                            <div className="flex flex-col gap-2 xl:col-span-2 mt-2">
                               {
                                userExperience.length > 0 ? (
                                    userExperience.map((experience,index) => (    
                                        <ExperienceCard editProfile onDelete={() => toggleDeleteModal(experience.idExperience)} onEdit={() => openEditModal(experience)} key={experience.index} club={experience.club} startDate={experience.startDate} endDate={experience.endDate} description={experience.description} position={experience.position}/>
                                    ))
                                ) : (
                                    <p className="text-emerald-950 text-sm">No hay experiencias añadidas</p>
                                )
                               }
                            </div>
                            <Button disabled={isLoading || !isFormChanged} type="primary" htmlType="submit" className="bg-emerald-700 hover:bg-emerald-600 text-base flex justify-center items-center xl:col-start-2 disabled:bg-slate-300 disabled:hover:bg-slate-300">
                                {isLoading ? 'Guardando...' : 'Guardar'}
                            </Button>          
                    </Form>
                    </ConfigProvider>
                </div>
            </div>
        </Modal>
        {modalState.visible && (
            <AddExperienceModal
                isOpen={modalState.visible}
                isClose={closeModal}
                use={modalState.mode === 'add' ? 'Añadir Experiencia' : 'Editar Experiencia'}
                initialValues={modalState.mode === 'edit' ? modalState.experience : {}}
            />
        )}

        {isDeleteModalVisible && (
            <DeleteExperiencesModal
                isOpen={isDeleteModalVisible}
                isClose={() => toggleDeleteModal(null)}                
                onDelete={deleteExperienceHandler}
            />
        )}
        {isChangePasswordModalVisible && (
            <ChangePasswordModal
                isOpen={isChangePasswordModalVisible}
                isClose={toggleChangePasswordModal}
            />
        )}
        
        </>
    );
}

export default EditProfileModal;
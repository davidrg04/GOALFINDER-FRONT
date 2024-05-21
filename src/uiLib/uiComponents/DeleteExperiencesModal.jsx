import React from "react";
import Modal from "../Modal";
import { Button, ConfigProvider } from "antd";
const DeleteExperiencesModal = ({isOpen, isClose, onDelete }) => {
    return (
        <Modal h1={'Borrar experiencia'} isOpen={isOpen} isClose={isClose} w="w-2/5">
                <div className="flex flex-wrap">
                    <p className="mt-3 text-lg text-emerald-950 font-normal w-full">¿Estás seguro de que quieres borrar esta experiencia?</p>
                    <div className="w-full justify-end flex gap-2 mt-3">
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
                        <Button onClick={isClose}>
                            Cancelar
                        </Button>
                        <Button onClick={onDelete} type="primary" className="bg-emerald-700 hover:bg-emerald-700">
                            Borrar
                        </Button>
                    </ConfigProvider>
                    </div>
                </div>
        </Modal>
    );
    };

export default DeleteExperiencesModal;
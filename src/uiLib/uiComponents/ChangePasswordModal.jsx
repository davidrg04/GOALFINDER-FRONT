import React from "react";
import Modal from "../Modal";
import { Form, Input, Button, ConfigProvider, message} from "antd";
import { useChangePassword } from "../../functions/ApiCalls/changePassword";

const ChangePasswordModal = ({isOpen, isClose}) => {
    const [form] = Form.useForm();
    const { mutate: changePassword, isLoading } = useChangePassword();

    const handleFinish = (values) => {
        changePassword(
            { oldPassword: values.oldPassword, newPassword: values.newPassword },
            {
                onSuccess: (data) => {
                    if (data.status === 'success') {
                        message.success('Contraseña cambiada correctamente');
                        form.resetFields();
                        isClose();
                    }
                },
                onError: (error) => {
                    if (error.status === 400) {
                        message.error('La contraseña actual es incorrecta');
                    } else {
                        message.error('Error al cambiar la contraseña');
                    }
                }
            }
        );
    };
    return (
        <Modal isOpen={isOpen} isClose={isClose} h1="Cambiar contraseña" w="w-80">
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
                                }
                            },
                        }}
            >

            
                <Form
                form={form}
                name="changePassword"
                layout="vertical"
                initialValues={{ remember: true }}
                onFinish={handleFinish}
                className="mt-4"
                >
                    <Form.Item
                        label="Contraseña actual"
                        name="oldPassword"
                        rules={[{ required: true, message: 'Por favor, introduce tu contraseña actual' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        label="Nueva contraseña"
                        name="newPassword"
                        rules={[
                            { required: true, message: 'Por favor, introduce tu nueva contraseña' },
                            { 
                                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/, 
                                message: 'La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula y un número' 
                            }
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        label="Repite la nueva contraseña"
                        name="repeatNewPassword"
                        rules={[
                            { required: true, message: 'Por favor, repite tu nueva contraseña' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Las contraseñas no coinciden'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="w-full bg-emerald-700 hover:bg-emerald-600" loading={isLoading}>
                            Cambiar contraseña
                        </Button>
                    </Form.Item>
                </Form>
            </ConfigProvider>
            
        </Modal>
    );
}

export default ChangePasswordModal;



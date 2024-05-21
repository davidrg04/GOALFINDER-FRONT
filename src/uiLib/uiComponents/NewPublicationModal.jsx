import {React, useState} from "react";
import Modal from "../Modal";
import { Form, message, Input, Button, ConfigProvider, Upload} from "antd";
import { UploadOutlined} from '@ant-design/icons';
import { useNewPublication } from "../../functions/ApiCalls/newPublication";
const NewPublicationModal = ({ isOpen, isClose }) => {
    const [content, setContent] = useState("");
    const [file, setFile] = useState(null);
    const { mutate: sendPublication } = useNewPublication();
    const fileTypes = [
        'image/jpeg', 'image/png','video/mp4' 
    ];

    const onSendPublication = () =>{
        sendPublication({ content, file }, {
            onSuccess: () => {
              message.success('Publicación creada');
              isClose();
            },
            onError: () => {
              message.error('Error al crear la publicación');
            }
          });
    }        

    return (
        <Modal  isOpen={isOpen} isClose={isClose} px="px-8" w="w-4/12">
            <h1 className="text-center font-bold text-xl text-emerald-900 mb-3 border-b-2 py-1 border-emerald-900">Nueva Publicación</h1>
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
                        Upload: {
                            colorPrimary: '#059669',
                        },
                    },
                }}
            >
                <Form 
                 className="grid grid-cols-1 xl:grid-cols-2"
                 onFinish={onSendPublication}
                >
                    <Form.Item
                        name="content"
                        className="xl:col-span-2"
                    >
                        <Input.TextArea onChange={(e) => setContent(e.target.value)} placeholder="¿Que quieres publicar?" className="min-w-44" maxLength={430}  autoSize={{ minRows: 7, maxRows: 7 }}/>
                    </Form.Item>
                    <Form.Item>
                    <Upload
                    listType="picture"
                    name="media"
                    maxCount={1}
                    beforeUpload={(file) => {
                        if (!fileTypes.includes(file.type)) {
                            message.error(`${file.name} no es un tipo de archivo soportado.`);
                            return Upload.LIST_IGNORE; 
                        }
                        setFile(file); 
                        return false; 
                    }}
                    headers={{
                        Authorization: `Bearer ${localStorage.getItem("jwt")}`
                    }}
                    onRemove={() => setFile(null)}
                    >
                        <Button icon={<UploadOutlined />}>Añade contenido</Button>
                    </Upload>
                    </Form.Item>
                    <div className="xl:col-span-2 border-t-2 border-slate-200 w-full my-4"></div>
                    <Button type="primary" htmlType="submit" className="bg-emerald-700 text-base flex justify-center items-center xl:col-start-2 disabled:bg-slate-200" disabled={!content && !file}>
                        Publicar
                    </Button>       
                </Form>

            </ConfigProvider>
        </Modal>
    );
}

export default NewPublicationModal;
import React from "react";
import Modal from "../Modal";
import UserSmallCard from "../UserSmallCard";
import { useGetFollowersFollowing } from "../../functions/ApiCalls/getFollowersAndFollowing";
import { Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { Empty } from "antd";

const FollowAndFollowingModal = ({isVisible, onClose}) => {
    const { data, isLoading } = useGetFollowersFollowing();

    if (isLoading) {
        return (
            <Modal isOpen={isVisible} isClose={onClose} w="w-2/5" >
                <div className="flex flex-col gap-4">
                    <h2 className="text-2xl text-emerald-900 font-bold pb-2 border-b-2 border-emerald-900/15">Seguidores y Siguiendo</h2>
                    <div className='flex justify-center items-center h-screen'>
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                    </div>
                </div>
            </Modal>
        );
    }

    return (
        <Modal isOpen={isVisible} isClose={onClose} w="w-2/5">
            <div className="flex flex-col gap-4">
                <h2 className="text-2xl text-emerald-900 font-bold pb-2 border-b-2 border-emerald-900/15">Seguidores y Siguiendo</h2>
                <div className="flex">
                    <div className="w-2/4 border-r-2 border-emerald-950/40">
                        <h2 className="text-xl text-center text-emerald-900 pb-2 border-b-2 border-emerald-900/15">Seguidores<span className="ml-2 font-medium">{data?.followers?.length || 0}</span></h2>
                        <div className="flex flex-col gap-3 pt-2">
                            {data?.followers?.length > 0 ? (
                                data.followers.map((user, index) => (
                                    <UserSmallCard key={index} idUser={user} />
                                ))
                            ) : (
                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                            )}
                        </div>
                    </div>
                    <div className="w-2/4">
                        <h2 className="text-xl text-center text-emerald-900 pb-2 border-b-2 border-emerald-900/15">Siguiendo<span className="ml-2 font-medium">{data?.following?.length || 0}</span></h2>
                        <div className="flex flex-col gap-3 pl-3 pt-2">
                            {data?.following?.length > 0 ? (
                                data.following.map((user, index) => (
                                    <UserSmallCard key={index} idUser={user} />
                                ))
                            ) : (
                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default FollowAndFollowingModal;

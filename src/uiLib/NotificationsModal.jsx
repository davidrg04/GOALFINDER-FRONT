import React, { useEffect, useState } from 'react';
function NotificationsModal() {
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        setShowModal(true);
    }, []);
    return (
        <div className={`fixed h-96 w-72 bg-emerald-600 shadow-emerald-700 shadow-lg top-16 right-72 rounded-2xl flex flex-col items-center transition-all duration-200 ease-out ${showModal ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} z-20`}>
            <h2 className="text-xl font-semibold text-emerald-50 mt-4">Notificaciones</h2>
        </div>
    );
}

export default NotificationsModal;
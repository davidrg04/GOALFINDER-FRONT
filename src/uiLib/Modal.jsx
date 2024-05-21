import React from "react";
const Modal = ( {h1, isOpen, isClose, h = 'h-auto', w = 'w-auto', p = 'p-4',minw = 'min-w-0', maxh = 'max-h-fit', py, px, children } ) => {
    
    const handleCloseModal = (event) => {
        if (event.target === event.currentTarget) {
            isClose();
        }
    };

    const paddingClasses = `${ py || p } ${ px || p }`;

    return (
        <div onClick={handleCloseModal} className={`fixed top-0 left-0 z-1000 flex w-full h-screen bg-emerald-950/40 justify-center items-center transition-opacity duration-300 ease-out ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} z-20`}>
            <div className={`transition-all duration-300 ease-out transform ${isOpen ? 'scale-100' : 'scale-95'} ${w} ${minw} ${h} ${maxh} bg-slate-100 flex flex-col rounded-2xl shadow-2xl shadow-emerald-950/50 ${paddingClasses} overflow-scroll`}>
                <div onClick={isClose} className="cursor-pointer absolute right-4 top-2 text-lg font-medium text-emerald-900">X</div>
                {h1 && <h1 className="text-2xl text-emerald-900 font-bold pb-2 border-b-2 border-emerald-900/15">
                    {h1}
                </h1>}
                {children}
            </div>
        </div>
    );
    }

export default Modal;
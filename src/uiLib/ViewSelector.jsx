import React from "react";

function ViewSelector({isActive, onClick, children}) {
    return(
        <div onClick={onClick} className={`w-fit border-2 border-emerald-600 rounded-2xl px-2 flex justify-center items-center ${isActive ? `bg-emerald-600` : `bg-emerald-50`} transition-colors duration-200 ease-in-out`}>
            <span className={`text-sm font-extrabold hover:cursor-pointer ${isActive ? `text-emerald-50`: `text-emerald-600`} transition-colors duration-300 ease-in-out`}>{children}</span>
        </div>
    )
}
export default ViewSelector;
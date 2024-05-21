import React from 'react';
import { Iconoir, IconoirProvider, PlusCircleSolid } from 'iconoir-react';

function NewPublication({children, w="w-52", bg="bg-emerald-50", fontSize="text-base", onClick}){
    return(
        <div onClick={onClick} className={`${w} py-1 px-2 flex justify-center items-center gap-2 border-2 border-emerald-600 rounded-xl hover:scale-105 hover:shadow-md shadow-emerald-900 transition-transform hover:cursor-pointer ${bg}`}>
            <IconoirProvider
                iconProps={{
                    color: '#059669'
                }}
            >
            <PlusCircleSolid/>
            </IconoirProvider>
            <span className={`${fontSize} font-semibold text-emerald-950`}>{children}</span>
        </div>
    )
}
export default NewPublication;
import React from "react";
import FollowCard from "../FollowCard";
const MaybeYouKnow = () =>{
    return(
        <div className="width360 bg-emerald-500 flex flex-col rounded-2xl py-3 shadow-emerald-900 shadow-2xl">
            <span className="text-xl font-bold text-emerald-50 mx-auto">Quizás Conozcas</span>
            <div className="mt-3 flex flex-col gap-2">
                <FollowCard name="Juan Perez" username="@juanperez"/>
                <FollowCard name="Maria Lopez" username="@marialopez"/>
                <FollowCard name="Pedro Ramirez" username="@pedroramirez"/>
            </div>
        </div>
    );
}

export default MaybeYouKnow;
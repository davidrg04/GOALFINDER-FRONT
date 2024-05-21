import React, {useState} from "react";
import LoginRegister from "../uiLib/LoginRegister";
const LoginView = () => {
    const [messageInfo, setMessageInfo] = useState({ message: "", type: "" });

    localStorage.removeItem("jwt");
    localStorage.removeItem("messageShown");

    return(
        <div className="w-full h-full">
            {messageInfo.message && (
                <div className={`alert ${messageInfo.type === "error" ? "alert-danger" : "alert-success"} shadow-xl shadow-emerald-900/10`}>
                    {messageInfo.message}
                </div>
            )}
            <LoginRegister onRegister={setMessageInfo}/>
        </div>
    );
}
export default LoginView;
import React from "react";
import { useRef } from "react";
import { useState, useEffect } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
const LoginRegister = ({ onRegister }) => {
    const [formValid, setFormValid] = useState(false);
    const [name, setName] = useState(false);
    const [surnames, setSurnames] = useState(false);
    const [username, setUsername] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [repeatPasswordError, setRepeatPasswordError] = useState(false);
    const navigate = useNavigate();

    const containerRef = useRef(null);

    const activeRegister = () => {
        containerRef.current.classList.add("active");
    };
    const activeLogin = () => {
        containerRef.current.classList.remove("active");
    };

    const [registerData, setRegisterData] = useState({
        name: "",
        surnames: "",
        username: "",
        email: "",
        password: "",
        repeatPassword: "",
        role: "player",
    });

    const [loginData, setLoginData] = useState({
        username: "",
        password: "",
    });

    useEffect(() => {
        const isFormValid = () => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
            const isEmailValid = emailRegex.test(registerData.email);
            const isPasswordValid = passwordRegex.test(registerData.password);
            const isRepeatPasswordValid = registerData.password === registerData.repeatPassword;
            const areFieldsFilled = Object.values(registerData).every(field => field.trim() !== "");

            return isEmailValid && isPasswordValid && isRepeatPasswordValid && areFieldsFilled;
        };

        setFormValid(isFormValid());
    }, [registerData]);

    const validateUsername = (username) => {
        const usernameRegex = /^[a-zA-Z0-9]{1,25}$/;
        if (username.trim() === "") {
            setUsername(true);
            message.error("Por favor, introduce un nombre de usuario.");
        } else if (!usernameRegex.test(username)) {
            setUsername(true);
            message.error("El nombre de usuario debe contener solo letras y números y no más de 25 caracteres.");
        } else {
            setUsername(false);
        }
    };

    const validateName = (name) => {
        const nameRegex = /^[a-zA-Z\s]{1,20}$/;
        if (name.trim() === "") {
            setName(true);
            message.error("Por favor, introduce tu nombre.");
        } else if (!nameRegex.test(name)) {
            setName(true);
            message.error("El nombre solo puede contener letras y no más de 20 caracteres.");
        } else {
            setName(false);
        }
    };

    const validateSurnames = (surnames) => {
        const surnamesRegex = /^[a-zA-Z\s]{1,40}$/;
        if (surnames.trim() === "") {
            setSurnames(true);
            message.error("Por favor, introduce tus apellidos.");
        } else if (!surnamesRegex.test(surnames)) {
            setSurnames(true);
            message.error("Los apellidos solo pueden contener letras y no más de 40 caracteres.");
        } else {
            setSurnames(false);
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError(true);
            message.error("Por favor, introduce un email válido.");
        } else {
            setEmailError(false);
        }
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
            setPasswordError(true);
            message.error("La contraseña debe tener al menos una mayúscula, una minúscula, un número y 8 carácteres.");
        } else {
            setPasswordError(false);
        }
    };

    const validateRepeatPassword = (repeatPassword) => {
        if (repeatPassword !== registerData.password) {
            setRepeatPasswordError(true);
            message.error("Las contraseñas no coinciden.");
        } else {
            setRepeatPasswordError(false);
        }
    };

    const registerChange = (e) => {
        const { name, value } = e.target;
        setRegisterData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const loginChange = (e) => {
        const { name, value } = e.target;
        setLoginData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const registerSubmit = (e) => {
        e.preventDefault();
        if (registerData.password === registerData.repeatPassword) {
            registerMutation.mutate(registerData);
        } else {
            message.error("Las contraseñas no coinciden");
        }
    };
    const registerMutation = useMutation(data => {
        return fetch("https://goalfinder-back-production.up.railway.app/API/ACCESS/register.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      }, {
        onSuccess: (response) => {
          if (response.status === 201) {
            response.json().then(data => {
              onRegister({ message: "Usuario registrado, ya puede iniciar sesión", type: "success" });
              setTimeout(() => onRegister({ message: "", type: "" }), 8000);
            });
          } else if (response.status === 409) {
            response.json().then(data => {
              const errorMessage = data.error === 'email' ? "El email ya está en uso." : "El nombre de usuario ya está en uso.";
              onRegister({ message: errorMessage, type: "error" });
              setTimeout(() => onRegister({ message: "", type: "" }), 8000);
              data.error === 'email' ? setEmailError(true) : setUsername(true);
            });
          }else{
            onRegister({ message: "Ha ocurrido un error, inténtelo de nuevo.", type: "error" });
            setTimeout(() => onRegister({ message: "", type: "" }), 8000);
          }
        }
      });
      
    
    const loginSubmit = (e) => {
        e.preventDefault();
        if (loginData.username.trim() === "" || loginData.password.trim() === ""){
            message.error("Por favor, rellene todos los campos");
        }else{
            loginMutation.mutate(loginData);
        }
    }; 
    
    
    
    const loginMutation = useMutation((data) => {
        return fetch("https://goalfinder-back-production.up.railway.app/var/www/html/API/ACCESS/login.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
    } , {
        onSuccess: (response) => {
            if (response.status === 200) {
                response.json().then(data => {
                    if (data && data.jwt) {
                        localStorage.setItem("jwt", data.jwt);
                        navigate("/");
                    }
                }).catch((error) => {
                    console.error("Error:", error);
                });
            } else {
                onRegister({ message: "Usuario o contraseña incorrectos", type: "error" });
                setTimeout(() => onRegister({ message: "", type: "" }), 8000);
            }
        }
    }
    );

    return(
        <div id="modalLogin" className="fixed top-0 left-0 w-full h-full z-10 overflow-hidden flex justify-center items-center fondoModal">
            <div className="container w-3/5 h-4/5 3xl:w-2/3" id="container" ref={containerRef}>
                <div className="form-container sign-up">
                    <form>
                        <h1 className="text-3xl font-semibold">Crea tu Cuenta</h1>
                        <div className="social-icons">
                            <a href="#" className="icon"><i className="fa-brands fa-google-plus-g"></i></a>
                            <a href="#" className="icon"><i className="fa-brands fa-facebook-f"></i></a>
                        </div>
                        <span>o usa tus datos para registrarte</span>
                        <input required maxLength={20} type="text" placeholder="Nombre" name="name" value={registerData.name} onBlur={() => validateName(registerData.name)} onChange={registerChange} style={{ backgroundColor: name ? "#FEE2E2" : "#eee" }}/>
                        <input required type="text" maxLength={50} placeholder="Apellidos" name="surnames" value={registerData.surnames} onBlur={() => validateSurnames(registerData.surnames)} onChange={registerChange} style={{ backgroundColor: surnames ? "#FEE2E2" : "#eee" }}/>
                        <input required type="text" placeholder="Nombre de usuario" name="username" value={registerData.username} onBlur={() => validateUsername(registerData.username)} onChange={registerChange} style={{ backgroundColor: username ? "#FEE2E2" : "#eee" }}/>
                        <input required type="email" placeholder="Email" name="email" value={registerData.email} onChange={registerChange} onBlur={() => validateEmail(registerData.email)} style={{ backgroundColor: emailError ? "#FEE2E2" : "#eee" }}/>
                        <input required type="password" placeholder="Contraseña" name="password" value={registerData.password} onChange={registerChange} onBlur={() => validatePassword(registerData.password)} style={{ backgroundColor: passwordError ? "#FEE2E2" : "#eee" }}/>
                        <input required type="password" placeholder="Repita la contraseña" name="repeatPassword" value={registerData.repeatPassword} onChange={registerChange} onBlur={() => validateRepeatPassword(registerData.repeatPassword)} style={{ backgroundColor: repeatPasswordError ? "#FEE2E2" : "#eee" }}/>
                        <div>
                            <span>Selecciona tu perfil</span>
                            <div className="flex items-center gap-2">
                                <label htmlFor="jugador">Jugador</label>
                                <input type="radio" name="role" value="player" onChange={registerChange} checked/>
                                <label htmlFor="club">Ojeador</label>
                                <input type="radio" name="role" value="club" onChange={registerChange} />
                            </div>
                        </div>
                        
                        <button onClick={registerSubmit} disabled={!formValid} className="disabled:bg-slate-300">REGISTRARSE</button>
                    </form>
                </div>
                <div className="form-container sign-in">
                    <form>
                        <h1 className="text-3xl font-semibold">Inicia Sesión</h1>
                        <div className="social-icons">
                            <a href="#" className="icon"><i className="fa-brands fa-google-plus-g"></i></a>
                            <a href="#" className="icon"><i className="fa-brands fa-facebook-f"></i></a>
                        </div>
                        <span>o usa tu usuario y contraseña</span>
                        <input type="text" placeholder="Username" name="username" value={loginData.username} onChange={loginChange} required/>
                        <input type="password" placeholder="Password" name="password" value={loginData.password} onChange={loginChange} required/>
                        <button onClick={loginSubmit}>Iniciar Sesión</button>
                    </form>
                </div>
                <div className="toggle-container">
                    <div className="toggle">
                        <div className="toggle-panel toggle-left">
                            <h1 className="font-semibold text-4xl">¡Bienvenido de nuevo!</h1>
                            <p className="font-semibold">Inicia sesión con tus datos para acceder a tu cuenta.</p>
                            <button onClick={activeLogin} className="escondido" id="login">Iniciar Sesión</button>
                        </div>
                        <div className="toggle-panel toggle-right">
                            <h1 className="font-semibold text-4xl">Hola ¿eres nuevo?</h1>
                            <p className="font-semibold">Haz click aquí y registrate en nuestra web para no perderte nada.</p>
                            <button onClick={activeRegister} className="escondido" id="register">Registrarse</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginRegister;

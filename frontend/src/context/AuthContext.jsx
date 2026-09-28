import { createContext, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {


    // ==========================================
    // TOKEN
    // ==========================================

    const [token, setToken] = useState(
        localStorage.getItem("token")
    );


    // ==========================================
    // USUARIO
    // ==========================================

    const [user, setUser] = useState(() => {

        const storedUser = localStorage.getItem("user");


        if (!storedUser || storedUser === "undefined") {
            return null;
        }


        try {

            return JSON.parse(storedUser);

        } catch (error) {

            console.error(
                "Error al leer el usuario guardado:",
                error
            );

            localStorage.removeItem("user");

            return null;

        }

    });


    // ==========================================
    // LOGIN
    // ==========================================

    const login = async (email, password) => {

        const response = await api.post(
            "/auth/login",
            {
                email,
                password
            }
        );


        const newToken = response.data.token;
        const loggedUser = response.data.user;


        // Guardar token

        localStorage.setItem(
            "token",
            newToken
        );


        // Guardar usuario

        localStorage.setItem(
            "user",
            JSON.stringify(loggedUser)
        );


        // Actualizar estado

        setToken(newToken);
        setUser(loggedUser);


        return response.data;
    };


    // ==========================================
    // LOGOUT
    // ==========================================

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");


        setToken(null);
        setUser(null);

    };


    // ==========================================
    // AUTENTICACIÓN
    // ==========================================

    const isAuthenticated = !!token;


    // ==========================================
    // PROVIDER
    // ==========================================

    return (

        <AuthContext.Provider
            value={{
                token,
                user,
                login,
                logout,
                isAuthenticated
            }}
        >

            {children}

        </AuthContext.Provider>

    );

};


// ==========================================
// HOOK
// ==========================================

export const useAuth = () => {

    return useContext(AuthContext);

};
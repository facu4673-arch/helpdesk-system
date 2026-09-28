import api from "./api";


// Obtener todos los usuarios
export const getUsers = async () => {
    const response = await api.get("/users");
    return response.data;
};


// Crear usuario desde administrador
export const createUser = async (userData) => {
    const response = await api.post(
        "/users",
        userData
    );

    return response.data;
};
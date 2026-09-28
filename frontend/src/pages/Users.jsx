import { useEffect, useState } from "react";

import DashboardLayout from "../components/DashboardLayout";

import { getUsers } from "../services/userService";

function Users() {

    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getUsers();

            setUsers(data);

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "No se pudieron cargar los usuarios."
            );

        } finally {

            setLoading(false);

        }
    };

    const roleLabels = {
        admin: "Administrador",
        support: "Soporte",
        user: "Usuario"
    };

    return (
        <DashboardLayout>

            <div className="mb-8">

                <h1 className="text-3xl font-bold text-gray-800">
                    Usuarios
                </h1>

                <p className="text-gray-500 mt-2">
                    Gestión de usuarios registrados en el sistema.
                </p>

            </div>

            {error && (
                <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg px-4 py-3 mb-6">
                    {error}
                </div>
            )}

            {loading ? (

                <div className="bg-white rounded-xl border p-8 text-center">

                    <p className="text-gray-500">
                        Cargando usuarios...
                    </p>

                </div>

            ) : (

                <div className="bg-white rounded-xl border overflow-hidden">

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-gray-50 border-b">

                                <tr>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        #
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Nombre
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Email
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Rol
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Fecha de registro
                                    </th>

                                </tr>

                            </thead>

                            <tbody className="divide-y">

                                {users.map((user) => (

                                    <tr
                                        key={user.id}
                                        className="hover:bg-gray-50"
                                    >

                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            #{user.id}
                                        </td>

                                        <td className="px-6 py-4 font-semibold text-gray-800">
                                            {user.name}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {user.email}
                                        </td>

                                        <td className="px-6 py-4">

                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                                    user.role === "admin"
                                                        ? "bg-purple-100 text-purple-700"
                                                        : user.role === "support"
                                                            ? "bg-blue-100 text-blue-700"
                                                            : "bg-gray-100 text-gray-700"
                                                }`}
                                            >
                                                {roleLabels[user.role] ||
                                                    user.role}
                                            </span>

                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {user.created_at
                                                ? new Date(
                                                    user.created_at
                                                ).toLocaleDateString()
                                                : "-"}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

            )}

        </DashboardLayout>
    );
}

export default Users;
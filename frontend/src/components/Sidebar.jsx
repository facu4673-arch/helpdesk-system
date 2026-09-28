    import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
    const { user } = useAuth();
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    const linkClass = (path) => {
        return `
            flex items-center px-4 py-3 rounded-lg transition
            ${
                isActive(path)
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
            }
        `;
    };

    return (
        <aside className="w-64 bg-white border-r min-h-screen">

            <div className="p-6 border-b">

                <h1 className="text-2xl font-bold text-blue-600">
                    HelpDesk
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                    Panel de soporte
                </p>

            </div>

            <div className="p-4">

                <div className="bg-gray-50 rounded-xl p-4 mb-6">

                    <p className="text-sm text-gray-500">
                        Usuario
                    </p>

                    <p className="font-semibold text-gray-800 mt-1">
                        {user?.name}
                    </p>

                    <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                        {user?.role?.toUpperCase()}
                    </span>

                </div>

                <nav className="space-y-2">

                    <Link
                        to="/dashboard"
                        className={linkClass("/dashboard")}
                    >
                        🏠 Dashboard
                    </Link>

                    {user?.role === "user" && (
                        <>
                            <Link
                                to="/tickets"
                                className={linkClass("/tickets")}
                            >
                                🎫 Mis tickets
                            </Link>

                            <Link
                                to="/tickets/create"
                                className={linkClass("/tickets/create")}
                            >
                                ➕ Crear ticket
                            </Link>
                        </>
                    )}

                    {user?.role === "support" && (
                        <>
                            <Link
                                to="/tickets"
                                className={linkClass("/tickets")}
                            >
                                🎫 Tickets
                            </Link>

                            <Link
                                to="/tickets/pending"
                                className={linkClass("/tickets/pending")}
                            >
                                ⏳ Pendientes
                            </Link>
                        </>
                    )}

                    {user?.role === "admin" && (
                        <>
                            <Link
                                to="/tickets"
                                className={linkClass("/tickets")}
                            >
                                🎫 Todos los tickets
                            </Link>

                            <Link
                                to="/tickets/assign"
                                className={linkClass("/tickets/assign")}
                            >
                                👤 Asignar tickets
                            </Link>

                            <Link
                                to="/users"
                                className={linkClass("/users")}
                            >
                                👥 Usuarios
                            </Link>

                            <Link
                                to="/statistics"
                                className={linkClass("/statistics")}
                            >
                                📊 Estadísticas
                            </Link>
                        </>
                    )}

                </nav>

            </div>

        </aside>
    );
}

export default Sidebar;
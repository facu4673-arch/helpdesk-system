import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";

function DashboardLayout({ children }) {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-100 flex">

            <Sidebar />

            <div className="flex-1">

                <header className="bg-white border-b px-8 py-4 flex justify-between items-center">

                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            Panel de control
                        </h2>

                        <p className="text-sm text-gray-500">
                            Gestión de tickets de soporte
                        </p>
                    </div>

                    <div className="flex items-center gap-4">

                        <div className="text-right">

                            <p className="text-sm font-semibold text-gray-800">
                                {user?.name}
                            </p>

                            <p className="text-xs text-gray-500">
                                {user?.email}
                            </p>

                        </div>

                        <button
                            onClick={logout}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                        >
                            Cerrar sesión
                        </button>

                    </div>

                </header>

                <main className="p-8">
                    {children}
                </main>

            </div>

        </div>
    );
}

export default DashboardLayout;
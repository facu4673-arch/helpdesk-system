import { useAuth } from "../context/AuthContext";

function Dashboard() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-100">

            <header className="bg-white shadow-sm">

                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

                    <div>
                        <h1 className="text-2xl font-bold text-blue-600">
                            HelpDesk
                        </h1>

                        <p className="text-sm text-gray-500">
                            Panel principal
                        </p>
                    </div>

                    <button
                        onClick={logout}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                        Cerrar sesión
                    </button>

                </div>

            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">

                <div className="bg-white rounded-2xl shadow p-8">

                    <h2 className="text-2xl font-bold text-gray-800">
                        Bienvenido, {user?.name || "usuario"} 👋
                    </h2>

                    <p className="text-gray-600 mt-2">
                        Has iniciado sesión correctamente.
                    </p>

                    <div className="mt-6 grid md:grid-cols-3 gap-4">

                        <div className="bg-blue-50 rounded-xl p-5">
                            <p className="text-sm text-gray-500">
                                Nombre
                            </p>

                            <p className="font-semibold text-gray-800 mt-1">
                                {user?.name}
                            </p>
                        </div>

                        <div className="bg-blue-50 rounded-xl p-5">
                            <p className="text-sm text-gray-500">
                                Email
                            </p>

                            <p className="font-semibold text-gray-800 mt-1">
                                {user?.email}
                            </p>
                        </div>

                        <div className="bg-blue-50 rounded-xl p-5">
                            <p className="text-sm text-gray-500">
                                Rol
                            </p>

                            <p className="font-semibold text-gray-800 mt-1 uppercase">
                                {user?.role}
                            </p>
                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default Dashboard;
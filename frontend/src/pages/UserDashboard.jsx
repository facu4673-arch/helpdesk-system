import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatCard";

function UserDashboard() {
    const { user } = useAuth();

    return (
        <DashboardLayout>

            <div className="mb-8">

                <h1 className="text-3xl font-bold text-gray-800">
                    Hola, {user?.name} 👋
                </h1>

                <p className="text-gray-500 mt-2">
                    Desde acá podés gestionar tus solicitudes de soporte.
                </p>

            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">

                <StatCard
                    title="Mis tickets"
                    value="--"
                    description="Tickets registrados"
                    icon="🎫"
                />

                <StatCard
                    title="En proceso"
                    value="--"
                    description="Tickets siendo atendidos"
                    icon="🔧"
                />

                <StatCard
                    title="Resueltos"
                    value="--"
                    description="Tickets solucionados"
                    icon="✅"
                />

            </div>

            <div className="grid md:grid-cols-2 gap-6">

                <Link
                    to="/tickets"
                    className="bg-white rounded-xl border p-6 hover:shadow-md transition"
                >
                    <div className="text-3xl mb-3">
                        🎫
                    </div>

                    <h2 className="text-xl font-semibold text-gray-800">
                        Mis tickets
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Consultá el estado de tus solicitudes de soporte.
                    </p>
                </Link>

                <Link
                    to="/tickets/create"
                    className="bg-blue-600 text-white rounded-xl p-6 hover:bg-blue-700 transition"
                >
                    <div className="text-3xl mb-3">
                        ➕
                    </div>

                    <h2 className="text-xl font-semibold">
                        Crear un ticket
                    </h2>

                    <p className="text-blue-100 mt-2">
                        Reportá un nuevo problema al equipo de soporte.
                    </p>
                </Link>

            </div>

        </DashboardLayout>
    );
}

export default UserDashboard;
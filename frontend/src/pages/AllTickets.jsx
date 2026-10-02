import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { getAllTickets } from "../services/ticketService";

const statusLabels = {
    ABIERTO: "Abierto",
    EN_PROCESO: "En proceso",
    ESPERANDO_USUARIO: "Esperando usuario",
    RESUELTO: "Resuelto",
    CERRADO: "Cerrado"
};

const priorityLabels = {
    BAJA: "Baja",
    MEDIA: "Media",
    ALTA: "Alta",
    CRITICA: "Crítica"
};

function StatusBadge({ status }) {
    const styles = {
        ABIERTO: "bg-blue-100 text-blue-700",
        EN_PROCESO: "bg-yellow-100 text-yellow-700",
        ESPERANDO_USUARIO: "bg-orange-100 text-orange-700",
        RESUELTO: "bg-green-100 text-green-700",
        CERRADO: "bg-gray-200 text-gray-700"
    };

    return (
        <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                styles[status] || "bg-gray-100 text-gray-700"
            }`}
        >
            {statusLabels[status] || status}
        </span>
    );
}

function PriorityBadge({ priority }) {
    const styles = {
        BAJA: "bg-gray-100 text-gray-700",
        MEDIA: "bg-blue-100 text-blue-700",
        ALTA: "bg-orange-100 text-orange-700",
        CRITICA: "bg-red-100 text-red-700"
    };

    return (
        <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                styles[priority] || "bg-gray-100 text-gray-700"
            }`}
        >
            {priorityLabels[priority] || priority}
        </span>
    );
}

function AllTickets() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadTickets = async () => {
            try {
                const data = await getAllTickets();
                setTickets(data.tickets);
            } catch (error) {
                console.error("Error al cargar tickets:", error);

                setError(
                    error.response?.data?.message ||
                    "No se pudieron cargar los tickets"
                );
            } finally {
                setLoading(false);
            }
        };

        loadTickets();
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-6">

                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Tickets
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Gestión y seguimiento de tickets
                    </p>
                </div>

                {loading && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <p className="text-gray-500">
                            Cargando tickets...
                        </p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
                        {error}
                    </div>
                )}

                {!loading && !error && tickets.length === 0 && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <p className="text-gray-500">
                            No hay tickets disponibles.
                        </p>
                    </div>
                )}

                {!loading && !error && tickets.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">

                        <div className="overflow-x-auto">
                            <table className="w-full">

                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                            ID
                                        </th>

                                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                            Título
                                        </th>

                                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                            Usuario
                                        </th>

                                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                            Prioridad
                                        </th>

                                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                            Estado
                                        </th>

                                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                            Soporte
                                        </th>

                                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                            Acción
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y">

                                    {tickets.map((ticket) => (
                                        <tr
                                            key={ticket.id}
                                            className="hover:bg-gray-50"
                                        >

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                #{ticket.id}
                                            </td>

                                            <td className="px-6 py-4">
                                                <p className="font-medium text-gray-800">
                                                    {ticket.title}
                                                </p>

                                                {ticket.category && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {ticket.category.name}
                                                    </p>
                                                )}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {ticket.creator?.name || "Sin usuario"}
                                            </td>

                                            <td className="px-6 py-4">
                                                <PriorityBadge
                                                    priority={ticket.priority}
                                                />
                                            </td>

                                            <td className="px-6 py-4">
                                                <StatusBadge
                                                    status={ticket.status}
                                                />
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {ticket.assignedSupport?.name ||
                                                    "Sin asignar"}
                                            </td>

                                            <td className="px-6 py-4">
                                                <Link
                                                    to={`/tickets/${ticket.id}`}
                                                    className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                                                >
                                                    Ver ticket
                                                </Link>
                                            </td>

                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        </div>

                    </div>
                )}

            </div>
        </DashboardLayout>
    );
}

export default AllTickets;
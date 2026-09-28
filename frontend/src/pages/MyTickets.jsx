import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../components/DashboardLayout";
import StatusBadge from "../components/StatusBadge";
import PriorityBadge from "../components/PriorityBadge";

import { getMyTickets } from "../services/ticketService";

function MyTickets() {

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadTickets();
    }, []);

    const loadTickets = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getMyTickets();

            setTickets(data);
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "No se pudieron cargar los tickets."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Mis tickets
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Consultá las solicitudes que creaste.
                    </p>
                </div>

                <Link
                    to="/tickets/create"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold transition"
                >
                    + Crear ticket
                </Link>

            </div>

            {loading && (
                <div className="bg-white rounded-xl border p-8 text-center">
                    <p className="text-gray-500">
                        Cargando tickets...
                    </p>
                </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg px-4 py-3 mb-6">
                    {error}
                </div>
            )}

            {!loading && !error && tickets.length === 0 && (
                <div className="bg-white rounded-xl border p-10 text-center">

                    <div className="text-5xl mb-4">
                        🎫
                    </div>

                    <h2 className="text-xl font-semibold text-gray-800">
                        No tenés tickets todavía
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Cuando crees una solicitud aparecerá acá.
                    </p>

                </div>
            )}

            {!loading && !error && tickets.length > 0 && (

                <div className="bg-white rounded-xl border overflow-hidden">

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-gray-50 border-b">

                                <tr>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        #
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Título
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Prioridad
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Estado
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Fecha
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

                                            <Link
                                                to={`/tickets/${ticket.id}`}
                                                className="block"
                                            >

                                                <p className="font-semibold text-blue-600 hover:text-blue-800">
                                                    {ticket.title}
                                                </p>

                                                <p className="text-sm text-gray-500 mt-1">
                                                    {ticket.description}
                                                </p>

                                            </Link>

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

                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {ticket.created_at
                                                ? new Date(
                                                    ticket.created_at
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

export default MyTickets;
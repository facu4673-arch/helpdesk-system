import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../components/DashboardLayout";
import StatusBadge from "../components/StatusBadge";
import PriorityBadge from "../components/PriorityBadge";

import {
    getAllTickets,
    assignTicket
} from "../services/ticketService";

import { getUsers } from "../services/userService";

function AssignTickets() {

    const [tickets, setTickets] = useState([]);
    const [supportUsers, setSupportUsers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [assigningTicket, setAssigningTicket] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {

        try {

            setLoading(true);
            setError("");

            const [
                ticketsData,
                usersData
            ] = await Promise.all([
                getAllTickets(),
                getUsers()
            ]);

            setTickets(ticketsData);

            const supports = usersData.filter(
                (user) => user.role === "support"
            );

            setSupportUsers(supports);

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "No se pudieron cargar los datos."
            );

        } finally {

            setLoading(false);

        }
    };

    const handleAssign = async (ticketId, supportId) => {

        if (!supportId) {
            return;
        }

        try {

            setAssigningTicket(ticketId);
            setError("");

            await assignTicket(
                ticketId,
                Number(supportId)
            );

            await loadData();

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "No se pudo asignar el ticket."
            );

        } finally {

            setAssigningTicket(null);

        }
    };

    return (
        <DashboardLayout>

            <div className="mb-8">

                <h1 className="text-3xl font-bold text-gray-800">
                    Asignar tickets
                </h1>

                <p className="text-gray-500 mt-2">
                    Asigná tickets a los integrantes del equipo de soporte.
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
                        Cargando tickets...
                    </p>
                </div>

            ) : tickets.length === 0 ? (

                <div className="bg-white rounded-xl border p-10 text-center">

                    <div className="text-5xl mb-4">
                        🎫
                    </div>

                    <h2 className="text-xl font-semibold text-gray-800">
                        No hay tickets
                    </h2>

                    <p className="text-gray-500 mt-2">
                        No existen tickets para asignar.
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
                                        Ticket
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Prioridad
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Estado
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Soporte asignado
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

                                        <td className="px-6 py-4">

                                            <select
                                                value={
                                                    ticket.assigned_to || ""
                                                }
                                                onChange={(e) =>
                                                    handleAssign(
                                                        ticket.id,
                                                        e.target.value
                                                    )
                                                }
                                                disabled={
                                                    assigningTicket === ticket.id
                                                }
                                                className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                            >

                                                <option value="">
                                                    Sin asignar
                                                </option>

                                                {supportUsers.map(
                                                    (support) => (

                                                        <option
                                                            key={support.id}
                                                            value={support.id}
                                                        >
                                                            {support.name}
                                                        </option>

                                                    )
                                                )}

                                            </select>

                                            {assigningTicket === ticket.id && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Guardando...
                                                </p>
                                            )}

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

export default AssignTickets;
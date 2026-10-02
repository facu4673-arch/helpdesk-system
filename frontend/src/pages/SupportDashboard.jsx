import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../components/DashboardLayout";
import StatusBadge from "../components/StatusBadge";
import PriorityBadge from "../components/PriorityBadge";

import {
    getAllTickets,
    getTicketStats
} from "../services/ticketService";

import { useAuth } from "../context/AuthContext";

function SupportDashboard() {

    const { user } = useAuth();

    const [tickets, setTickets] = useState([]);
    const [stats, setStats] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {

        try {

            setLoading(true);
            setError("");

            const [
                ticketsData,
                statsData
            ] = await Promise.all([
                getAllTickets(),
                getTicketStats()
            ]);

            setTickets(ticketsData.tickets);
            setStats(statsData);

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "No se pudo cargar el panel de soporte."
            );

        } finally {

            setLoading(false);

        }
    };

    const assignedTickets = tickets.filter(
        (ticket) =>
            ticket.assigned_to === user?.id
    );

    const unassignedTickets = tickets.filter(
        (ticket) =>
            ticket.assigned_to === null
    );

    return (
        <DashboardLayout>

            {/* Encabezado */}

            <div className="mb-8">

                <h1 className="text-3xl font-bold text-gray-800">
                    Panel de soporte
                </h1>

                <p className="text-gray-500 mt-2">
                    Bienvenido, {user?.name}. Gestioná los tickets asignados.
                </p>

            </div>

            {/* Error */}

            {error && (

                <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg px-4 py-3 mb-6">
                    {error}
                </div>

            )}

            {/* Estadísticas */}

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mb-8">

    {/* Total */}

    <div className="bg-white rounded-xl border shadow-sm p-5 hover:shadow-md transition">

    <div className="flex items-center justify-between">

        <div>

            <p className="text-sm text-gray-500">
                Total tickets
            </p>

            <p className="text-3xl font-bold text-gray-800 mt-2">
                {stats?.total ?? 0}
            </p>

        </div>

        <div className="w-11 h-11 rounded-lg bg-gray-100 flex items-center justify-center text-xl">
            🎫
        </div>

        </div>

    </div>

    {/* Abiertos */}

    <div className="bg-white rounded-xl border shadow-sm p-5 hover:shadow-md transition">

        <div className="flex items-center justify-between">

            <div>

                <p className="text-sm text-gray-500">
                    Abiertos
                </p>

                <p className="text-3xl font-bold text-blue-600 mt-2">
                    {stats?.abiertos ?? 0}
                </p>

            </div>

            <div className="w-11 h-11 rounded-lg bg-blue-100 flex items-center justify-center text-xl">
                📂
            </div>

        </div>

    </div>


    {/* En proceso */}

    <div className="bg-white rounded-xl border shadow-sm p-5 hover:shadow-md transition">

        <div className="flex items-center justify-between">

            <div>

                <p className="text-sm text-gray-500">
                    En proceso
                </p>

                <p className="text-3xl font-bold text-yellow-600 mt-2">
                    {stats?.en_proceso ?? 0}
                </p>

            </div>

            <div className="w-11 h-11 rounded-lg bg-yellow-100 flex items-center justify-center text-xl">
                ⚙️
            </div>

        </div>

    </div>


    {/* Esperando usuario */}

    <div className="bg-white rounded-xl border shadow-sm p-5 hover:shadow-md transition">

        <div className="flex items-center justify-between">

            <div>

                <p className="text-sm text-gray-500">
                    Esperando usuario
                </p>

                <p className="text-3xl font-bold text-orange-600 mt-2">
                    {stats?.esperando_usuario ?? 0}
                </p>

            </div>

            <div className="w-11 h-11 rounded-lg bg-orange-100 flex items-center justify-center text-xl">
                ⏳
            </div>

        </div>

    </div>


    {/* Resueltos */}

    <div className="bg-white rounded-xl border shadow-sm p-5 hover:shadow-md transition">

        <div className="flex items-center justify-between">

            <div>

                <p className="text-sm text-gray-500">
                    Resueltos
                </p>

                <p className="text-3xl font-bold text-green-600 mt-2">
                    {stats?.resueltos ?? 0}
                </p>

            </div>

            <div className="w-11 h-11 rounded-lg bg-green-100 flex items-center justify-center text-xl">
                ✅
            </div>

        </div>

    </div>


    {/* Cerrados */}

    <div className="bg-white rounded-xl border shadow-sm p-5 hover:shadow-md transition">

        <div className="flex items-center justify-between">

            <div>

                <p className="text-sm text-gray-500">
                    Cerrados
                </p>

                <p className="text-3xl font-bold text-gray-600 mt-2">
                    {stats?.cerrados ?? 0}
                </p>

            </div>

            <div className="w-11 h-11 rounded-lg bg-gray-100 flex items-center justify-center text-xl">
                🔒
            </div>

        </div>

    </div>

</div>

            {/* Cargando */}

            {loading && (

                <div className="bg-white rounded-xl border p-8 text-center">

                    <p className="text-gray-500">
                        Cargando tickets...
                    </p>

                </div>

            )}

            {!loading && (

                <div className="space-y-8">

                    {/* Mis tickets */}

                    <section>

                        <div className="flex items-center justify-between mb-4">

                            <div>

                                <h2 className="text-xl font-bold text-gray-800">
                                    Mis tickets asignados
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Tickets que requieren tu atención.
                                </p>

                            </div>

                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                                {assignedTickets.length}
                            </span>

                        </div>

                        {assignedTickets.length === 0 ? (

                            <div className="bg-white rounded-xl border p-8 text-center">

                                <div className="text-4xl mb-3">
                                    🎉
                                </div>

                                <p className="text-gray-600">
                                    No tenés tickets asignados.
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
                                                    Acción
                                                </th>

                                            </tr>

                                        </thead>

                                        <tbody className="divide-y">

                                            {assignedTickets.map(
                                                (ticket) => (

                                                    <tr
                                                        key={ticket.id}
                                                        className="hover:bg-gray-50"
                                                    >

                                                        <td className="px-6 py-4 text-sm text-gray-600">
                                                            #{ticket.id}
                                                        </td>

                                                        <td className="px-6 py-4">

                                                            <p className="font-semibold text-gray-800">
                                                                {ticket.title}
                                                            </p>

                                                            <p className="text-sm text-gray-500 mt-1">
                                                                {ticket.description}
                                                            </p>

                                                        </td>

                                                        <td className="px-6 py-4">

                                                            <PriorityBadge
                                                                priority={
                                                                    ticket.priority
                                                                }
                                                            />

                                                        </td>

                                                        <td className="px-6 py-4">

                                                            <StatusBadge
                                                                status={
                                                                    ticket.status
                                                                }
                                                            />

                                                        </td>

                                                        <td className="px-6 py-4">

                                                            <Link
                                                                to={`/tickets/${ticket.id}`}
                                                                className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                                                            >
                                                                Ver ticket →
                                                            </Link>

                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            </div>

                        )}

                    </section>

                    {/* Tickets sin asignar */}

                    <section>

                        <div className="mb-4">

                            <h2 className="text-xl font-bold text-gray-800">
                                Tickets sin asignar
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Tickets que todavía no fueron asignados por un administrador.
                            </p>

                        </div>

                        {unassignedTickets.length === 0 ? (

                            <div className="bg-white rounded-xl border p-6">

                                <p className="text-gray-500">
                                    No hay tickets sin asignar.
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
                                                    Acción
                                                </th>

                                            </tr>

                                        </thead>

                                        <tbody className="divide-y">

                                            {unassignedTickets.map(
                                                (ticket) => (

                                                    <tr
                                                        key={ticket.id}
                                                        className="hover:bg-gray-50"
                                                    >

                                                        <td className="px-6 py-4 text-sm text-gray-600">
                                                            #{ticket.id}
                                                        </td>

                                                        <td className="px-6 py-4">

                                                            <p className="font-semibold text-gray-800">
                                                                {ticket.title}
                                                            </p>

                                                            <p className="text-sm text-gray-500 mt-1">
                                                                {ticket.description}
                                                            </p>

                                                        </td>

                                                        <td className="px-6 py-4">

                                                            <PriorityBadge
                                                                priority={
                                                                    ticket.priority
                                                                }
                                                            />

                                                        </td>

                                                        <td className="px-6 py-4">

                                                            <StatusBadge
                                                                status={
                                                                    ticket.status
                                                                }
                                                            />

                                                        </td>

                                                        <td className="px-6 py-4">

                                                            <Link
                                                                to={`/tickets/${ticket.id}`}
                                                                className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                                                            >
                                                                Ver ticket →
                                                            </Link>

                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            </div>

                        )}

                    </section>

                </div>

            )}

        </DashboardLayout>
    );
}

export default SupportDashboard;
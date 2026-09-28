import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../components/DashboardLayout";
import StatusBadge from "../components/StatusBadge";
import PriorityBadge from "../components/PriorityBadge";

import {
    getAllTickets,
    getTicketStats,
    assignTicket
} from "../services/ticketService";

import {
    getUsers,
    createUser
} from "../services/userService";


function AdminDashboard() {

    const [tickets, setTickets] = useState([]);
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ==========================================
    // FILTROS DE TICKETS
    // ==========================================

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [supportFilter, setSupportFilter] = useState("all");

    // ==========================================
    // PAGINACIÓN
    // ==========================================

    const [currentPage, setCurrentPage] = useState(1);

    const ticketsPerPage = 10;


    // ==========================================
    // ASIGNACIÓN DE TICKETS
    // ==========================================

    const [selectedSupport, setSelectedSupport] = useState({});
    const [assigningTicket, setAssigningTicket] = useState(null);

    const [assignSuccess, setAssignSuccess] = useState("");
    const [assignError, setAssignError] = useState("");


    // ==========================================
    // CREACIÓN DE USUARIOS
    // ==========================================

    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        password: "",
        role: "user"
    });

    const [creatingUser, setCreatingUser] = useState(false);

    const [userSuccess, setUserSuccess] = useState("");
    const [userError, setUserError] = useState("");


    // ==========================================
    // CARGAR DASHBOARD
    // ==========================================

    useEffect(() => {
        loadDashboard();
    }, []);


    const loadDashboard = async () => {

        try {

            setLoading(true);
            setError("");

            const [
                ticketsData,
                statsData,
                usersData
            ] = await Promise.all([
                getAllTickets(),
                getTicketStats(),
                getUsers()
            ]);

            setTickets(ticketsData);
            setStats(statsData);
            setUsers(usersData);

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "No se pudo cargar el panel de administración."
            );

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // USUARIOS SUPPORT
    // ==========================================

    const supportUsers = users.filter(
        (user) => user.role === "support"
    );

    // ==========================================
    // REINICIAR PAGINACIÓN AL FILTRAR
    // ==========================================

    useEffect(() => {
        setCurrentPage(1);
    }, [
        searchTerm,
        statusFilter,
        priorityFilter,
        supportFilter
    ]);

    // ==========================================
    // TICKETS FILTRADOS
    // ==========================================

    const filteredTickets = tickets.filter((ticket) => {

        const search = searchTerm.toLowerCase().trim();

        const matchesSearch =
            !search ||
            ticket.title?.toLowerCase().includes(search) ||
            ticket.description?.toLowerCase().includes(search);

        const matchesStatus =
            statusFilter === "all" ||
            ticket.status === statusFilter;

        const matchesPriority =
            priorityFilter === "all" ||
            ticket.priority === priorityFilter;

        const matchesSupport =
            supportFilter === "all" ||
            String(ticket.assigned_to) === String(supportFilter);

        return (
            matchesSearch &&
            matchesStatus &&
            matchesPriority &&
            matchesSupport
        );
    });

    // ==========================================
    // DATOS DE PAGINACIÓN
    // ==========================================

    const totalPages = Math.ceil(
        filteredTickets.length / ticketsPerPage
    );

    const startIndex = (currentPage - 1) * ticketsPerPage;

    const paginatedTickets = filteredTickets.slice(
        startIndex,
        startIndex + ticketsPerPage
    );

    // ==========================================
    // SELECCIONAR SOPORTE
    // ==========================================

    const handleSupportChange = (ticketId, supportId) => {

        setSelectedSupport((previous) => ({
            ...previous,
            [ticketId]: supportId
        }));

        setAssignSuccess("");
        setAssignError("");
    };


    // ==========================================
    // ASIGNAR TICKET
    // ==========================================

    const handleAssignTicket = async (ticketId) => {

        const supportId = selectedSupport[ticketId];

        if (!supportId) {

            setAssignError(
                "Seleccioná un usuario de soporte antes de asignar el ticket."
            );

            setAssignSuccess("");

            return;
        }

        try {

            setAssigningTicket(ticketId);
            setAssignError("");
            setAssignSuccess("");

            await assignTicket(
                ticketId,
                Number(supportId)
            );

            setAssignSuccess(
                `El ticket #${ticketId} fue asignado correctamente.`
            );


            // Recargar tickets y estadísticas

            const [
                ticketsData,
                statsData
            ] = await Promise.all([
                getAllTickets(),
                getTicketStats()
            ]);

            setTickets(ticketsData);
            setStats(statsData);


            // Limpiar selección

            setSelectedSupport((previous) => ({
                ...previous,
                [ticketId]: ""
            }));

        } catch (error) {

            console.error(error);

            setAssignError(
                error.response?.data?.message ||
                "No se pudo asignar el ticket."
            );

        } finally {

            setAssigningTicket(null);

        }
    };


    // ==========================================
    // CAMBIAR DATOS DEL NUEVO USUARIO
    // ==========================================

    const handleUserChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setNewUser((previous) => ({
            ...previous,
            [name]: value
        }));

        setUserSuccess("");
        setUserError("");
    };


    // ==========================================
    // CREAR USUARIO
    // ==========================================

    const handleCreateUser = async (event) => {

        event.preventDefault();

        setUserSuccess("");
        setUserError("");


        // Validación frontend

        if (
            !newUser.name.trim() ||
            !newUser.email.trim() ||
            !newUser.password.trim()
        ) {

            setUserError(
                "Todos los campos son obligatorios."
            );

            return;
        }


        try {

            setCreatingUser(true);

            await createUser({
                name: newUser.name.trim(),
                email: newUser.email.trim(),
                password: newUser.password,
                role: newUser.role
            });


            setUserSuccess(
                "Usuario creado correctamente."
            );


            // Limpiar formulario

            setNewUser({
                name: "",
                email: "",
                password: "",
                role: "user"
            });


            // Actualizar lista de usuarios

            const usersData = await getUsers();

            setUsers(usersData);

        } catch (error) {

            console.error(error);

            setUserError(
                error.response?.data?.message ||
                "No se pudo crear el usuario."
            );

        } finally {

            setCreatingUser(false);

        }
    };


    return (
        <DashboardLayout>

            {/* ========================================== */}
            {/* ENCABEZADO */}
            {/* ========================================== */}

            <div className="mb-8">

                <h1 className="text-3xl font-bold text-gray-800">
                    Panel de administración
                </h1>

                <p className="text-gray-500 mt-2">
                    Gestioná tickets, usuarios y asignaciones del sistema.
                </p>

            </div>


            {/* ========================================== */}
            {/* ERROR GENERAL */}
            {/* ========================================== */}

            {error && (

                <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg px-4 py-3 mb-6">
                    {error}
                </div>

            )}


            {/* ========================================== */}
            {/* MENSAJES DE ASIGNACIÓN */}
            {/* ========================================== */}

            {assignSuccess && (

                <div className="bg-green-100 border border-green-300 text-green-700 rounded-lg px-4 py-3 mb-6">
                    {assignSuccess}
                </div>

            )}


            {assignError && (

                <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg px-4 py-3 mb-6">
                    {assignError}
                </div>

            )}


            {/* ========================================== */}
            {/* MENSAJES DE USUARIOS */}
            {/* ========================================== */}

            {userSuccess && (

                <div className="bg-green-100 border border-green-300 text-green-700 rounded-lg px-4 py-3 mb-6">
                    {userSuccess}
                </div>

            )}


            {userError && (

                <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg px-4 py-3 mb-6">
                    {userError}
                </div>

            )}


            {/* ========================================== */}
            {/* CARGANDO */}
            {/* ========================================== */}

            {loading ? (

                <div className="bg-white rounded-xl border p-8 text-center">

                    <p className="text-gray-500">
                        Cargando panel de administración...
                    </p>

                </div>

            ) : (

                <div className="space-y-8">


                    {/* ========================================== */}
                    {/* ESTADÍSTICAS */}
                    {/* ========================================== */}

                    <section>

                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            Estadísticas generales
                        </h2>


                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">


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

                    </section>


                    {/* ========================================== */}
                    {/* TODOS LOS TICKETS */}
                    {/* ========================================== */}

<section>

    <div className="mb-5">

        <div className="flex items-center justify-between mb-4">

            <div>

                <h2 className="text-xl font-bold text-gray-800">
                    Todos los tickets
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                    Administrá y asigná los tickets del sistema.
                </p>

            </div>

            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">
                {filteredTickets.length} de {tickets.length}
            </span>

        </div>


        {/* ========================================== */}
        {/* BÚSQUEDA Y FILTROS */}
        {/* ========================================== */}

        <div className="bg-white rounded-xl border shadow-sm p-5 mb-5">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                {/* Buscar */}

                <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Buscar ticket
                    </label>

                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(event.target.value)
                        }
                        placeholder="Título o descripción..."
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                </div>


                {/* Estado */}

                <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Estado
                    </label>

                    <select
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(event.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >

                        <option value="all">
                            Todos
                        </option>

                        <option value="ABIERTO">
                            Abierto
                        </option>

                        <option value="EN_PROCESO">
                            En proceso
                        </option>

                        <option value="ESPERANDO_USUARIO">
                            Esperando usuario
                        </option>

                        <option value="RESUELTO">
                            Resuelto
                        </option>

                        <option value="CERRADO">
                            Cerrado
                        </option>

                    </select>

                </div>


                {/* Prioridad */}

                <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Prioridad
                    </label>

                    <select
                        value={priorityFilter}
                        onChange={(event) =>
                            setPriorityFilter(event.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >

                        <option value="all">
                            Todas
                        </option>

                        <option value="BAJA">
                            Baja
                        </option>

                        <option value="MEDIA">
                            Media
                        </option>

                        <option value="ALTA">
                            Alta
                        </option>

                        <option value="CRITICA">
                            Crítica
                        </option>

                    </select>

                </div>


                {/* Soporte */}

                <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Soporte
                    </label>

                    <select
                        value={supportFilter}
                        onChange={(event) =>
                            setSupportFilter(event.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >

                        <option value="all">
                            Todos
                        </option>

                        {supportUsers.map((support) => (

                            <option
                                key={support.id}
                                value={support.id}
                            >
                                {support.name}
                            </option>

                        ))}

                    </select>

                </div>

            </div>

        </div>


        {/* ========================================== */}
        {/* TABLA DE TICKETS */}
        {/* ========================================== */}

        <div className="bg-white rounded-xl border overflow-hidden">

            {filteredTickets.length === 0 ? (

                <div className="p-8 text-center">

                    <p className="text-gray-500">
                        No se encontraron tickets con los filtros seleccionados.
                    </p>

                </div>

            ) : (

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
                                    Estado
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    Prioridad
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

                            {paginatedTickets.map((ticket)=> (

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

                                        <p className="text-sm text-gray-500 mt-1 max-w-md truncate">
                                            {ticket.description}
                                        </p>

                                    </td>


                                    <td className="px-6 py-4">

                                        <StatusBadge
                                            status={ticket.status}
                                        />

                                    </td>


                                    <td className="px-6 py-4">

                                        <PriorityBadge
                                            priority={ticket.priority}
                                        />

                                    </td>


                                    <td className="px-6 py-4">

                                        {ticket.assigned_to ? (

                                            <span className="text-sm text-gray-700">
                                                {supportUsers.find(
                                                    (support) =>
                                                        String(support.id) ===
                                                        String(ticket.assigned_to)
                                                )?.name || "Soporte asignado"}
                                            </span>

                                        ) : (

                                            <span className="text-sm text-gray-400">
                                                Sin asignar
                                            </span>

                                        )}

                                    </td>


                                    <td className="px-6 py-4">

                                        <div className="flex items-center gap-2">

                                            <select
                                                value={
                                                    selectedSupport[ticket.id] || ""
                                                }
                                                onChange={(event) =>
                                                    handleSupportChange(
                                                        ticket.id,
                                                        event.target.value
                                                    )
                                                }
                                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                                            >

                                                <option value="">
                                                    Seleccionar
                                                </option>

                                                {supportUsers.map((support) => (

                                                    <option
                                                        key={support.id}
                                                        value={support.id}
                                                    >
                                                        {support.name}
                                                    </option>

                                                ))}

                                            </select>


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleAssignTicket(ticket.id)
                                                }
                                                disabled={
                                                    assigningTicket === ticket.id
                                                }
                                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg text-sm font-semibold transition"
                                            >

                                                {assigningTicket === ticket.id
                                                    ? "Asignando..."
                                                    : "Asignar"
                                                }

                                            </button>


                                            <Link
                                                to={`/tickets/${ticket.id}`}
                                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-semibold transition"
                                            >
                                                Ver
                                            </Link>

                                        </div>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

        </div>
        {/* ========================================== */}
        {/* PAGINACIÓN */}
        {/* ========================================== */}

        {totalPages > 1 && (

            <div className="bg-white rounded-xl border mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4">

                <p className="text-sm text-gray-500">

                    Mostrando{" "}

                    <span className="font-semibold text-gray-700">
                        {startIndex + 1}
                    </span>

                    {" "}a{" "}

                    <span className="font-semibold text-gray-700">
                        {Math.min(
                            startIndex + ticketsPerPage,
                            filteredTickets.length
                        )}
                    </span>

                    {" "}de{" "}

                    <span className="font-semibold text-gray-700">
                        {filteredTickets.length}
                    </span>

                    {" "}tickets

                </p>


                <div className="flex items-center gap-2">

                    <button
                        type="button"
                        onClick={() =>
                            setCurrentPage((page) => page - 1)
                        }
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        Anterior
                    </button>


                    <span className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold">
                        {currentPage}
                    </span>


                    <button
                        type="button"
                        onClick={() =>
                            setCurrentPage((page) => page + 1)
                        }
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        Siguiente
                    </button>

                </div>

            </div>

        )}

    </div>

</section>


                    {/* ========================================== */}
                    {/* CREAR USUARIO */}
                    {/* ========================================== */}

                    <section>

                        <div className="mb-4">

                            <h2 className="text-xl font-bold text-gray-800">
                                Crear nuevo usuario
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Creá usuarios del sistema y asignales un rol.
                            </p>

                        </div>


                        <div className="bg-white rounded-xl border shadow-sm p-6">

                            <form
                                onSubmit={handleCreateUser}
                                className="space-y-5"
                            >


                                {/* Nombre */}

                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Nombre
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        value={newUser.name}
                                        onChange={handleUserChange}
                                        placeholder="Ej: Juan Perez"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />

                                </div>


                                {/* Email */}

                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        value={newUser.email}
                                        onChange={handleUserChange}
                                        placeholder="Ej: juan@helpdesk.com"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />

                                </div>


                                {/* Contraseña */}

                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Contraseña
                                    </label>

                                    <input
                                        type="password"
                                        name="password"
                                        value={newUser.password}
                                        onChange={handleUserChange}
                                        placeholder="Ingresá una contraseña"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />

                                </div>


                                {/* Rol */}

                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Rol
                                    </label>

                                    <select
                                        name="role"
                                        value={newUser.role}
                                        onChange={handleUserChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >

                                        <option value="user">
                                            Usuario
                                        </option>

                                        <option value="support">
                                            Soporte
                                        </option>

                                    </select>

                                </div>


                                {/* Botón */}

                                <button
                                    type="submit"
                                    disabled={creatingUser}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition"
                                >

                                    {creatingUser
                                        ? "Creando usuario..."
                                        : "Crear usuario"
                                    }

                                </button>

                            </form>

                        </div>

                    </section>


                    {/* ========================================== */}
                    {/* PERSONAL DE SOPORTE */}
                    {/* ========================================== */}

                    <section>

                        <div className="mb-4">

                            <h2 className="text-xl font-bold text-gray-800">
                                Personal de soporte
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Usuarios disponibles para recibir tickets.
                            </p>

                        </div>


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            {supportUsers.length === 0 ? (

                                <div className="bg-white rounded-xl border p-6">

                                    <p className="text-gray-500">
                                        No hay usuarios con rol de soporte.
                                    </p>

                                </div>

                            ) : (

                                supportUsers.map((support) => (

                                    <div
                                        key={support.id}
                                        className="bg-white rounded-xl border shadow-sm p-6"
                                    >

                                        <p className="font-semibold text-gray-800">
                                            {support.name}
                                        </p>

                                        <p className="text-sm text-gray-500 mt-1">
                                            {support.email}
                                        </p>

                                        <span className="inline-block mt-3 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                                            SUPPORT
                                        </span>

                                    </div>

                                ))

                            )}

                        </div>

                    </section>

                </div>

            )}

        </DashboardLayout>
    );
}

export default AdminDashboard;
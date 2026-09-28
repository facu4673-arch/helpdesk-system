import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import DashboardLayout from "../components/DashboardLayout";
import StatusBadge from "../components/StatusBadge";
import PriorityBadge from "../components/PriorityBadge";

import {
    getTicketById,
    updateTicketStatus
} from "../services/ticketService";

import {
    getTicketComments,
    createComment
} from "../services/commentService";

import { useAuth } from "../context/AuthContext";

function TicketDetail() {

    const validTransitions = {
        ABIERTO: ["EN_PROCESO"],
        EN_PROCESO: [
            "ESPERANDO_USUARIO",
            "RESUELTO"
        ],
        ESPERANDO_USUARIO: [
            "EN_PROCESO",
            "RESUELTO"
        ],
        RESUELTO: [
            "CERRADO",
            "EN_PROCESO"
        ],
        CERRADO: []
    };

    const statusLabels = {
        ABIERTO: "Abierto",
        EN_PROCESO: "En proceso",
        ESPERANDO_USUARIO: "Esperando usuario",
        RESUELTO: "Resuelto",
        CERRADO: "Cerrado"
    };

    const { id } = useParams();

    const { user } = useAuth();

    const [ticket, setTicket] = useState(null);

    const [comments, setComments] = useState([]);

    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(true);

    const [commentLoading, setCommentLoading] =
        useState(false);

    const [error, setError] = useState("");

    const [commentError, setCommentError] =
        useState("");
    
    const [selectedStatus, setSelectedStatus] =
    useState("");

    const [statusLoading, setStatusLoading] =
    useState(false);

    const [statusError, setStatusError] =
    useState("");

    const [statusSuccess, setStatusSuccess] =
    useState("");

    useEffect(() => {
        loadTicket();
        loadComments();
    }, [id]);

    const loadTicket = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getTicketById(id);

            setTicket(data);

            setSelectedStatus(data.status);

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "No se pudo cargar el ticket."
            );

        } finally {

            setLoading(false);

        }
    };

    const loadComments = async () => {

        try {

            const data =
                await getTicketComments(id);

            setComments(data);

        } catch (error) {

            console.error(error);

        }
    };

    const handleComment = async (e) => {

        e.preventDefault();

        if (!message.trim()) {
            return;
        }

        try {

            setCommentLoading(true);
            setCommentError("");

            await createComment(
                id,
                message
            );

            setMessage("");

            await loadComments();

        } catch (error) {

            console.error(error);

            setCommentError(
                error.response?.data?.message ||
                "No se pudo agregar el comentario."
            );

        } finally {

            setCommentLoading(false);

        }
    };

    const handleStatusChange = async () => {

    if (!selectedStatus) {
        return;
    }

    if (selectedStatus === ticket.status) {
        return;
    }

    try {

        setStatusLoading(true);
        setStatusError("");
        setStatusSuccess("");

        await updateTicketStatus(
            ticket.id,
            selectedStatus
        );

        setStatusSuccess(
            "Estado actualizado correctamente."
        );

        await loadTicket();

    } catch (error) {

        console.error(error);

        setSelectedStatus(ticket.status);

        setStatusError(
            error.response?.data?.message ||
            "No se pudo actualizar el estado."
        );

    } finally {

        setStatusLoading(false);

    }
};

    if (loading) {

        return (
            <DashboardLayout>

                <div className="bg-white rounded-xl border p-8 text-center">

                    <p className="text-gray-500">
                        Cargando ticket...
                    </p>

                </div>

            </DashboardLayout>
        );
    }

    if (error || !ticket) {

        return (
            <DashboardLayout>

                <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg p-6">

                    {error ||
                        "Ticket no encontrado."}

                </div>

                <Link
                    to="/tickets"
                    className="inline-block mt-4 text-blue-600 hover:underline"
                >
                    ← Volver a mis tickets
                </Link>

            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>

            <div className="mb-6">

                <Link
                    to="/tickets"
                    className="text-blue-600 hover:underline"
                >
                    ← Volver a mis tickets
                </Link>

            </div>

            <div className="grid lg:grid-cols-3 gap-6">

                {/* Información principal */}

                <div className="lg:col-span-2 space-y-6">

                    <div className="bg-white rounded-xl border shadow-sm p-8">

                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                            <div>

                                <p className="text-sm text-gray-500">
                                    Ticket #{ticket.id}
                                </p>

                                <h1 className="text-3xl font-bold text-gray-800 mt-1">
                                    {ticket.title}
                                </h1>

                            </div>

                            <StatusBadge
                                status={ticket.status}
                            />

                        </div>

                        <div className="mt-8">

                            <h2 className="text-sm font-semibold text-gray-500 uppercase">
                                Descripción
                            </h2>

                            <p className="text-gray-700 mt-2 whitespace-pre-line">
                                {ticket.description}
                            </p>

                        </div>

                    </div>

                    {/* Comentarios */}

                    <div className="bg-white rounded-xl border shadow-sm p-8">

                        <h2 className="text-xl font-bold text-gray-800 mb-6">
                            Conversación
                        </h2>

                        {comments.length === 0 && (

                            <div className="bg-gray-50 rounded-lg p-6 text-center">

                                <p className="text-gray-500">
                                    Todavía no hay comentarios.
                                </p>

                            </div>

                        )}

                        <div className="space-y-4">

                            {comments.map((comment) => (

                                <div
                                    key={comment.id}
                                    className="border rounded-xl p-5"
                                >

                                    <div className="flex justify-between items-start gap-4">

                                        <div>

                                            <p className="font-semibold text-gray-800">
                                                {comment.author?.name ||
                                                    comment.user?.name ||
                                                    "Usuario"}
                                            </p>

                                            <p className="text-xs text-gray-500 mt-1">
                                                {comment.created_at
                                                    ? new Date(
                                                        comment.created_at
                                                    ).toLocaleString()
                                                    : ""}
                                            </p>

                                        </div>

                                    </div>

                                    <p className="text-gray-700 mt-4 whitespace-pre-line">
                                        {comment.message}
                                    </p>

                                </div>

                            ))}

                        </div>

                        <div className="border-t mt-8 pt-6">

                            <h3 className="font-semibold text-gray-800 mb-3">
                                Agregar comentario
                            </h3>

                            {commentError && (

                                <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg px-4 py-3 mb-4">
                                    {commentError}
                                </div>

                            )}

                            <form
                                onSubmit={handleComment}
                            >

                                <textarea
                                    value={message}
                                    onChange={(e) =>
                                        setMessage(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Escribí tu mensaje..."
                                    rows="4"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    required
                                />

                                <div className="flex justify-end mt-3">

                                    <button
                                        type="submit"
                                        disabled={
                                            commentLoading
                                        }
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold disabled:opacity-50"
                                    >
                                        {commentLoading
                                            ? "Enviando..."
                                            : "Enviar comentario"}
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>

                {/* Información lateral */}

                <div>

                    <div className="bg-white rounded-xl border shadow-sm p-6">

                        <h2 className="text-lg font-bold text-gray-800 mb-6">
                            Información del ticket
                        </h2>

                        {(user?.role === "support" ||
    user?.role === "admin") && (

    <div className="mb-6 pb-6 border-b">

        <p className="text-sm font-semibold text-gray-700 mb-2">
            Cambiar estado
        </p>

        {statusError && (

            <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg px-3 py-2 text-sm mb-3">
                {statusError}
            </div>

        )}

        {statusSuccess && (

            <div className="bg-green-100 border border-green-300 text-green-700 rounded-lg px-3 py-2 text-sm mb-3">
                {statusSuccess}
            </div>

        )}

        <div className="flex gap-2">

            <select
                value={selectedStatus}
                onChange={(e) =>
                    setSelectedStatus(e.target.value)
                }
                disabled={
                    statusLoading ||
                    validTransitions[ticket.status]?.length === 0
                }
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >

                <option value={ticket.status}>
                    {statusLabels[ticket.status]}
                </option>

                {validTransitions[ticket.status]?.map(
                    (status) => (
                        <option
                            key={status}
                            value={status}
                        >
                            {statusLabels[status]}
                        </option>
                    )
                )}

            </select>
            
            <button
                onClick={handleStatusChange}
                disabled={
                    statusLoading ||
                    selectedStatus === ticket.status
                }
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {statusLoading
                    ? "Guardando..."
                    : "Actualizar"}
            </button>

        </div>
        
        {validTransitions[ticket.status]?.length === 0 && (
            <p className="text-xs text-gray-500 mt-2">
                Este ticket está cerrado y no admite más cambios de estado.
            </p>
        )}

    </div>

)}                    
                                         
                        <div className="space-y-5">

                            <div>

                                <p className="text-sm text-gray-500">
                                    Prioridad
                                </p>

                                <div className="mt-1">
                                    <PriorityBadge
                                        priority={
                                            ticket.priority
                                        }
                                    />
                                </div>

                            </div>

                            <div>

                                <p className="text-sm text-gray-500">
                                    Estado
                                </p>

                                <div className="mt-1">
                                    <StatusBadge
                                        status={
                                            ticket.status
                                        }
                                    />
                                </div>

                            </div>

                            <div>

                                <p className="text-sm text-gray-500">
                                    Categoría
                                </p>

                                <p className="font-semibold text-gray-800 mt-1">
                                    {ticket.category?.name ||
                                        "Sin categoría"}
                                </p>

                            </div>

                            <div>

                                <p className="text-sm text-gray-500">
                                    Creado por
                                </p>

                                <p className="font-semibold text-gray-800 mt-1">
                                    {ticket.creator?.name ||
                                        user?.name ||
                                        "Usuario"}
                                </p>

                            </div>

                            <div>

                                <p className="text-sm text-gray-500">
                                    Soporte asignado
                                </p>

                                <p className="font-semibold text-gray-800 mt-1">
                                    {ticket.assignedSupport?.name ||
                                        "Sin asignar"}
                                </p>

                            </div>

                            <div>

                                <p className="text-sm text-gray-500">
                                    Fecha de creación
                                </p>

                                <p className="font-semibold text-gray-800 mt-1">
                                    {ticket.created_at
                                        ? new Date(
                                            ticket.created_at
                                        ).toLocaleString()
                                        : "-"}
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </DashboardLayout>
    );
}

export default TicketDetail;
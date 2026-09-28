import { useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../components/DashboardLayout";

import { createTicket } from "../services/ticketService";

function CreateTicket() {

    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("MEDIA");
    const [categoryId, setCategoryId] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            await createTicket({
                title,
                description,
                priority,
                category_id: categoryId
                    ? Number(categoryId)
                    : null
            });

            navigate("/tickets");

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "No se pudo crear el ticket."
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <DashboardLayout>

            <div className="max-w-3xl mx-auto">

                <div className="mb-8">

                    <h1 className="text-3xl font-bold text-gray-800">
                        Crear ticket
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Describí el problema que necesitás reportar.
                    </p>

                </div>

                <div className="bg-white rounded-xl border shadow-sm p-8">

                    {error && (
                        <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg px-4 py-3 mb-6">
                            {error}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >

                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Título
                            </label>

                            <input
                                type="text"
                                value={title}
                                onChange={(e) =>
                                    setTitle(e.target.value)
                                }
                                placeholder="Ej: No puedo conectarme a Internet"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />

                        </div>

                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Descripción
                            </label>

                            <textarea
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.target.value)
                                }
                                placeholder="Describí detalladamente el problema..."
                                rows="6"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                required
                            />

                        </div>

                        <div className="grid md:grid-cols-2 gap-6">

                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Prioridad
                                </label>

                                <select
                                    value={priority}
                                    onChange={(e) =>
                                        setPriority(e.target.value)
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >

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

                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Categoría
                                </label>

                                <select
                                    value={categoryId}
                                    onChange={(e) =>
                                        setCategoryId(e.target.value)
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >

                                    <option value="">
                                        Sin categoría
                                    </option>

                                    <option value="1">
                                        Hardware
                                    </option>

                                    <option value="2">
                                        Software
                                    </option>

                                    <option value="3">
                                        Acceso
                                    </option>

                                    <option value="4">
                                        Red
                                    </option>

                                    <option value="5">
                                        Otros
                                    </option>

                                </select>

                            </div>

                        </div>

                        <div className="flex justify-end gap-3 pt-4">

                            <button
                                type="button"
                                onClick={() => navigate("/tickets")}
                                className="px-5 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading
                                    ? "Creando..."
                                    : "Crear ticket"}
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </DashboardLayout>
    );
}

export default CreateTicket;
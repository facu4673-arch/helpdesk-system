function StatusBadge({ status }) {
    const styles = {
        ABIERTO:
            "bg-blue-100 text-blue-700",

        EN_PROCESO:
            "bg-yellow-100 text-yellow-700",

        ESPERANDO_USUARIO:
            "bg-orange-100 text-orange-700",

        RESUELTO:
            "bg-green-100 text-green-700",

        CERRADO:
            "bg-gray-100 text-gray-700"
    };

    const labels = {
        ABIERTO: "Abierto",
        EN_PROCESO: "En proceso",
        ESPERANDO_USUARIO: "Esperando usuario",
        RESUELTO: "Resuelto",
        CERRADO: "Cerrado"
    };

    return (
        <span
            className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                styles[status] || "bg-gray-100 text-gray-700"
            }`}
        >
            {labels[status] || status}
        </span>
    );
}

export default StatusBadge;
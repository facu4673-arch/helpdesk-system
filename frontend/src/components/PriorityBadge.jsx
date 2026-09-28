function PriorityBadge({ priority }) {
    const styles = {
        BAJA:
            "bg-gray-100 text-gray-700",

        MEDIA:
            "bg-blue-100 text-blue-700",

        ALTA:
            "bg-orange-100 text-orange-700",

        CRITICA:
            "bg-red-100 text-red-700"
    };

    const labels = {
        BAJA: "Baja",
        MEDIA: "Media",
        ALTA: "Alta",
        CRITICA: "Crítica"
    };

    return (
        <span
            className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                styles[priority] || "bg-gray-100 text-gray-700"
            }`}
        >
            {labels[priority] || priority}
        </span>
    );
}

export default PriorityBadge;
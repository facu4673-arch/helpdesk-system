function StatCard({ title, value, description, icon }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border p-6">

            <div className="flex justify-between items-start">

                <div>

                    <p className="text-sm text-gray-500">
                        {title}
                    </p>

                    <p className="text-3xl font-bold text-gray-800 mt-2">
                        {value}
                    </p>

                    {description && (
                        <p className="text-sm text-gray-500 mt-2">
                            {description}
                        </p>
                    )}

                </div>

                <div className="text-3xl">
                    {icon}
                </div>

            </div>

        </div>
    );
}

export default StatCard;
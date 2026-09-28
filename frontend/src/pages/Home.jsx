import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

            <div className="text-center">

                <h1 className="text-5xl font-bold text-blue-600 mb-4">
                    HelpDesk
                </h1>

                <p className="text-xl text-gray-600 mb-8">
                    Sistema de Gestión de Tickets de Soporte
                </p>

                <Link
                    to="/login"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg"
                >
                    Iniciar sesión
                </Link>

            </div>

        </div>
    );
}

export default Home;
import { Component } from "react";

class ErrorBoundary extends Component {

    constructor(props) {
        super(props);

        this.state = {
            hasError: false,
            error: null
        };
    }

    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error
        };
    }

    componentDidCatch(error, errorInfo) {
        console.error(
            "Error capturado por ErrorBoundary:",
            error,
            errorInfo
        );
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {

        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

                    <div className="bg-white rounded-xl shadow-sm border p-8 max-w-lg w-full text-center">

                        <div className="text-5xl mb-4">
                            ⚠️
                        </div>

                        <h1 className="text-2xl font-bold text-gray-800">
                            Ocurrió un error
                        </h1>

                        <p className="text-gray-500 mt-3">
                            La aplicación encontró un problema inesperado.
                        </p>

                        <p className="text-sm text-gray-400 mt-2">
                            Podés intentar recargar la página para continuar.
                        </p>

                        <button
                            onClick={this.handleReload}
                            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold transition"
                        >
                            Recargar aplicación
                        </button>

                    </div>

                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
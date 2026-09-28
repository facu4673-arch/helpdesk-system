import {
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import UserDashboard from "../pages/UserDashboard";
import SupportDashboard from "../pages/SupportDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import MyTickets from "../pages/MyTickets";
import AllTickets from "../pages/AllTickets";
import CreateTicket from "../pages/CreateTicket";
import TicketDetail from "../pages/TicketDetail";
import AssignTickets from "../pages/AssignTickets";
import Users from "../pages/Users";

import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

function Dashboard() {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    switch (user.role) {
        case "user":
            return <UserDashboard />;

        case "support":
            return <SupportDashboard />;

        case "admin":
            return <AdminDashboard />;

        default:
            return <Navigate to="/login" replace />;
    }
}

function TicketsPage() {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role === "user") {
        return <MyTickets />;
    }

    if (
        user.role === "support" ||
        user.role === "admin"
    ) {
        return <AllTickets />;
    }

    return <Navigate to="/login" replace />;
}

function AppRoutes() {
    return (
        <Routes>

            <Route
                path="/"
                element={<Home />}
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/tickets"
                element={
                    <ProtectedRoute>
                        <TicketsPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/tickets/create"
                element={
                    <ProtectedRoute>
                        <CreateTicket />
                    </ProtectedRoute>
                }
            />

            {/* IMPORTANTE:
                Estas rutas específicas deben estar
                antes de /tickets/:id
            */}

            <Route
                path="/tickets/assign"
                element={
                    <ProtectedRoute>
                        <AssignTickets />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/tickets/:id"
                element={
                    <ProtectedRoute>
                        <TicketDetail />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/users"
                element={
                    <ProtectedRoute>
                        <Users />
                    </ProtectedRoute>
                }
            />

            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />

        </Routes>
    );
}

export default AppRoutes;
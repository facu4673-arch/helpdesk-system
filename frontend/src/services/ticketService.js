import api from "./api";

export const getMyTickets = async () => {
    const response = await api.get("/tickets/my");
    return response.data;
};

export const getAllTickets = async () => {
    const response = await api.get("/tickets");
    return response.data;
};

export const getTicketStats = async () => {
    const response = await api.get("/tickets/stats");
    return response.data;
};

export const getTicketById = async (ticketId) => {
    const response = await api.get(`/tickets/${ticketId}`);
    return response.data;
};

export const createTicket = async (ticketData) => {
    const response = await api.post("/tickets", ticketData);
    return response.data;
};

export const assignTicket = async (ticketId, assignedTo) => {
    const response = await api.patch(
        `/tickets/${ticketId}/assign`,
        {
            assigned_to: assignedTo
        }
    );

    return response.data;
};

export const updateTicketStatus = async (ticketId, status) => {
    const response = await api.patch(
        `/tickets/${ticketId}/status`,
        {
            status
        }
    );

    return response.data;
};
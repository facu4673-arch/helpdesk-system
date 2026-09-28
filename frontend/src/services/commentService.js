import api from "./api";

export const getTicketComments = async (
    ticketId
) => {

    const response = await api.get(
        `/comments/${ticketId}`
    );

    return response.data;
};

export const createComment = async (
    ticketId,
    message
) => {

    const response = await api.post(
        "/comments",
        {
            ticket_id: ticketId,
            message
        }
    );

    return response.data;
};
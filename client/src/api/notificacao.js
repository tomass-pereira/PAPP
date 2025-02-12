import { BASE_URL } from './config';

export const getNotificacoes = async (utenteId) => {
    try {
        const response = await fetch(`${BASE_URL}/notificacoes/${utenteId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erro ao buscar notificações');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar notificações:', error);
        throw error;
    }
};
export const marcarTodasComoLidas = async (utenteId) => {
    try {
        const response = await fetch(`${BASE_URL}/notificacoes/lida/${utenteId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erro ao marcar notificações como lidas');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao marcar notificações como lidas:', error);
        throw error;
    }
};
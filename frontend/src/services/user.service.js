import axios from './root.service';

export const createUser = async (userData) => {
    try {
        const { data } = await axios.post('users/', userData);
        return [data, null];
    } catch (error) {
        console.error("Error creating user:", error);
        return [null, error.response ? error.response.data : error];
    }
};

export const confirmUser = async (id, code) => {
    try {
        const { data } = await axios.put(`users/confirm/${id}`, { code });
        return [data, null];
    } catch (error) {
        console.error("Error confirming user:", error);
        return [null, error.response ? error.response.data : error];
    }
};

export const getUserById = async (id) => {
    try {
        const { data } = await axios.get(`users/${id}`);
        return [data, null];
    } catch (error) {
        console.error("Error getting user by id:", error);
        return [null, error.response ? error.response.data : error];
    }
}
import axios from './root.service';

export const createUser = async (userData) => {
    try {
        const { data } = await axios.post('users/', userData);
        return [data, null];
    } catch (error) {
        console.error("Error creating user:", error);
        throw new Error(error.response.data.message);
    }
};

export const updateUser = async (id, formData) => {
    console.log("formData", formData);
    try {
        const { data } = await axios.put(`/users/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return [data, null];
    } catch (error) {
        console.error("Error updating user:", error);
        return [null, error.response ? error.response.data : error];
    }
};

export const updateRoleUser = async (id, userData) => {
    try {
        const { data } = await axios.put(`users/update-role/${id}`, userData);
        return [data, null];
    } catch (error) {
        console.error("Error updating user:", error);
        return [null, error.response ? error.response.data : error];
    }
}

export const confirmUser = async (mail, code) => {
    try {
        const promise = await getUserByEmail(mail);
        const user = promise[0].user;
        const { data } = await axios.put(`users/confirm/${user._id}`, { code });
        return [data, null];
    } catch (error) {
        console.error("Error confirming user:", error);
        throw new Error(error.response.data.message);
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

export const getUserByEmail = async (email) => {
    try {
        const { data } = await axios.get(`users/email/${email}`);
        return [data, null];
    } catch (error) {
        console.error("Error getting user by email:", error);
        return [null, error.response ? error.response.data : error];
    }
}

export const getUsers = async () => {
    try {
        const { data } = await axios.get('users/');
        return data.data;
    } catch (error) {
        console.error("Error getting users:", error);
        return [null, error.response ? error.response.data : error];
    }
}

export const getUsersTricel = async () => {
    try {
        const { data } = await axios.get('users/tricel/');
        return data.data;
    } catch (error) {
        console.error("Error getting users:", error);
        return [null, error.response ? error.response.data : error];
    }
};


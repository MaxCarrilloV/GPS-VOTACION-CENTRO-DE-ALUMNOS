// src/services/Tricel/procesos.service.js
import instance from "../root.service";

export const getProcesos = async () => {
  try {
    const response = await instance.get("/proceso");
    console.log("response: ", response);
    const { status, data } = response;
    if (status === 200) {
      return data.data;
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // Si el backend devuelve 404, retornamos un array vacío
      //para evitar el error process is undefined
      return [];
    }
    console.log(error);
    throw error;
  }
};

export const createProceso = async (proceso) => {
  try {
    const response = await instance.post("/proceso", proceso);

    const { status, data } = response;

    return data.data;
  } catch (error) {
    console.log("error: ", error.response.data);
    return error.response;
  }
};

export const updateFinalizadoProceso = async (id, finalizado) => {
  try {
    const response = await instance.put(`/proceso/finalizado/${id}`, { finalizado });
    console.log("response: ", response);
    const { status, data } = response;
    if (status === 200) {
      return data.data;
    }
  } catch (error) {
    console.log(error);
    throw error; 
  }
};

export const deleteProceso = async (id) => {
  try {
    const response = await instance.delete(`/proceso/${id}`);
    console.log("response: ", response);
    const { status, data } = response;
    if (status === 200) {
      return data.data;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// src/services/Tricel/periodos.service.js
import instance from "../root.service";

export const getPeriodos = async () => {
  try {
    const response = await instance.get("/periodo");
    const { status, data } = response;
    if (status === 200) {
      return data.data;
    } else {
      console.error("Error fetching periodos:", response);
      return [];
    }
  } catch (error) {
    console.error("Error fetching periodos:", error);
    return [];
  }
};

export const createPeriodo = async (periodo) => {
  try {
    const response = await instance.post("/periodo", periodo);
    return response; // devuelve la respuesta completa
  } catch (error) {
    console.error("error: ", error.response.data);
    return error.response;
  }
};

export const updatePeriodo = async (id, periodo) => {
  try {
    const response = await instance.put(`/periodo/${id}`, periodo);
    const { status, data } = response;
    if (status === 200) {
      return data.data;
    }
  } catch (error) {
    console.error(error);
  }
};

export const deletePeriodo = async (id) => {
  try {
    const response = await instance.delete(`/periodo/${id}`);
    const { status, data } = response;
    if (status === 200) {
      return data.data;
    }
  } catch (error) {
    console.error(error);
  }
};

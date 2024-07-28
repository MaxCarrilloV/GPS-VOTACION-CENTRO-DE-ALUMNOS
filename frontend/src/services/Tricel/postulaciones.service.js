// src/services/Tricel/postulaciones.service.js

import instance from "../root.service";

// Obtener postulaciones
export const getPostulaciones = async () => {
  try {
    const response = await instance.get("/postulacion");
    console.log("response: ", response);
    const { status, data } = response;
    if (status === 200) {
      return data.data;
    }
  } catch (error) {
    console.log(error);
  }
};

// Crear postulaciones
export const createPostulacion = async (postulacionData) => {
  try {
    const response = await instance.post("/postulacion", postulacionData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("response: ", response);

    return response; // devuelve la respuesta completa
  } catch (error) {
    console.error("error: ", error.response.data);
    return error.response;
  }
};

// Actualizar postulaciones
export const updatePostulacion = async (id, postulacionData) => {
  try {
    const response = await instance.put(`/postulacion/${id}`, postulacionData);
    console.log("response: ", response);
    return response; // devuelve la respuesta completa
  } catch (error) {
    console.error("error: ", error.response.data);
    return error.response;
  }
};

// Eliminar postulaciones
export const deletePostulacion = async (id) => {
  try {
    const response = await instance.delete(`/postulacion/${id}`);
    console.log("response: ", response);
    const { status, data } = response;
    if (status === 200) {
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

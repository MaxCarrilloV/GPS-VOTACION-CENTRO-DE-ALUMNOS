import axios from './root.service';

export const getVotaciones = async () => {
   try {
      const response = await axios.get('/votacion');
      const { status, data } = response;
      if (status === 200) {
         return data.data;
      }
   } catch (error) {      
      return error.response.data;
   }
}

export const createVotacion = async (formdata) => {
    try {
        const response = await axios.post('/votacion', formdata);
        return [response,null];
    } catch (error) {
        console.log(error);
        return [null, error.response ? error.response.data : error];
    }
}

export const updateVotacion = async (id, formdata) => {
    try {
        const response = await axios.put(`/votacion/${id}`, formdata);
        return [response,null];
    } catch (error) {
        console.log(error);
        return [null, error.response ? error.response.data : error];
    }
}

export const votarVotacion = async (id, formdata) => {
    try {
        const response = await axios.put(`/votacion/${id}/votar`, formdata);
        return [response,null];
    } catch (error) {
        console.log(error);
        return [null, error.response ? error.response.data : error];
    }
}

export const getVotacion = async (id) => {
   try {
      const response = await axios.get(`/votacion/${id}`);
      const { status, data } = response;
      if (status === 200) {
         return data.data;
      }
   } catch (error) {
      return error.response.data;
   }
}

export const deleteVotacion = async (id) => {
   try {
      const response = await axios.delete(`/votacion/${id}`);
      const { status } = response;

      if (status === 200) {
         return true;
      }
   } catch (error) {
      console.log(error);
      return false;
   }
}
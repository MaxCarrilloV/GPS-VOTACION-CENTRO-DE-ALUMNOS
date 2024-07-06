import instance from '../root.service';

export const getPostulaciones = async () => {
  try {
    const response = await instance.get('/postulacion');
    console.log('response: ', response);
    const { status, data } = response;
    if (status === 200) {
      return data.data;
    }
  } catch (error) {
    console.log(error);
  }
};

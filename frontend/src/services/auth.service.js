import axios from './root.service';
import cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
import { act } from 'react';

export const login = async ({ email, password }) => {
  try {
    const response = await axios.post('auth/login', {
      email,
      password
    });
    const { status, data } = response;
    if (status === 200) {
      const { email, roles, Userid, active} = await jwtDecode(data.data.accessToken);
      localStorage.setItem('user', JSON.stringify({ email, roles, Userid, active}));
      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${data.data.accessToken}`;
      cookies.set('jwt-auth', data.data.accessToken, { path: '/' });
    }
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const logout = () => {
  localStorage.removeItem('user');
  delete axios.defaults.headers.common['Authorization'];
  cookies.remove('jwt');
  cookies.remove('jwt-auth');
};

export const test = async () => {
  try {
    const response = await axios.get('/users');
    const { status, data } = response;
    if (status === 200) {
      console.log(data.data);
    }
  } catch (error) {
    console.log(error);
  }
};

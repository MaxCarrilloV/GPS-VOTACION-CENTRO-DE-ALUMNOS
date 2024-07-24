import axios from 'axios';
import cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api';

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const token = cookies.get('jwt-auth', { path: '/' });
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const createPost = (postData) => {
  return instance.post('/posts', postData);
};

const getAllPosts = () => {
  return instance.get('/posts');
};

const getPostById = (postId) => {
  return instance.get(`/posts/${postId}`);
};

const deletePost = (postId) => {
  return instance.delete(`/posts/${postId}`);
};

const getUserById = (id) => {
  return instance.get(`/users/${id}`);
};

const createComment = (postId, commentData) => {
  return instance.post(`/posts/${postId}/comments`, commentData);
};

const replyToComment = (postId, commentId, reply) => {
  return instance.post(`/posts/${postId}/comments/${commentId}/reply`, reply);
};

const deleteComment = (postId, commentId) => {
  return instance.delete(`/posts/${postId}/comments/${commentId}`);
};




export default {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  getUserById,
  createComment,
  replyToComment,
  deleteComment,
};

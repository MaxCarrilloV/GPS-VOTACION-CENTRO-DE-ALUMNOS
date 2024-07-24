import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import postService from '../services/post.service';
import '../foro.css';

const Foro = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await postService.getAllPosts();
        // Filtrar las publicaciones de tipo 'Normal'
        const normalPosts = data.filter(post => post.type === 'Normal');
        setPosts(normalPosts);
      } catch (error) {
        console.error("Error al obtener las publicaciones:", error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="foro">
      {posts.map(post => (
        <div key={post._id} className="post-card card-content">
          <h2>
            <Link to={`/post/${post._id}`}>{post.title}</Link>
          </h2>
          <p>{post.text}</p>
        </div>
      ))}
    </div>
  );
};

export default Foro;

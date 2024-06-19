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
        const listPosts = data.filter(post => post.type === 'List');
        const normalPosts = data.filter(post => post.type === 'Normal');
        setPosts([...listPosts, ...normalPosts]);
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
          {post.type === 'List' && (
            <div>
              <h3>Miembros:</h3>
              <ul>
                {post.listMembers.map(member => (
                  <li key={member}>{member}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Foro;

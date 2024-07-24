import React, { useEffect, useState } from 'react';
import postService from '../services/post.service';

const Listas = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await postService.getAllPosts();
        // Filtrar las publicaciones de tipo 'List'
        const listPosts = data.filter(post => post.type === 'List');
        setPosts(listPosts);
      } catch (error) {
        console.error("Error al obtener las publicaciones:", error);
      }
    };
    fetchPosts();
  }, []);

  // Estilos en línea para centrar el contenido
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px'
  };

  const postCardStyle = {
    width: '80%', // Ajusta el ancho de las tarjetas según sea necesario
    margin: '1em 0', // Espacio entre las tarjetas
    padding: '1em',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    textAlign: 'left' // Alineación del texto dentro de la tarjeta
  };

  return (
    <div style={containerStyle}>
      {posts.map(post => (
        <div key={post._id} style={postCardStyle}>
          <h2>{post.title}</h2>
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

export default Listas;

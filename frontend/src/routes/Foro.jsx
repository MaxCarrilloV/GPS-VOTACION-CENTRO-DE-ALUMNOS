import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import postService from '../services/post.service';
import '../foro.css';
import Avisos from '../components/Avisos';
import Actividades from '../components/Actividades';
import { Grid } from '@mui/material';

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
    <>
        <Grid container spacing={2}>
          <Grid item xs={3}>
          </Grid>
          <Grid item xs={6}>
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
          </Grid>
          <Grid item xs={3}>
            <Grid container direction="column" spacing={2} justifyContent="flex-end">
              <Grid item>
                <Avisos />
              </Grid>
              <Grid item>
                <Actividades />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        
        </>

    
  );
};

export default Foro;

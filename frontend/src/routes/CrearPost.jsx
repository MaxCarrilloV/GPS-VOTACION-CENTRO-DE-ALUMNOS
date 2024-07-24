import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import postService from '../services/post.service';

const CrearPost = () => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [type, setType] = useState('Normal');
  const [listMembers, setListMembers] = useState(['', '', '', '', '']); // Estado para los miembros de la lista
  const navigate = useNavigate();

  const handleListMemberChange = (index, value) => {
    const newListMembers = [...listMembers];
    newListMembers[index] = value;
    setListMembers(newListMembers);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const postData = {
      title,
      text,
      type,
      listMembers: type === 'List' ? listMembers.filter(member => member.trim() !== '') : [], // Filtrar miembros vacíos
    };

    try {
      const response = await postService.createPost(postData);
      alert(response.data.message);
      if (type === 'List') {
        navigate('/listas'); // Redirige a /listas si el tipo es 'List'
      } else {
        navigate('/foro'); // Redirige a /foro para otros tipos
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Crear una Nueva Publicación</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Título"
              variant="outlined"
              fullWidth
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Texto"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Tipo</InputLabel>
              <Select
                value={type}
                onChange={(e) => setType(e.target.value)}
                label="Tipo"
              >
                <MenuItem value="Normal">Normal</MenuItem>
                <MenuItem value="List">Lista</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {type === 'List' && (
            <>
              {[...Array(5)].map((_, index) => (
                <Grid item xs={12} key={index}>
                  <TextField
                    label={`Miembro ${index + 1}`}
                    variant="outlined"
                    fullWidth
                    value={listMembers[index]}
                    onChange={(e) => handleListMemberChange(index, e.target.value)}
                  />
                </Grid>
              ))}
            </>
          )}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Subir Publicación
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default CrearPost;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import postService from '../services/post.service';
import { getUserByEmail } from '../services/user.service';
import { useAuth } from '../context/AuthContext';
import '../post.css';

const Post = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const navigate = useNavigate();
  const [expandedComments, setExpandedComments] = useState({});
  const [newCommentText, setNewCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [usuario, setUsuario] = useState(null);

  const { user } = useAuth();

  useEffect(() => {

    const fetchPost = async () => {
      try {
        const { data } = await postService.getPostById(postId);
        setPost(data);
      } catch (error) {
        console.error("Error al obtener el post:", error);
      }
    };
    fetchPost();
  }, [postId]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (user && user.email) {
          const loadedUser = await getUserByEmail(user.email);
          if (loadedUser && loadedUser.length > 0) {
            setUsuario(loadedUser[0].user);
            console.log('Usuario cargado:', loadedUser[0].user.username);
          } else {
            console.error('No se encontró ningún usuario.');
          }
        }
      } catch (error) {
        console.error('Error al obtener el usuario:', error.message);
      }
    };

    fetchUser();
  }, [user]);

  const handleDeletePost = async () => {
    const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este post?");
    if (confirmDelete) {
      try {
        await postService.deletePost(postId);
        localStorage.setItem('postDeletedMessage', 'Publicación eliminada exitosamente');
        navigate('/foro'); 
      } catch (error) {
        console.error("Error al eliminar el post:", error);
      }
    }
  };



  const handleExpandClick = (commentId, replies) => {
    setExpandedComments((prev) => {
      const isExpanded = prev[commentId];
      const newExpandedComments = { ...prev, [commentId]: !isExpanded };

      if (isExpanded) {
        collapseAllReplies(replies, newExpandedComments);
      }

      return newExpandedComments;
    });
  };

  const collapseAllReplies = (replies, expandedCommentsState) => {
    replies.forEach(reply => {
      if (expandedCommentsState[reply._id]) {
        expandedCommentsState[reply._id] = false;
        if (reply.replies.length > 0) {
          collapseAllReplies(reply.replies, expandedCommentsState);
        }
      }
    });
  };

  const handleNewCommentChange = (e) => {
    setNewCommentText(e.target.value);
  };

  const handleReplyTextChange = (e) => {
    setReplyText(e.target.value);
  };

  const handleDeleteComment = async (commentId) => {
    const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este comentario?");
    if (confirmDelete) {
      try {
        await postService.deleteComment(postId, commentId);
        const { data } = await postService.getPostById(postId);
        setPost(data);
      } catch (error) {
        console.error("Error al eliminar el comentario:", error);
      }
    }
  };


  const handleNewCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const newComment = {
        text: newCommentText
      };
      await postService.createComment(postId, newComment);
      setNewCommentText('');
      const { data } = await postService.getPostById(postId); // Vuelve a obtener el post actualizado
      const updatedPost = data;

      // Actualizar expandedComments para mostrar el nuevo comentario y expandir su comentario padre si existe
      const newExpandedComments = { ...expandedComments };
      newExpandedComments[updatedPost.comments[updatedPost.comments.length - 1]._id] = true;
      if (replyingTo) {
        newExpandedComments[replyingTo] = true; // Expandir el comentario padre si estamos respondiendo a uno
      }
      setExpandedComments(newExpandedComments);

      // Actualizar el post con los comentarios actualizados
      setPost(updatedPost);
    } catch (error) {
      console.error("Error al crear el comentario:", error);
    }
  };


  const handleReplySubmit = async (e, parentCommentId) => {
    e.preventDefault();
    try {
      const newReply = {
        text: replyText
      };
      await postService.replyToComment(postId, parentCommentId, newReply);
      setReplyText('');
      setReplyingTo(null);
      const { data } = await postService.getPostById(postId); // Vuelve a obtener el post actualizado
      const updatedPost = data;

      // Actualizar expandedComments para expandir el comentario padre y mostrar la respuesta recién agregada
      const newExpandedComments = { ...expandedComments };
      newExpandedComments[parentCommentId] = true;
      setExpandedComments(newExpandedComments);

      // Actualizar el post con los comentarios actualizados
      setPost(updatedPost);
    } catch (error) {
      console.error("Error al responder el comentario:", error);
    }
  };

  const renderReplies = (replies, level = 1) => {
    return replies.map(reply => (
      <React.Fragment key={reply._id}>
        <div className="comment-box" style={{ marginLeft: `${level * 20}px` }}>
          <p><strong>{reply.username}</strong></p>
          <p>{reply.text}</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            {reply.replies.length > 0 && (
              <button onClick={() => handleExpandClick(reply._id, reply.replies)} className="expand-button">
                {expandedComments[reply._id] ? "Ver menos" : "Ver más"}
              </button>
            )}
            <button onClick={() => setReplyingTo(reply._id)} className="reply-button">Responder</button>
            {usuario && usuario.username === reply.username && (
              <button onClick={() => handleDeleteComment(reply._id)} className="delete-button">Eliminar</button>
            )}

          </div>

          {expandedComments[reply._id] && renderReplies(reply.replies, level + 1)}
          {replyingTo === reply._id && (
            <div className="reply-box" style={{ marginLeft: `${(level + 1) * 20}px` }}>
              <form onSubmit={(e) => handleReplySubmit(e, reply._id)}>
                <textarea
                  value={replyText}
                  onChange={handleReplyTextChange}
                  placeholder="Responder comentario..."
                  rows="3"
                />
                <button type="submit">Responder</button>
              </form>
            </div>

          )}
        </div>
      </React.Fragment>
    ));
  };



  const renderComments = (comments) => {
    return comments.map(comment => (
      <React.Fragment key={comment._id}>
        <div className="comment-box">
          <p><strong>{comment.username}</strong></p>
          <p>{comment.text}</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            {comment.replies.length > 0 && (
              <button onClick={() => handleExpandClick(comment._id, comment.replies)} className="expand-button">
                {expandedComments[comment._id] ? "Ver menos" : "Ver más"}
              </button>
            )}
            <button onClick={() => setReplyingTo(comment._id)} className="reply-button">Responder</button>
            {usuario && usuario.username === comment.username && (
              <button onClick={() => handleDeleteComment(comment._id)} className="delete-button">Eliminar</button>
            )}
          </div>
          {/*Poner aqui un </div> si se quieren cajas independientes*/}
          {expandedComments[comment._id] && renderReplies(comment.replies)}
          {replyingTo === comment._id && (
            <div className="reply-box" style={{ marginLeft: '20px' }}>
              <form onSubmit={(e) => handleReplySubmit(e, comment._id)}>
                <textarea
                  value={replyText}
                  onChange={handleReplyTextChange}
                  placeholder="Responder comentario..."
                  rows="3"
                  ref={(input) => input && input.focus()}
                />
                <button type="submit">Responder</button>
              </form>
            </div>
          )}
        </div> {/* y quitar este*/}
      </React.Fragment>
    ));
  };

  if (!post) {
    return <div>Cargando...</div>;
  }



  return (
    <div className="post-detail">
      <div className="post-card">
        <p><span style={{
          fontStyle: 'italic',
          fontWeight: 'bold',
          color: 'rgba(128, 200, 255, 0.5)',
          textShadow: '0 0 1px black'
        }}>
          Publicada por: {post.username}
        </span></p>
        <h2>{post.title}</h2>

        <div className="post-text-box">
          <p>{post.text}</p>
        </div>
        <div>
          {usuario && usuario.username === post.username && (
            <button
              type="submit"
              onClick={handleDeletePost}
              style={{ backgroundColor: 'red', color: 'white' }}
            >
              Eliminar post
            </button>
          )}
        </div>
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
        {post.type === 'Normal' && (<h3>Comentarios:</h3>)}
        {renderComments(post.comments)}
        {post.type === 'Normal' && (
          <div className="new-comment-box">
            <form onSubmit={handleNewCommentSubmit}>
              <textarea
                value={newCommentText}
                onChange={handleNewCommentChange}
                placeholder="Escribe un comentario..."
                rows="3"
              />
              <button type="submit">Enviar</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;

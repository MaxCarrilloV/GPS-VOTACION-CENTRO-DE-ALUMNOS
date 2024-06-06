import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import postService from '../services/post.service';
import '../post.css';

const Post = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);

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

  const renderReplies = (replies, level = 1) => {
    return replies.map(reply => (
      <React.Fragment key={reply._id}> 
      <div className="comment-box" style={{ marginLeft: `${level * 20}px` }}>
        <p><strong>{reply.username}</strong></p>
        <p>{reply.text}</p>
        </div>
        {reply.replies.length > 0 && renderReplies(reply.replies, level + 1)}
          </React.Fragment>
    ));
  };

  if (!post) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="post-detail">
      <div className="post-card">
        <h2>{post.title}</h2>
        <p><strong>Autor: {post.username}</strong></p>
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
        {post.type === 'Normal' && (<h3>Comentarios:</h3>)}
        {post.comments.map(comment => (
          <React.Fragment key={comment._id}>
            <div className="comment-box">
              <p><strong>{comment.username}</strong></p>
              <p>{comment.text}</p>
            </div>
            {comment.replies.length > 0 && renderReplies(comment.replies)}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Post;

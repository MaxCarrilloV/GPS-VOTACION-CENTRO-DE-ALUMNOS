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
          const commentsWithUsernames = await fetchCommentUsernames(data.comments);
          setPost({ ...data, comments: commentsWithUsernames });
        } catch (error) {
          console.error("Error al obtener el post:", error);
        }
      };
      fetchPost();
    }, [postId]);

    const renderReplies = (replies, usernames) => {
      return replies.map(reply => (
        <div key={reply._id} className="reply">
          <p><strong>Usuario: {reply.username}</strong></p>
          <p>{reply.text}</p>
          <p>Fecha: {reply.createdAt}</p>
          {reply.replies.length > 0 && renderReplies(reply.replies, usernames)}
        </div>
      ));
    };

    const fetchCommentUsernames = async (comments) => {
      const updatedComments = [];
      for (const comment of comments) {
        const { data: userData } = await postService.getUserById(comment.createdBy);
        const updatedComment = { ...comment, username: userData.data.username };
        updatedComment.replies = await fetchCommentUsernames(comment.replies); 
        updatedComments.push(updatedComment);
      }
      return updatedComments;
    };

    if (!post) {
      return <div>Cargando...</div>;
    }

    return (
      <div className="post-detail">
        <div className="post-card">
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
          {post.type === 'Normal' && (<h3>Comentarios:</h3>)}
          {post.comments.map(comment => (
            <div key={comment._id} className="comment">
              <p><strong>Usuario: {comment.username}</strong></p>
              <p>{comment.text}</p>
              <p>Fecha: {comment.createdAt}</p>
              {comment.replies.length > 0 && renderReplies(comment.replies)}
            </div>
          ))}
        </div>
      </div>
    );
};

export default Post;

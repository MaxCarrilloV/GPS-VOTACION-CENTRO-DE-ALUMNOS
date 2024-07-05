"use strict";

const postService = require("../services/post.service");

async function getAllPosts(req, res) {
  try {
    const [posts, error] = await postService.getAllPosts();
    if (error) return res.status(404).json({ message: error });
    return res.status(200).json(posts);
  } catch (error) {
    console.error("Error en getAllPosts:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function getPostById(req, res) {
  try {
    const postId = req.params.postId;
    console.log("ID de la publicación:", req.params.postId);
    const [post, error] = await postService.getPostById(postId);
    console.log("Publicación recuperada:", post);
    if (error) return res.status(404).json({ message: error });
    return res.status(200).json(post);
  } catch (error) {
    console.error("Error en getPostById:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function createPost(req, res) {
  try {
    const postData = req.body;
    postData.username = req.username;
    const [newPost, error] = await postService.createPost(postData);
    if (error) return res.status(400).json({ message: error });
    return res.status(201).json({ message: "Publicación creada exitosamente", post: newPost });
  } catch (error) {
    console.error("Error en createPost:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function updatePost(req, res) {
  try {
    const postId = req.params.postId;
    const postData = req.body;
    const [updatedPost, error] = await postService.updatePost(postId, postData);
    if (error) return res.status(404).json({ message: error });
    return res.status(200).json({ message: "Publicación actualizada exitosamente", post: updatedPost });
  } catch (error) {
    console.error("Error en updatePost:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function deletePost(req, res) {
  try {
    const postId = req.params.postId;
    const [deletedPost, error] = await postService.deletePost(postId);
    if (error) return res.status(404).json({ message: error });
    return res.status(200).json({ message: "Publicación eliminada exitosamente", post: deletedPost });
  } catch (error) {
    console.error("Error en deletePost:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function createComment(req, res) {
  try {
    const postId = req.params.postId;
    const commentData = req.body;
    commentData.username = req.username;
    console.log(req.username);
    const [updatedPost, error] = await postService.createComment(postId, commentData);
    if (error) return res.status(404).json({ message: error });
    return res.status(201).json({ message: "Comentario creado exitosamente", post: updatedPost });
  } catch (error) {
    console.error("Error en createComment:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function deleteComment(req, res) {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    
    const [updatedPost, error] = await postService.deleteComment(postId, commentId);
    
    if (error) return res.status(404).json({ message: error });
    
    return res.status(200).json({ message: "Comentario eliminado exitosamente", post: updatedPost });
  } catch (error) {
    console.error("Error en deleteComment:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}



async function getCommentById(req, res) {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;

    const [comment, error] = await postService.getCommentById(postId, commentId);
    if (error) return res.status(404).json({ message: error });

    return res.status(200).json(comment);
  } catch (error) {
    handleError(error, "post.controller -> getCommentById");
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function addCommentToComment(req, res) {
  const { postId, commentId } = req.params;
  const { text } = req.body;
  
  const createdBy = req.userId;  
  const username = req.username; 
  
  const [updatedPost, error] = await postService.addReplyToComment(postId, commentId, { text, createdBy, username });

  if (error) {
    return res.status(400).json({ error });
  }

  res.json(updatedPost);
}




module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  createComment,
  deleteComment,
  getCommentById,
  addCommentToComment
};


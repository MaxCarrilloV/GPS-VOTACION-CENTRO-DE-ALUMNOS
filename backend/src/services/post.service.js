"use strict";

const Post = require("../models/post.model");
const { handleError } = require("../utils/errorHandler");

async function getAllPosts() {
  try {
    const posts = await Post.find();
    if (posts.length === 0) return [null, "No hay publicaciones registradas"];
    return [posts, null];
  } catch (error) {
    handleError(error, "post.service -> getAllPosts");
    return [null, "Error al obtener publicaciones"];
  }
}

async function getPostById(id) {
  try {
    const post = await Post.findById(id);
    if (!post) return [null, "La publicación no existe"];
    return [post, null];
  } catch (error) {
    handleError(error, "post.service -> getPostById");
    return [null, "Error al obtener la publicación"];
  }
}

async function createPost(postData) {
  try {
    const newPost = new Post(postData);
    const savedPost = await newPost.save();
    return [savedPost, null];
  } catch (error) {
    handleError(error, "post.service -> createPost");
    return [null, "Error al crear la publicación"];
  }
}

async function updatePost(postId, postData) {
  try {
    const updatedPost = await Post.findByIdAndUpdate(postId, postData, {
      new: true,
    });
    if (!updatedPost) return [null, "La publicación no fue encontrada"];
    return [updatedPost, null];
  } catch (error) {
    handleError(error, "post.service -> updatePost");
    return [null, "Error al actualizar la publicación"];
  }
}

async function deletePost(postId) {
  try {
    const deletedPost = await Post.findByIdAndDelete(postId);
    if (!deletedPost)
      return [null, "La publicación no fue encontrada o no se pudo eliminar"];
    return [deletedPost, null];
  } catch (error) {
    handleError(error, "post.service -> deletePost");
    return [null, "Error al eliminar la publicación"];
  }
}

async function createComment(postId, commentData) {
  try {
    const post = await Post.findById(postId);
    if (!post) return [null, "La publicación no existe"];
    post.comments.push(commentData);
    const savedPost = await post.save();
    return [savedPost, null];
  } catch (error) {
    handleError(error, "post.service -> createComment");
    return [null, "Error al crear el comentario"];
  }
}

async function deleteComment(postId, commentId) {
  try {
    const post = await Post.findById(postId);
    if (!post) return [null, "La publicación no existe"];

    // Encuentra el comentario y su padre (si existe)
    const [comment, error] = await getCommentById(postId, commentId);
    if (error) return [null, error];

    // Función recursiva para eliminar un comentario del array de comentarios
    function removeComment(comments, commentId) {
      for (let i = 0; i < comments.length; i++) {
        if (comments[i]._id.equals(commentId)) {
          comments.splice(i, 1);
          return true;
        }
        if (removeComment(comments[i].replies, commentId)) {
          return true;
        }
      }
      return false;
    }

    // Intenta eliminar el comentario encontrado
    if (!removeComment(post.comments, commentId)) {
      return [null, "El comentario no fue encontrado"];
    }

    const savedPost = await post.save();
    return [savedPost, null];
  } catch (error) {
    handleError(error, "post.service -> deleteComment");
    return [null, "Error al eliminar el comentario"];
  }
}

async function getCommentById(postId, commentId) {
  try {
    const post = await Post.findById(postId);
    if (!post) return [null, "La publicación no existe"];

    const comment = findCommentInPost(post, commentId);
    if (!comment) return [null, "El comentario no existe"];

    return [comment, null];
  } catch (error) {
    handleError(error, "post.service -> getCommentById");
    return [null, "Error al obtener el comentario"];
  }
}

async function addReplyToComment(postId, commentId, commentData) {
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return [null, "La publicación no existe"];
    }

    const comment = findCommentInPost(post, commentId);
    if (!comment) {
      return [null, "El comentario no fue encontrado en el post"];
    }

    comment.replies.push(commentData);
    const savedPost = await post.save();
    
    return [savedPost, null];
  } catch (error) {
    console.error("Error en addReplyToComment:", error);
    return [null, "Error al añadir comentario al comentario"];
  }
}

function findCommentInPost(post, commentId) {
  // Recorre los comentarios directos
  for (const comment of post.comments) {
    if (comment._id.equals(commentId)) {
      return comment;
    }
    // Recorre las respuestas de los comentarios
    const nestedComment = findCommentInNestedComments(comment, commentId);
    if (nestedComment) {
      return nestedComment;
    }
  }
  return null;
}

function findCommentInNestedComments(comment, commentId) {
  for (const reply of comment.replies) {
    if (reply._id.equals(commentId)) {
      return reply;
    }
    const nestedComment = findCommentInNestedComments(reply, commentId);
    if (nestedComment) {
      return nestedComment;
    }
  }
  return null;
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
  addReplyToComment
};

"use strict";

const express = require("express");
const postController = require("../controllers/post.controller");
const router = express.Router();

// Rutas para operaciones de publicaciones
router.get("/", postController.getAllPosts);
router.get("/:postId", postController.getPostById);
router.post("/", postController.createPost);
router.put("/:postId", postController.updatePost);
router.delete("/:postId", postController.deletePost);

// Rutas para operaciones de comentarios en las publicaciones
router.post("/:postId/comments", postController.createComment);
router.get("/:postId/comments/:commentId", postController.getCommentById);
router.post("/:postId/comments/:commentId/reply", postController.addCommentToComment);
router.delete("/:postId/comments/:commentId", postController.deleteComment);

module.exports = router;

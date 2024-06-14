"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  text: { type: String, required: true },
  username:{type: String},
  createdBy: { type: Schema.Types.ObjectId, ref: "User"},//, required: true },
  createdAt: { type: Date, default: Date.now },
});

commentSchema.add({ replies: [commentSchema] }); // Comentarios anidados

//const Comment = mongoose.model("Comment", commentSchema);

const postSchema = new Schema({
  title: { type: String, required: true },
  text: { type: String },
  type: { type: String, enum: ["List", "Normal"], default: "Normal" }, // Tipo de publicación
  listMembers: [{ type: String }], 
  comments: [commentSchema], 
  username:{type: String},
  createdBy: { type: Schema.Types.ObjectId, ref: "User"},//, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;

"use strict";
const { respondError } = require("./resHandler.js");
const { handleError } = require("./errorHandler.js");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const pathStorage = path.join(__dirname, "../../public");
    cb(null, pathStorage);
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split(".").pop();
    const filename = `file-${Date.now()}.${ext}`;
    cb(null, filename);
  },
});

const filterImage = (req, file, cb) => {
  const ext = file.originalname.split(".").pop();
  if (ext === "png" || ext === "jpg" || ext === "jpeg") {
    cb(null, true);
  } else {
    cb(new Error("Formato de imagen no permitido"), false);
  }
};

const filterPdf = (req, file, cb) => {
  const ext = file.originalname.split(".").pop();
  if (ext === "pdf") {
    cb(null, true);
  } else {
    cb(new Error("Formato de archivo no permitido"), false);
  }
};

// middleware para manejar errores de multer
async function handleMulterError(err, req, res, next) {
  try {
    if (err) {
      if (err instanceof multer.MulterError) {
        console.log("Error de multer:", err.message);
        return respondError(
          req,
          res,
          400,
          "Error al subir el archivo",
          err.message,
        );
      } else {
        console.log("Error inesperado:", err.message);
        return respondError(req, res, 500, "Error inesperado", err.message);
      }
    }

    if (!req.file?.filename) {
      return respondError(req, res, 401, "No se ha subido ningún archivo");
    }

    // Si no hay errores, pasar al siguiente middleware o controlador
    next();
  } catch (error) {
    handleError(error, "fileUploadHandler -> handleMulterError");
  }
}

const uploadImage = multer({ storage, fileFilter: filterImage });
const uploadPdf = multer({ storage, fileFilter: filterPdf });
module.exports = { uploadImage, uploadPdf, handleMulterError };

"use strict";
const { respondError } = require("./resHandler.js");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const pathStorage = path.join(__dirname, "../../public/uploads");
    cb(null, pathStorage);
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split(".").pop();
    const filename = `file-${Date.now()}.${ext}`;
    cb(null, filename);
  },
});

const filter = (req, file, cb) => {
  const ext = file.originalname.split(".").pop();
  if (ext === "png" || ext === "jpg" || ext === "jpeg" || ext === "pdf") {
    cb(null, true);
  } else {
    cb(new Error("Formato de archivo no permitido"), false);
  }
};

// middleware para manejar errores de multer
async function handleMulterError(req, res, next) {
  try {
    if (!req.file?.filename) {
      return respondError(req, res, 401, "No se ha subido ningún archivo");
    }

    if (err instanceof multer.MulterError) {
      return res
        .status(400)
        .json({ error: "Error al subir el archivo", message: err.message });
    } else if (err) {
      // Si hay otro tipo de error, pasar al siguiente middleware
      return next(err);
    }
    // Si no hay errores, pasar al siguiente middleware
    next();
  } catch (error) {
    handleError(error, "fileUploadHandler -> handleMulterError");
  }
}

const uploadFile = multer({ storage, fileFilter: filter });
module.exports = { uploadFile, handleMulterError };

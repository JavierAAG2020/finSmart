// Importa el framework express para crear rutas
const express = require('express');
// Importa multer, el middleware especializado para manejar archivos en Express
const multer = require('multer');
// Importa path, que ayuda a manejar rutas y carpetas del sistema de archivos de manera universal (compatible con Windows, Linux, etc)
const path = require('path');
// Importa fs (File System), que sirve para leer la lista de archivos y realizar operaciones básicas sobre el disco duro (leer/cargar archivos, ver cuántos hay, etc)
const fs = require('fs');

const storage = multer.diskStorage({
  // 1. destination: indica la carpeta donde se van a guardar los archivos subidos.
  // Se construye la ruta relativa al archivo actual, llegando a "public/uploads"
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../public/uploads')),
  // 2. filename: nombre que tendrá cada archivo guardado en disco.
  // Le agrega el timestamp y un número aleatorio adelante para que sean únicos
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Quedará tipo: 1715971935234-123456789-foto.png
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage, // Usa la configuración anterior
  limits: { fileSize: 10 * 1024 * 1024 }, // Límite por archivo: 10 MB
  fileFilter: (req, file, cb) => {
    // Solo permite extensiones seguras (puedes editar esta regex)
    const allowed = /jpg|jpeg|png|gif|mp4|avi|mov|txt|pdf|docx|xlsx/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext)) return cb(null, true); // Acepta archivo
    cb(new Error('Tipo de archivo no permitido')); // Rechaza archivo peligroso
  }
});

const router = express.Router();

router.post('/upload', upload.array('files'), (req, res) => {
  // "upload.array('files')" indica que serán múltiples archivos con la clave 'files'
  // req.files trae toda la información de los archivos (nombre, tipo, ruta, etc)
  // Formateamos la respuesta para el frontend
  
  const files = req.files.map(f => ({
    filename: f.filename,           // nombre real en uploads/
    originalname: f.originalname,   // como venía antes del upload
    mimetype: f.mimetype,           // tipo MIME (ej: image/png, video/mp4)
    size: f.size,                   // en bytes
    url: `/uploads/${f.filename}`   // how acceder en el navegador
  }));
  res.json({
    message: 'Archivos subidos correctamente',
    files
  });
});

router.get('/', (req, res) => {
  // Lee la carpeta de archivos de uploads
  fs.readdir(path.join(__dirname, '../public/uploads'), (err, files) => {
    if (err) return res.status(500).json({ error: 'No se pudo leer la carpeta' });
    res.json({ files }); // Devuelve lista de archivos en uploads/
  });
});

// Ruta para descarga forzada de archivos
router.get('/download/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../public/uploads', req.params.filename);
  res.download(filePath); // Fuerza descarga y guarda con nombre original
});

module.exports = router;
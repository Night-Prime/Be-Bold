const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${Date.now()}-${name}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Only images allowed'), false);
};

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter });

router.post('/', auth, adminOnly, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const baseUrl = process.env.API_URL || `${req.protocol}://${req.get('host')}`;
  const url = `${baseUrl}/uploads/${req.file.filename}`;
  res.json({ url, filename: req.file.filename, path: `/uploads/${req.file.filename}` });
});

router.post('/multiple', auth, adminOnly, upload.array('images', 5), (req, res) => {
  const baseUrl = process.env.API_URL || `${req.protocol}://${req.get('host')}`;
  const files = req.files.map(f => ({ url: `${baseUrl}/uploads/${f.filename}`, filename: f.filename, path: `/uploads/${f.filename}` }));
  res.json(files);
});

module.exports = router;

const express = require('express');
const multer = require('multer');
const router = express.Router();
const { getDb } = require('../db');
const db = getDb();

// Set up multer to handle file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});
const upload = multer({ storage: storage });

router.post('/', upload.single('featuredImage'), async (req, res) => {
  const collection = db.collection('posts');

  const data = {
    title: req.body.title,
    featuredImage: req.file ? '/images/' + req.file.filename : null,
    content: req.body.content,
  };
  collection.insertOne(data, (err, result) => {
    if (err) throw err;
    res.send({ message: 'Data inserted successfully' });
  });
});

module.exports = router;

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

router.post('/', upload.array('images'), async (req, res) => {
  try {
    const collection = db.collection('posts');

    const data = {
      title: req.body.title,
      images: req.files.map(file => '/images/' + file.filename),
      content: req.body.content,
    };
    
    const result = await collection.insertOne(data);
    
    res.send({ message: 'Data inserted successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error inserting data' });
  }
});

module.exports = router;

const express = require('express');
const multer = require('multer');
const router = express.Router();
const { getDb } = require('../db');
const cloudinary = require('cloudinary').v2;
const db = getDb();
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up multer to handle file uploads with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'stevenpowers.co.uk', // Optional - set a folder to store the uploaded files in
    allowed_formats: ['jpg', 'png', 'jpeg'], // Optional - set allowed file formats
  },
});

const upload = multer({ storage: storage });

router.post('/', upload.array('images'), async (req, res) => {
  try {
    const collection = db.collection('posts');

    const data = {
      title: req.body.title,
      images: req.files.map(file => file.secure_url),
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

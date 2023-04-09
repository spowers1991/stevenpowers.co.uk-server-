const express = require('express');
const multer = require('multer');
const router = express.Router();
const { getDb } = require('../db');
const db = getDb();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');

dotenv.config();

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
      images: [],
      content: req.body.content,
    };

    // Loop through the uploaded files and upload them to Cloudinary
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path);
      data.images.push(result.secure_url);
    }

    const result = await collection.insertOne(data);
    res.send({ message: 'Data inserted successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error inserting data' });
  }
});

module.exports = router;

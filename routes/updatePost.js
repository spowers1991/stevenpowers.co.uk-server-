const express = require('express');
const multer = require('multer');
const router = express.Router();
const { getDb } = require('../db');
const db = getDb();
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();

const ObjectId = require('mongodb').ObjectId;

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

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post('/', upload.array('images'), async (req, res) => {
  try {
    const { id, title, content, previouslyUploadedImages } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    const collection = db.collection('posts');
    let updateData = { title: title, content: content };

    if (req.files && req.files.length > 0) {
      const newImages = await Promise.all(req.files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path);
        return result.secure_url;
      }));
      updateData.images = previouslyUploadedImages.split(",").concat(newImages).filter(Boolean);
    } else {
      updateData.images = previouslyUploadedImages.split(",").filter(Boolean);
    }

    await collection.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
    res.status(200).json({ message: 'Post updated successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error updating post' });
  }
});

module.exports = router;

const express = require('express');
const multer = require('multer');
const router = express.Router();
const { getDb } = require('../db');
const db = getDb();

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

router.post('/', upload.array('images'), async (req, res) => {
  try {
    const { id, title, content, previouslyUploadedImages } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    const collection = db.collection('posts');
    let updateData = { title: title, content: content };

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => '/images/' + file.filename);
      updateData.images = previouslyUploadedImages.split(",").concat(newImages).filter(Boolean);
    }
    else {
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

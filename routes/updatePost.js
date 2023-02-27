const express = require('express');
const router = express.Router();
const { getDb } = require('../db');
const db = getDb();

const ObjectId = require('mongodb').ObjectId;

router.post('/', async (req, res) => {
  try {
    const { id, title, featuredImage, content } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    await db.collection('posts').updateOne({ _id: new ObjectId(id) }, { $set: { 
      title: title,
      featuredImage: featuredImage,
      content: content
    } });
    res.status(200).json({ message: 'Collections updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating collections' });
  }
});

module.exports = router;
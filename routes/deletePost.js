const express = require('express');
const router = express.Router();
const { getDb } = require('../db');
const db = getDb();

const ObjectId = require('mongodb').ObjectId;

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }
    console.log(id)
    const result = await db.collection('posts').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 1) {
      return res.status(200).json({ message: 'Post deleted successfully' });
    }
    return res.status(404).json({ message: 'Post not found' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting post' });
  }
});

module.exports = router;

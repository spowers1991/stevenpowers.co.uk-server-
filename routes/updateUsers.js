const express = require('express');
const router = express.Router();
const { getDb } = require('../db');
const db = getDb();

const ObjectId = require('mongodb').ObjectId;
// Define API endpoint for updating blog and users collections
router.post('/', async (req, res) => {
  try {
    const { id, response } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    // Update user collection
    await db.collection('users').updateOne({ _id: new ObjectId(id) }, { $set: { account_level: response } });
    res.status(200).json({ message: 'Collections updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating collections' });
  }
});

module.exports = router;
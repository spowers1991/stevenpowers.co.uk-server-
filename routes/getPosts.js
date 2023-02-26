const express = require('express');
const router = express.Router();
const { getDb } = require('../db');
const db = getDb();

router.get('/', (req, res) => {
    const collection = db.collection('posts');
    collection.find({}).toArray((err, posts) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(posts);
      }
    });
  });

module.exports = router;
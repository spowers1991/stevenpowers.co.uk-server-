const express = require('express');
const router = express.Router();
const { getDb } = require('../db');
const db = getDb();

router.post('/', async (req, res) => {
  const collection = db.collection('posts');

  const data = {
    title: req.body.title,
    featuredImage: req.body.featuredImage,
    content: req.body.content,
  };
  collection.insertOne(data, (err, result) => {
    if (err) throw err;
    res.send({ message: 'Data inserted successfully' });
  });
});

module.exports = router;

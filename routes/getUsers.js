const express = require('express');
const router = express.Router();
const { getDb } = require('../db');
const db = getDb();

router.get('/', (req, res) => {
    const collection = db.collection('users');
    collection.find({}).toArray((err, users) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(users);
      }
    });
  });

module.exports = router;
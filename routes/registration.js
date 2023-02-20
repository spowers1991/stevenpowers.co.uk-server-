const express = require('express');
const router = express.Router();
const { getDb } = require('../db');
const db = getDb();
const bcrypt = require('bcryptjs');

router.post('/', async (req, res) => {
  const collection = db.collection('users');
  const existingUser = await collection.findOne({
    $or: [
      { username: req.body.username },
      { email: req.body.email }
    ]
  });
  if (existingUser) {
    return res.status(409).send({ message: 'User already exists' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const data = {
    username: req.body.username,
    password: hashedPassword,
    email: req.body.email,
    account_level: req.body.account_level
  };
  collection.insertOne(data, (err, result) => {
    if (err) throw err;
    res.send({ message: 'Data inserted successfully' });
  });
});

module.exports = router;

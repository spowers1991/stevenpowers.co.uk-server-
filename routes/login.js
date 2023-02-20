const express = require('express');
const router = express.Router();
const { getDb } = require('../db');
const db = getDb();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  // Check if the user exists in the database
  const user = await db.collection('users').findOne({ username });
  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // Check if the password is correct
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // Create a JWT with the user's information as the payload
  const token = jwt.sign({ 
    userId: user._id, 
    username: user.username, 
    account_level: user.account_level 
  }, 'secret');

  res.json({ token });
});

module.exports = router;

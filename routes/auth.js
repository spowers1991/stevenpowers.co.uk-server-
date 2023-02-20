const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: 'Missing authorization token' });
    }
  
    try {
      const decoded = jwt.verify(token, 'secret');
      return res.status(200).json({ message: 'User is authenticated' });
    } catch (err) {
      return res.status(401).json({ message: 'Invalid authorization token' });
    }
  });

module.exports = router;
const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 5000;

const url = 'mongodb+srv://s_powers:VAMOH8UrT6JIfhFw@cluster0.f7eib83.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'blog';
const cors = require('cors');
const jwt = require('jsonwebtoken');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
  if (err) throw err;
  const db = client.db(dbName);
  console.log(`Connected to ${dbName} database`);
  

  app.use(cors());

  app.post('/user', async (req, res) => {
    const collection = db.collection('users');
    const existingUser = await collection.findOne({
      $or: [
        { username: req.body.username },
        { email: req.body.email }
      ]
    });
    if (existingUser) {
      console.log('user with that name already exists')
      return res.status(409).send({ message: 'User already exists' });
    }
    const data = {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      account_level: req.body.account_level
    };
    collection.insertOne(data, (err, result) => {
      if (err) throw err;
      console.log(`Data inserted successfully`);
      res.send({ message: 'Data inserted successfully' });
    });
  });

//login

  app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Check if the user exists in the database
    const user = await db.collection('users').findOne({ username });
    if (!user) {
      console.log(`User not found`);
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Check if the password is correct
  
    const pass = await db.collection('users').findOne({ password });
    if (!pass) {
      console.log(pass)
      console.log(`Password incorrect`);
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Create a JWT with the user's information as the payload
    const token = jwt.sign({ userId: user._id, username: user.username }, 'secret');
    console.log(token)
    res.json({ token });
  });

  // authentication
  app.get('/api/check_auth', (req, res) => {
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


  app.get('/users', (req, res) => {
    const collection = db.collection('users');
    collection.find({}).toArray((err, users) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(users);
      }
    });
  });
  
  // Define API endpoint for updating blog and users collections
  app.post('/update', async (req, res) => {
  try {
    const { id } = req.body;

    // Update user collection
    await db.collection('users').updateOne({ _id: id }, { $set: { account_level: 'approved' } });

    res.status(200).json({ message: 'Collections updated successfully' });
    console.log(id)
  } catch (err) {
    res.status(500).json({ message: 'Error updating collections' });
  }
});


  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
});


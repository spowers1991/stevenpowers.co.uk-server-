const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { connect } = require('./db');

const app = express();
const port = process.env.PORT || 5000; 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
// Add helmet middleware here to set various HTTP headers

// Import routes
const registrationRouter = require('./routes/registration');
const loginRouter = require('./routes/login');
const authRouter = require('./routes/auth');
const getUsersRouter = require('./routes/getUsers');
const updateUsersRouter = require('./routes/updateUsers');

// Use routes
app.use('/user', registrationRouter);
app.use('/login', loginRouter);
app.use('/api/check_auth', authRouter);
app.use('/users', getUsersRouter);
app.use('/update', updateUsersRouter);

// Start the server after connecting to the database
connect().then(() => {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}).catch((error) => {
  console.log(`Error connecting to database: ${error}`);
});

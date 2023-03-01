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
app.use(express.static('public'));
// Import routes
const registrationRouter = require('./routes/registration');
const loginRouter = require('./routes/login');
const authRouter = require('./routes/auth');
const getUsersRouter = require('./routes/getUsers');
const updateUsersRouter = require('./routes/updateUsers');
const createPostsRouter = require('./routes/createPost');
const getPostsRouter = require('./routes/getPosts');
const updatePostRouter = require('./routes/updatePost');
const deletePostRouter = require('./routes/deletePost');

// Use routes
app.use('/user-registration', registrationRouter);
app.use('/login', loginRouter);
app.use('/api/check_auth', authRouter);
app.use('/get-users', getUsersRouter);
app.use('/update-user', updateUsersRouter);
app.use('/create-post', createPostsRouter);
app.use('/get-posts', getPostsRouter);
app.use('/update-post', updatePostRouter);
app.use('/delete-post', deletePostRouter);

// Start the server after connecting to the database
connect().then(() => {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}).catch((error) => {
  console.log(`Error connecting to database: ${error}`);
});

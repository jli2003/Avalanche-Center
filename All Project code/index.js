// *****************************************************
// <!-- Section 1 : Import Dependencies -->
// *****************************************************
const express = require('express'); // To build an application server or API
const app = express();
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt'); //  To hash passwords

// *****************************************************
// <!-- Section 2 : Connect to DB -->
// *****************************************************

// database configuration
const dbConfig = {
  host: 'db', // the database server
  port: 5432, // the database port
  database: process.env.POSTGRES_DB, // the database name
  user: process.env.POSTGRES_USER, // the user account to connect with
  password: process.env.POSTGRES_PASSWORD, // the password of the user account
};

const db = pgp(dbConfig);

// test your database
db.connect()
  .then(obj => {
    console.log('Database connection successful'); // you can view this message in the docker compose logs
    obj.done(); // success, release the connection;
  })
  .catch(error => {
    console.log('ERROR:', error.message || error);
  });

  app.set('view engine', 'ejs'); // set the view engine to EJS
  app.use(bodyParser.json()); // specify the usage of JSON for parsing request body.
  
// initialize session variables
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);



// *****************************************************
// <!-- Section 3: all Api Calls-->
// *****************************************************
  

//new stuff for the initial tests

app.get('/welcome', (req, res) => {
  // res.status(200).redirect(200, '/');
  res.json({status: 200, message: 'Welcome!'});
});

// POST route for user login
app.post('/add_user', async (req, res) => {

  var userqueried = true;

  if (userqueried) {
    res.status(500).json({ message: 'Success', username: req.body.name});
    return;
  }
  res.status(-1).json({ message: 'failed'});
  
});


// #### original needs to be modified ####
// original code for login and register pages

// Define the route for the root path
app.get('/', (req, res) => {
  // Redirect to the register route
  return res.redirect('/register');
});

// Define the route to serve the registration page
app.get('/register', (req, res) => {
  // Render the registration page using EJS templating
  res.render('pages/register.ejs');
});

// Define the POST route for user registration
app.post('/register', async (req, res) => {
  // Hash the password using bcrypt library
  const hash = await bcrypt.hash(req.body.password, 10);


  const query = 'INSERT INTO users (username, password, user_type) VALUES ($1, $2, B\'0\')';
  
  db.none(query, [req.body.username, hash])
    .then(() => {
      res.redirect('/login');
    })
    .catch( (err) => {
      console.log(err);
      res.redirect('/register');
    });
});

// Define the route to serve the login page
app.get('/login', (req, res) => {
  // Render the login page using EJS templating
  res.render('pages/login.ejs');
});

// Define the POST route for user login
app.post('/login', async (req, res) => {
  try {
    const user = await db.oneOrNone('SELECT * FROM users WHERE username = $1', [req.body.username]);

    if (user) {
      // check if password from request matches with password in DB
      const match = await bcrypt.compare(req.body.password, user.password);

      if (match) {
        req.session.user = user;
        req.session.save();

        res.redirect('/home');
      } else {
        res.render('pages/login', { message: "Incorrect username or password." });
      }
    }
  } catch (error) {
    console.error('Error', error);
    res.status(500).render('error', { message: 'Error' });
  }
});


// Route handler for '/logout' endpoint
app.get('/logout', (req, res) => {
  // Destroying session
  req.session.destroy((err) => {
    if (err) {
      // Error handling for session destruction failure
      console.error('Error destroying session:', err);
      return res.status(500).send('Error logging out');
    }

    // Uncomment the line below to clear session cookies
    // res.clearCookie('session_id'); // Replace 'session_id' with your session cookie name

    // Redirecting to the login page after successful logout
    res.redirect('/login');
  });
});

// Authentication Middleware to check if the user is logged in
const auth = (req, res, next) => {
  if (!req.session.user) {
      return res.redirect('/login');
  }
  next();
};

// Apply the authentication middleware to all subsequent routes
app.use(auth);

app.get('/home', async (req, res) => {
  res.render('pages/home.ejs');
    });


// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
module.exports = app.listen(3000);
console.log('Server is listening on port 3000');
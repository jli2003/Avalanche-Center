// *****************************************************
// <!-- Section 1 : Import Dependencies -->
// *****************************************************
const express = require('express'); // To build an application server or API
const app = express();
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session');

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
  //update code with new database

  // TODO: Hash the password using bcrypt library before inserting it into the database
  // const hash = await bcrypt.hash(req.body.password, 10);
  // var query = "insert into users (username, password) values ($1, $2) returning *;";
  // var vals = [
  //     req.body.username,
  //     hash
  // ];

  // Check if the username or password fields are empty
  // if (req.body.password === '' || req.body.username === '') {
  //     console.error("fill out the fields");
  //     return res.render('pages/register.ejs', {message: 'Please fill out the fields'});
  // } else {
  //     // Insert the new user into the database
  //     db.one(query, vals)
  //         .then((data) => {
  //             console.log(data);
  //             // Redirect to the login page upon successful registration
  //             return res.redirect('/login');
  //         })
  //         .catch((err) => {
  //             // Redirect to the login page if there is an error
  //             res.redirect("/login");
  //             console.log(err);
  //         });
  // }
  res.redirect("/login");
});

// Define the route to serve the login page
app.get('/login', (req, res) => {
  // Render the login page using EJS templating
  res.render('pages/login.ejs');
});

// Define the POST route for user login
app.post('/login', async (req, res) => {

  // old code that needs to be updated with new database

  // try {
  //     const { username, password } = req.body;
  //     // Fetch the user from the database
  //     const user = await db.query('SELECT * FROM users WHERE username = $1', [username]);

  //     // If user not found, prompt to register
  //     if (user.length == 0) {
  //         return res.render('pages/register.ejs', {message: 'Username not found'});
  //     }

  //     // Check if the provided password matches the stored hash
  //     const matched = await bcrypt.compare(password, user[0].password);
  //     if (matched) {
  //         // Save user in session and redirect to discover page if the password is correct
  //         req.session.user = user[0];
  //         req.session.save(() => {
  //             res.redirect('/home');
  //         });
  //     } else {
  //         // If the password does not match, display an error message
  //         return res.render('pages/login.ejs', {message: 'Incorrect Username or Password'})
  //     }
  // } catch (error) {
  //     // Handle errors and display an error message
  //     console.error('Error:', error);
  //     res.status(500).send('Error logging in. Please try again.');
  // }
  return res.render('pages/login.ejs', {message: 'Incorrect Username or Password'});
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

// Define the route to serve the discover page with event data
// Route handler for '/discover' endpoint
app.get('/home', async (req, res) => {
  try {
    // Using axios to make a GET request to the Ticketmaster API
    const response = await axios.get('https://app.ticketmaster.com/discovery/v2/events.json', {
      method: 'GET', // Specifying the request method
      dataType: 'json', // Expecting JSON response
      headers: {
        'Accept-Encoding': 'application/json', // Setting header for JSON response
      },
      params: {
        apikey: process.env.API_KEY, // API key from environment variables
        keyword: 'Eagles', // Keyword for event search, can be any artist/event
        size: 10 // Number of events to return, adjustable
      }
    })

    // Logging successful request
    console.log('Worked');
    console.log(response.data._embedded.events[0].dates.start);
    // Uncomment the line below to log the first date of the first event
    // console.log(response.data._embedded.events[0].dates.start[0]);
    
    // Render 'discover.ejs' with events data
    res.render('pages/home.ejs', { results: response.data._embedded.events });

  } catch (error) {
    // Logging and handling errors
    console.error('Error:', error);
    console.log('didnt work');
    
    // Render 'discover.ejs' with an empty results array in case of error
    res.render('pages/home.ejs', { results: [] });
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


// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
module.exports = app.listen(3000);
console.log('Server is listening on port 3000');
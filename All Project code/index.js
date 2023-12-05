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




// Define the route for the root path
app.get('/', async (req, res) => {

  try {
    const hash = await bcrypt.hash("admin", 10); 
    //inserting admin user with user type 1 for admin control
    const query = 'INSERT INTO users (username, password, user_type) VALUES ($1, $2, B\'1\')';
    const values = ['admin', hash];

    await db.none(query, values);

    return res.redirect('/register');
  } catch (error){
    console.error('Error', error);
  }
});

// Define the route to serve the registration page
app.get('/register', (req, res) => {
  res.render('pages/register.ejs');
});

/* Register endpoint
  *Checks if user already exists
  *If doesn't exist, hashes the password
  *Inserts new user and password into the users table
*/
app.post('/register', async (req, res) => {

  const exists = await db.oneOrNone('SELECT * FROM users WHERE username = $1', [req.body.username]);

  if (exists) {
    res.status(400).render('pages/register.ejs', { message: "Username already exists" });
    return;
  }

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
  res.render('pages/login.ejs');
});

/*LOGIN endpoint
  *Checks if user exists in users table
  *If exists, checks if password matches 
  *
*/
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
        res.status(400).render('pages/login', { message: "Incorrect username or password." });
      }
    }
    else
    {
      res.status(400).render('pages/login', {message: "Incorrect username or password."});
    }
  } catch (error) {
    console.error('Error', error);
    res.status(500).render('error', { message: 'Error' });
  }
});

app.delete('/delete_user', async (req, res) => {
  const exists = await db.oneOrNone('SELECT * FROM users WHERE username = $1', [req.body.username]);

  if (!exists) {
    res.status(400).json({ message: "User does not exist" });
    return;
  }

  const query = 'DELETE FROM users WHERE username = $1';

  db.none(query, [req.body.username])
    .then(() => {
      res.status(200).json({ message: "User deleted successfully!" });
    })
    .catch((error) => {
      console.error('Error', error);
    res.status(500).render('error', { message: 'Error' });
    });
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

app.get('/home', async (req, res) => {
  try {
    // Fetch the latest record from the database
    const latestAvyProblem = await db.oneOrNone('SELECT * FROM home_reports ORDER BY report_id DESC LIMIT 1');

    // Render the home page with the fetched data
    res.render('pages/home.ejs', { latestAvyProblem });
  } catch (error) {
    console.error('Error', error);
    res.status(500).render('error', { message: 'Error' });
  }
});


//------------------------------------Features not needing login-------------------------------------










//----------------------^^^^^^^^^^Features not needing login^^^^^^^^^^^----------------





// Authentication Middleware to check if the user is logged in
const userAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
};

// Apply the authentication middleware to all subsequent routes
//TODO: UNCOMMENT WHEN TESTING COMPLETE
// app.use(userAuth);



//------------------------------------Requiring User login------------------------------------






//------------------------------------^^^^^^^^^Requiring User login^^^^^^^^^^^------------------------------------


const adminAuth = (req, res, next) => {
  // Check if the user is logged in
  if (!req.session.user) {
    return res.redirect('/login');
  }

  // Check if the user is an admin (user_type = 1)
  if (req.session.user.user_type !== 1) {
    console.log('User is not an admin');
    return res.redirect('/login');
  }

  next();
};

// Apply the authentication middleware to all subsequent routes
//TODO: UNCOMMENT WHEN TESTING COMPLETE
// app.use(adminAuth);

//------------------------------------Requiring Admin login------------------------------------


app.get('/adminControls', async (req, res) => {
  try {
    // Render the admin controls page
    res.render('pages/adminControls');
  } catch (error) {
    console.error('Error', error);
    res.status(500).render('error', { message: 'Error loading admin controls page' });
  }
});

app.post('/admin/updateHome', async (req, res) => {
  try {
    // Extract form data for updating home page
    const { imagePath, dangerRating, avalancheType, synopsis } = req.body;

    // Add your database query to update the home page
    // Example query:
    await db.none('UPDATE home_reports SET image_path = $1, danger_rating = $2, avalanche_type = $3, synopsis = $4', [imagePath, dangerRating, avalancheType, synopsis]);

    // Redirect to the admin controls page after the update
    res.redirect('/adminControls');
  } catch (error) {
    console.error('Error', error);
    res.status(500).render('error', { message: 'Error' });
  }
});

// Add this route handler to your existing code
app.post('/admin/changeToAdmin', async (req, res) => {
  try {
    // Extract the username to change to admin from the form
    const { username } = req.body;

    // Update the user_type to make the user an admin (Assuming 1 represents admin)
    await db.none('UPDATE users SET user_type = B\'1\' WHERE username = $1', [username]);

    // Redirect to the admin controls page after the update
    res.redirect('/adminControls');
  } catch (error) {
    console.error('Error', error);
    res.status(500).render('error', { message: 'Error' });
  }
});

//------------------------------------^^^^^^^^^Requiring Admin login^^^^^^^^^^^------------------------------------

//------------------------------------^^^^^^^^^    reports     ^^^^^^^^^^^^^-----------------------------------

app.get('/reports', async (req, res) => {
  try {
    // Render the admin controls page
    res.render('pages/reports');
  } catch (error) {
    console.error('Error', error);
    res.status(500).render('error', { message: 'Error loading reports page' });
  }
});

app.post("/reports/add", async (req, res) => {
  try {
    // Extract form data for updating home page
    const { report_id, observations,  date, image_path, location } = req.body;

    // Add your database query to update the home page
    // Example query:
    await db.none('UPDATE user_reports SET report_id = $1, observations = $2, date = $3, image_path = $4, location = $5', [report_id, observations,  date, image_path, location]);

    // Redirect to home page after the update
    res.redirect('/home');
  } catch (error) {
    console.error('Error', error);
    res.status(500).render('error', { message: 'Error' });
  }
});

//------------------------------------^^^^^^^^^    repots     ^^^^^^^^^^^^^-----------------------------------

// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
module.exports = app.listen(3000);
console.log('Server is listening on port 3000');
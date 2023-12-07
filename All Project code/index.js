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
    const exists = await db.oneOrNone('SELECT * FROM users WHERE username = $1', ['admin']);

    
    if (!exists)
    {
      const hash = await bcrypt.hash("admin", 10); 
      //inserting admin user with user type 1 for admin control
      const query = 'INSERT INTO users (username, password, user_type) VALUES ($1, $2, B\'1\')';
      const values = ['admin', hash];
  
      await db.none(query, values);
    }

    return res.redirect('/home');
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
        req.session.user = req.body.username;
        req.session.save();
        req.session.user_type = Number(user.user_type);
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
  const usernameToDelete = req.query.username; 

  if (!usernameToDelete) {
    res.status(400).json({ message: "Username parameter is missing" });
    return;
  }

  const exists = await db.oneOrNone('SELECT * FROM users WHERE username = $1', [usernameToDelete]);

  if (!exists) {
    res.status(400).json({ message: "User does not exist" });
    return;
  }

  const query = 'DELETE FROM users WHERE username = $1';

  db.none(query, [usernameToDelete])
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
    if (req.session.user) {
      return res.render('pages/home.ejs', { latestAvyProblem, loggedin: true });
    }
    res.render('pages/home.ejs', { latestAvyProblem });
  } catch (error) {
    console.error('Error', error);
    res.status(500).render('error', { message: 'Error' });
  }
});

app.get('/Learn', (req, res) => {
  if (req.session.user) {
    return res.render('pages/Learn.ejs', {loggedin: true});
  }
  res.render('pages/Learn.ejs');
});


//------------------------------------Features not needing login-------------------------------------

app.get('/reports', async (req, res) => {
  try {
    // Render the admin controls page
    var query = 'SELECT * FROM users INNER JOIN reports_to_user'+
    ' on users.username = reports_to_user.username FULL JOIN user_reports ON user_reports.report_id = reports_to_user.report_id ORDER BY date DESC;' 
    const reports = await db.any(query);

    if (req.session.user) {
      return res.render('pages/reports', {report_data: reports, loggedin: true});
    }

    res.render('pages/reports', {report_data: reports});
  } catch (error) {
    console.error('Error', error);
    res.status(500).render('error', { message: 'Error loading reports page' });
  }
});








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
app.use(userAuth);



//------------------------------------Requiring User login------------------------------------

app.post("/reports/add", async (req, res) => {
  try {
    // Extract form data for updating home page
    const currusername = req.session.user;
    console.log(currusername);
    const { observations, date, image_path, location } = req.body;

    var variables = [observations, date, image_path, location];
    var query = 'INSERT INTO user_reports (observations, date, image_path, location) VALUES ($1, $2, $3, $4) RETURNING *;';
    
    const addrep = await db.any(query, variables);
    console.log(addrep);

    if (addrep[0].report_id) {
      const serialkey = addrep[0].report_id;
      query = 'INSERT INTO reports_to_user (username, report_id) VALUES ($1, $2) RETURNING *;';
      console.log(await db.any(query, [currusername, serialkey]));
    } 

    // Redirect to reports page after the update
    res.redirect('/reports');

  } catch (error) {
    console.error('Error', error);
    res.status(500).render('error', { message: 'Error', loggedin: true });
  }
});

app.get('/edituser', async (req, res) => {
  try {
    console.log("at edit user");
    // Render the change user page
    const emailq = 'SELECT email FROM users WHERE username = $1 LIMIT 1;';
    const theemail = await db.oneOrNone(emailq, [req.session.user]);
    res.render('pages/edituser.ejs', {username: req.session.user, email: theemail, loggedin: true });
  } catch (error) {
    console.error('Error', error);
    res.status(500).render('error', { message: 'Error loading reports page', loggedin: true });
  }
});


app.post('/updateuser', async (req, res) => {
  try {
    // Extract form data for updating home page
    const currusername = req.session.user;
    const {username, email, password } = req.body;

    var query = '';
    const emailq = 'SELECT email FROM users WHERE username = $1;';
    const theemail = await db.oneOrNone(emailq, [req.session.user]);
    
    if (username && username != '' ) {
      if (username === req.session.user) {
        
        return res.render('pages/edituser.ejs', {username: req.session.user, email: theemail, message: "Username cannot be the same!", loggedin: true });
      }
      //check if the username already exists
      const checkem = await db.any('SELECT * FROM users WHERE username = $1;', [username]);
      if (checkem.length > 0) {
        return res.render('pages/edituser.ejs', {username: req.session.user, email: theemail, message: "Username already exists pls choose another!", loggedin: true });
      }
      if (!(query == '')) {
        query += ', username = $1';
      } else {
        query ='UPDATE users SET username = $1';
      }
    }

    if (email && email != '') {
      if (email == theemail.email) {
        return res.render('pages/edituser.ejs', {username: req.session.user, email: theemail, message: "Email cannot be the same!", loggedin: true });
      }
      if (!(query == '')) {
        query += ', email = $2';
      } else {
        query ='UPDATE users SET email = $2';
      }
    }

    if (password && password != '') {
      if (!(query == '')) {
        query += ', password = $3';
      } else {
        query = 'UPDATE users SET password = $3';
      }
    }

    if (!query || query == '') {
      return res.render('pages/edituser.ejs', {username: req.session.user, email: theemail, message: "Please enter a field!", loggedin: true});
    }
    
    query += ' where username = $4 RETURNING *;';
    console.log(query);

    var bycryppass = await bcrypt.hash(password, 10);

    var added = await db.any(query, [username, email, bycryppass, currusername]);
    console.log(added);

    if (added[0]){
      var mess = "Success!"
      if (username && username != '') {
        req.session.user = username;

        // Optionally, you might want to save the session after modifying it
        req.session.save(err => {
            if (err) {
                // Error handling for session save failure
                console.error('Error saving session:', err);
                return res.status(500).send('Error updating session');
            }

            // Continue with your logic after successfully updating the session
            mess += "\nNew Username: " + req.session.user;
        });
      }

       mess += "\n new email: " + email;
      if (password) {
        mess += "\nSet new password!"
      }
      const emailnew = 'SELECT email FROM users WHERE username = $1 LIMIT 1;';
      const theemailnew = await db.oneOrNone(emailnew, [req.session.user]);
      return res.render('pages/edituser.ejs', {username: req.session.user, email: theemailnew, message: mess, loggedin: true });
    } else {
      return res.render('pages/edituser.ejs', {username: req.session.user, email: theemail, message: "failed!", loggedin: true });
    }

    // Redirect to home page after the update

  } catch (error) {
    console.error('Error', error);
    res.status(500).render('error', { message: 'Error', loggedin: true });
  }
});




//------------------------------------^^^^^^^^^Requiring User login^^^^^^^^^^^------------------------------------



const adminAuth = (req, res, next) => {
  // Check if the user is logged in
 /* console.log('User in adminAuth:', req.session.user);
  console.log('User in TYPE:', req.session.user_type);*/

  if (!req.session.user) {
    return res.redirect('/login');
  }

  // Check if the user is an admin (user_type = 1)
  if (req.session.user_type !== 1) {
    //console.log('User is not an admin');
    return res.redirect('/login');
  }

  next();
};



// Apply the authentication middleware to all subsequent routes
//TODO: UNCOMMENT WHEN TESTING COMPLETE
app.use(adminAuth);

//------------------------------------Requiring Admin login------------------------------------


app.get('/adminControls', async (req, res) => {
  try {
    // Render the admin controls page
    res.render('pages/AdminControls');
  } catch (error) {
    console.error('Error', error);
    res.status(500).render('error', { message: 'Error loading admin controls page' });
  }
});

app.post('/admin/updateHome', async (req, res) => {
  try {
    // Extract form data for inserting into the home page
    const { imagePath, dangerRating, avalancheType, synopsis } = req.body;

    // Add your database query to insert into the home_reports table
    // Example query:
    await db.none('INSERT INTO home_reports (image_path, danger_rating, avalanche_type, synopsis, date) VALUES ($1, $2, $3, $4, NOW())', [imagePath, dangerRating, avalancheType, synopsis]);

    // Redirect to the admin controls page after the insertion
    res.redirect('/adminControls');
  } catch (error) {
    console.error('Error inserting into home_reports:', error.message);
    res.status(500).render('error', { message: 'Error updating home page' });
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


// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
module.exports = app.listen(3000);
console.log('Server is listening on port 3000');
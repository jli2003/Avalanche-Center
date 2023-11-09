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
  
app.get('/welcome', (req, res) => {
  res.status(200).send('success');
  res.json({status: 'success', message: 'Welcome!'});
});

// POST route for user login
app.post('/add_user', async (req, res) => {
  res.status(200).send('success');
// try {
//   const { username, id } = req.body;
//   res.status(200).send('success');
//   return res.render('pages/login.ejs',{message: 'Incorrect Username or Password'});

//   const user = await db.query('SELECT * FROM users WHERE username = $1', [username]);
//   console.log(user);
//   console.log(typeof(user));

//   if (user.length == 0) {
//     // If user not found, redirect to register
//     return res.render('pages/register.ejs',{message: 'Username not found'});
//   }

//   const matched = await bcrypt.compare(password, user[0].password);
//   console.log(matched);

//   if (matched) {
//     // If password matches, save user in session and redirect to /discover
//     req.session.user = user[0];
//     req.session.save(() => {
//       res.redirect('/discover');
//     });
//   } else {
//     // If password does not match, throw an error
//     console.log('Incorrect username or password.');
//     return res.render('pages/login.ejs',{message: 'Incorrect Username or Password'})
//   }
// } catch (error) {
//   console.error('Error:', error);
//   // If the database request fails, send an appropriate message and render the login.ejs page
//   res.status(500).send('Error logging in. Please try again.');
//   // or res.render('login.ejs'); // Render your login page if needed
// }
});

// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
module.exports = app.listen(3000);
console.log('Server is listening on port 3000');
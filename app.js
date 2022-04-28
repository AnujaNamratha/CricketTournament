const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const { engine } = require("express-handlebars");
const path = require("path");

require("dotenv").config();

var app = express();
const port = process.env.PORT || 5000;

// Parsing middleware
// Parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true })); // New

// Parse application/json
app.use(bodyParser.json());
// app.use(express.json()); // New



const routes = require('./server/routes/user');
app.use('/',routes);

// app.use('/auth', require('./server/routes/user'))

// Templating engine
// app.engine('hbs', exphbs({ extname: '.hbs' })); // v5.3.4
// app.set('view engine', 'hbs'); // v5.3.4

// Update to 6.0.X
//template engine
app.engine("hbs", engine({ extname: ".hbs" }));
app.set("view engine", "hbs");


//to use css or other files
const publicDirectory = path.join(__dirname,'./public');
// Static Files
app.use(express.static("public"));


//connection pool
const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

//connect to db
pool.getConnection((err, connection)=>{
    if(err) throw err; //not connected
   console.log("connected to db "+ connection.threadId);
})

app.listen(port, () => console.log("listening to " + port));

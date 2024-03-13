
const express = require('express'); //Import the express dependency
const app = express();              //Instantiate an express app, the main work horse of this server
const port = 5000;                  //Save the port number where your server will be listening

require('dotenv').config()
// console.log(process.env)

const cors = require('cors')


const { Pool } = require('pg')

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL + "?sslmode=require"
})

pool.connect((err) => {
    if (err) {
        console.error('Error @ Connecting to PostgreSQL database: ', err);
        throw err;
    }
    console.log("Connected successfully to PGSQL!");
})



//Idiomatic expression in express to route and respond to a client request
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "1800");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" ); 
    next();
});
app.use(cors())

app.get('/', (req, res) => {        //get requests to the root ("/") will route here


    res.status(200).json({hello: 'hi'})     

});

// app.get('/create', (req, res) => {
//     try {
//     pool.query("CREATE TABLE user (name VARCHAR(255), pass VARCHAR(255));")
//     .then(
//         res.status(200).json({success: 1, message: "Created table."})
//     )
//     .catch(
//         res.status(500).json({success: 0, message: "Couldn't meet request."})
//     )} catch (err) {
//         throw err
//     }
// })

// Define route to create table
app.post('/create', async (req, res) => {
    try {
      // Execute SQL query to create table using pool.query
      await pool.query(`
        CREATE TABLE IF NOT EXISTS account (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        );
      `);
  
      res.send('Table created successfully');
    } catch (error) {
      console.error('Error creating table:', error);
      res.status(500).send('Error creating table');
    }
});

// Express route to add values to the table
// e.g. /account?name=...
app.post('/account', async (req, res) => {
    const { name } = req.query; // Assuming the parameter for name is passed as 'name'
  
    try {
      // Execute SQL query to insert values into the table using pool.query
      const result = await pool.query(`
        INSERT INTO account (name) VALUES ($1)
        RETURNING id, name;
      `, [name]);
  
      // Send back the inserted record
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error adding user:', error);
      res.status(500).send('Error adding user');
    }
});

// Express route to get a specific user by ID
app.get('/account/:id', async (req, res) => {
    const userId = req.params.id;
  
    try {
      // Execute SQL query to fetch the user by ID using pool.query
      const result = await pool.query(`
        SELECT * FROM account WHERE id = $1;
      `, [userId]);
  
      // Check if the user exists
      if (result.rows.length === 0) {
        return res.status(404).send('User not found');
      }
  
      // Send back the user details
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error retrieving user:', error);
      res.status(500).send('Error retrieving user');
    }
});

app.get('/accounts', async (req, res) => {

    try {
        const result = await pool.query("SELECT * FROM account")

        // Check if the user exists
        if (result.rows.length === 0) {
            return res.status(404).send('User not found');
        }
        // Send back the user details
        res.json(result.rows);
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).send('Error retrieving users');
    }
})

app.listen(port, () => {            
    //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`); 
});
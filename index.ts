import { DataSource } from 'typeorm';
import { graphqlHTTP } from 'express-graphql';

const schema = require('./schema/index.ts');
const Accounts = require('./entities/Accounts.ts');

require('dotenv').config()
const cors = require('cors')
const { Pool } = require('pg')
const express = require('express'); //Import the express dependency

const app = express();              //Instantiate an express app, the main work horse of this server
const port = 5000;                  //The port number where the server will is listening

// See environment variables
// console.log(process.env)

// Init PostgreSQL
const dataSource = new DataSource({
  type: "postgres",
  url: process.env.POSTGRES_URL,
  ssl: true,

  logging: true,
  synchronize: false,
  
  entities: [Accounts],
});
dataSource.initialize()


const pool = new Pool({
    connectionString: process.env.POSTGRES_URL + "?sslmode=require"
})

pool.connect((err: any) => {
    if (err) {
        console.error('Error @ Connecting to PostgreSQL database: ', err);
        throw err;
    }
    console.log("Connected successfully to PGSQL!");
})


//CORS
app.use((req: any, res: any, next: any) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "1800");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" ); 
    next();
});
app.use(cors())


//Root route
app.get('/', (req: any, res: any) => {        
    res.status(200).json({hello: 'hi'})     
});

//GraphQL interface
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}))


// Define route to create table
app.post('/create', async (req: any, res: any) => {
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
app.post('/account', async (req: any, res: any) => {
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
app.get('/account/:id', async (req: any, res: any) => {
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

// View all entries
app.get('/accounts', async (req: any, res: any) => {

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
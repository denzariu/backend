
import { DataSource } from 'typeorm';
import { graphqlHTTP } from 'express-graphql';


import { schema } from './schema/index.ts'
import { Accounts } from './entities/Accounts.ts';

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
  synchronize: true, // set to true whenever entities are added / modified(?)
  
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


app.listen(port, () => {            
    //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`); 
});
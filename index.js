
const express = require('express'); //Import the express dependency
const app = express();              //Instantiate an express app, the main work horse of this server
const port = 5000;                  //Save the port number where your server will be listening

require('dotenv').config()
console.log(process.env)

const cors = require('cors')


const { Pool } = require('pg')

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL + "?sslmode=require"
})

pool.connect((err) => {
    if (err) {
        console.error(console.error('Error @ Connecting to PostgreSQL database: ', err));
        return;
    }
    console.log("Connected successfully to PGSQL!");
})

// const { Client } = require('pg');
// const client = new Client({ 
//     user: '',
//     host: '',
//     database: '',
//     password: '',
//     port: '',
// })

// client.connect()
// .then(() => {
//     console.log('Connected to PostgreSQL database!');
// })
// .catch((err) => { 
//     console.error('Error @ Connecting to PostgreSQL database: ', err);
// })

//Idiomatic expression in express to route and respond to a client request
app.use((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "1800");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" ); 
})

app.get('/', (req, res) => {        //get requests to the root ("/") will route here

    // res.setHeader("Access-Control-Allow-Origin", "*")
    // res.setHeader("Access-Control-Allow-Credentials", "true");
    // res.setHeader("Access-Control-Max-Age", "1800");
    // res.setHeader("Access-Control-Allow-Headers", "content-type");
    // res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" ); 

    // client.query('')
    // pool.query('')
    res.status(200).json({hello: 'hi'})
    //res.sendFile('index.html', {root: __dirname});      //server responds by sending the index.html file to the client's browser
                                                        //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile 
});

app.get('/create', (req, res) => {
    pool.query("CREATE TABLE user (name VARCHAR(255), pass VARCHAR(255));").then(
        res.status(200).json({success: 1, message: "Created table."})
    )
    .catch(
        res.status(500).json({success: 0, message: "Couldn't meet request."})
    )
})

app.get('/get', (req, res) => {
    pool.query("SELECT * FROM user").then((rows) =>
        res.status(200).json({success: 1, message: "Showing table.", rows: rows})
    )
    .catch(
        res.status(500).json({success: 0, message: "Couldn't meet request: select."})
    )
})

app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`); 
});
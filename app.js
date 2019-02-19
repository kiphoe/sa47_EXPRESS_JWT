require('dotenv').config()
const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
console.log("API server");
var app = express();
console.log(process.env.MYSQL_SERVER);
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const PORT = process.env.PORT;

//create connection pool
var pool = mysql.createPool({
    host: process.env.MYSQL_SERVER,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    connectionLimit:process.env.MYSQL_CONNECTION
})

//get connection
pool.getConnection((err, conn)=>{
    if(err){
        return;
    }
    //list out the query
    app.get('/users', (req,res)=>{
        conn.query("SELECT * FROM USER", (err, result)=>{
            if(err){
                
                res.status(500).json({errorMessage: "Invalid"});
            }
            console.log(result);
            res.status(200).json(result);
        })
    })

    app.get('/users/:id', (req,res)=>{
        let userId = req.params.id;
        console.log(userId);
        conn.query("SELECT * FROM USER WHERE id=?",[userId], (err, result)=>{
            if(err){
                res.status(500).json({errorMessage: "Invalid"});
            }
            console.log(result);
            res.status(200).json(result);
        })
    })

    app.listen(PORT, ()=>{
        console.log(`API server started ${PORT}`)
    })
})
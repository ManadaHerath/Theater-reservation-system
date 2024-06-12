import express from "express"
import mysql from "mysql2"
import authRoute from "./routes/auth.js"
import movieRoute from "./routes/movies.js"
import theatreRoute from "./routes/theatres.js"
import 'dotenv/config'


const app = express()

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,  
  user: process.env.MYSQL_USER, 
  password: process.env.MYSQL_PASSWORD, 
  database: process.env.MYSQL_DATABASE, 
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10, 
  queueLimit: 0,
  Promise: global.Promise 
});


export const connection = pool.promise();


app.listen(5001,()=>{
    console.log("Server is running on port 5001")
})

// middlewares

app.use("/auth",authRoute)
app.use("/movies",movieRoute)
app.use("/theatres",theatreRoute)




  
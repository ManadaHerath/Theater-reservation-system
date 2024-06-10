import express from "express"
import mysql from "mysql2"
import authRoute from "./routes/auth.js"
import movieRoute from "./routes/movies.js"

const app = express()

const pool = mysql.createPool({
  host: 'localhost',  
  user: 'root', 
  password: 'Arnold@1234', 
  database: 'booking', 
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10, 
  queueLimit: 0,
  Promise: global.Promise 
});

export const connection = pool.promise();
app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})

// middlewares

app.use("/auth",authRoute)
app.use("/movies",movieRoute)




  
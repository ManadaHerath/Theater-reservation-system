import express from "express"
import mysql from "mysql2"
import authRoute from "./routes/auth.js"
import movieRoute from "./routes/movies.js"

const app = express()

const connection = mysql.createConnection({
  host: 'localhost',  
  user: 'root', 
  password: 'Arnold@1234', 
  database: 'booking', 
  port: 3306  
});


connection.connect(err => {
  if (err) {
      return console.error('error connecting: ' + err.stack);
  }
  console.log('connected to server ');

});

app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})

// middlewares

app.use("/auth",authRoute)
app.use("/movies",movieRoute)




  
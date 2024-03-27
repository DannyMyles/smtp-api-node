const express = require("express");
const app = express();
const fs = require("fs");
const connectDB = require("./db/connect");
require("dotenv").config();
const coursesRoutes =  require("./routes/courseRoutes")
const instructorsRoutes =  require("./routes/instructorRoutes")
const studentssRoutes =  require("./routes/studentRoutes")
const cors = require('cors');
const morgan = require("morgan");
const { getCourseStats } = require("./controllers/courseController");
const authRoutes = require("./routes/authRoutes")
const errorHandler = require("./middleware/errorHandler");
// cors whitelist
const whitelist = [
  'http://localhost:5000',
  'http://localhost:4200',
  'http://localhost:3000'
]
const corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin)!== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200 
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('public'));
app.use(morgan('dev'));

// Defined routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1', coursesRoutes)
app.use('/api/v1', getCourseStats)
app.use('/api/v1', instructorsRoutes)
app.use('/api/v1', studentssRoutes)

const port = process.env.PORT || 5000;

// Error handling
app.use(errorHandler());
const server = async () => {
    try {
      await connectDB();
      app.listen(port, console.log(`Server running on Port: ${port}`));
    } catch (error) {
      console.log("");
    }
  };
  server();
  
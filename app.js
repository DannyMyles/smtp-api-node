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
// const errorHandler = require("./middleware/errorHandler");
const corsOptions = require("./config/corsOptions")
const logger = require("./utils/winston")
// cors whitelist

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
// app.use(errorHandler());
const server = async () => {
    try {
      await connectDB();
      app.listen(port, console.log(`Server running on Port: ${port}`));
      logger.info("`Server running on Port: ${port}`")
    } catch (error) {
      logger.error("Error connecting")
      console.log("");
    }
  };
  server();
  
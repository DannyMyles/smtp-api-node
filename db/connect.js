const mongoose = require('mongoose')
require('dotenv').config()
const logger = require("../utils/winston")

const connectDB = async () =>{
    try {
        await mongoose.connect(process.env.DB_URL)
        logger.info("Db Coinnected Successfully!")
        console.log("Db Coinnected Successfully!")
    } catch (error) {
        logger.error("Error connecting to DB!", error)
        console.log("Error connecting to DB!", error)
    }
}

module.exports = connectDB
//This file is responsible for connecting your backend to MongoDB.


const mongoose = require("mongoose");

//  an async function to handle connecting to the MongoDB database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
       // the new URL parser to avoid deprecation warnings
       useNewUrlParser: true,
       // for better server discovery and monitoring
       useUnifiedTopology: true,
    });
    console.log("MongoDB connected: ${conn.connection.host}");
  } catch (error) {
    console.error("Error connecting to database: ${error.message}");
    process.exit(1); // Exit process if connection fails
  }
};

module.exports = connectDB;
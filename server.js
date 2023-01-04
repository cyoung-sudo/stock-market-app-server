//----- Imports
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
const db = require("./db/conn");
const helmet = require("helmet");

//---- Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
 
//----- Connection
app.listen(port, () => {
  db.connect(); // Connect to DB
  console.log(`Server is running on port: ${port}`);
});
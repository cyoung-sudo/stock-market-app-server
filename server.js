//----- Imports
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
const db = require("./db/conn");
const helmet = require("helmet");
// Socket
const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);
const io = new Server(httpServer);

//---- Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());

//----- Routes
app.use(require("./routes/stockData"));
app.use(require("./routes/chartStock"));

//----- Socket events
io.on("connection", socket => {
  console.log(`New connected: ${socket.id}`);
  // Listen for chart updates
  socket.on('chart_updated', () => {
    // Notify other sockets of update
    socket.broadcast.emit('update_chart');
  });
});
 
//----- Connection
httpServer.listen(port, () => {
  db.connect(); // Connect to DB
  console.log(`Server is running on port: ${port}`);
});
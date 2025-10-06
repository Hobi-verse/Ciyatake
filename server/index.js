// Load environment variables FIRST before anything else
require('dotenv').config();

const express = require("express");
const app = express();
const cors = require("cors");

const dataBase = require("./config/dataBase");
const authRoutes = require("./routes/authRoutes");

const PORT = process.env.PORT || 4000; // Backend on port 4000

//middleware - Enable CORS for frontend communication
app.use(cors({
  origin: "http://localhost:5173", // Allow requests from frontend
  credentials: true,
}));
app.use(express.json());

//database connection
dataBase.connect();

//routes
app.use("/api/v1/auth", authRoutes); // Mount authentication routes

//default routes
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "your server is running",
  });
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

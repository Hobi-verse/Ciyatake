const express = require("express");
const app = express();

const dataBase = require("./config/dataBase");
const dotenv = require('dotenv');

dotenv.config({ quiet: true });  // Suppress logs
const PORT = process.env.PORT || 5173;

//middleware
app.use(express.json());

//database connection
dataBase.connect();

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

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();


const taskRoutes = require("./routes/taskRoute"); 
const authRoutes = require("./routes/authroute");




const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/tasks", taskRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Task Manager API is running");
});

// Port
const PORT = process.env.PORT || 5000;

// Database connection + server start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.use("/api/auth", authRoutes);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error(err));

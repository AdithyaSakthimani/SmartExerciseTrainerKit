import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import {authData ,feedbacks } from "./new_database.js"; 

const uri = "mongodb+srv://MidnightGamer:Tester123@cluster0.wqmrn.mongodb.net/ChatSpace?retryWrites=true&w=majority&appName=Cluster0";

const app = express();
const PORT = process.env.PORT || 8001;

app.use(cors());
app.use(bodyParser.json());

const connectDb = async () => {
  try {
    await mongoose.connect(uri); // Removed deprecated options
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("Could not connect to MongoDB Atlas", error);
    process.exit(1);
  }
};

// Signup Route
app.post("/signup", async (req, res) => {
  const { username, password} = req.body;

  if (!username || !password ) {
    return res.status(400).json({ error: "Username, password are required." });
  }

  try {
    // Check if the username already exists
    const existingUser = await authData.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: "Username already exists." });
    }


    const newUser = new authData({ username, password: password });
    const savedUser = await newUser.save();

    res.status(201).json({ message: "User signed up successfully.", user: savedUser });
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ error: "Error signing up." });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  try {
    // Find user by username
    const user = await authData.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Compare the password
    const isMatch = (password === user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    res.status(200).json({ message: "Login successful.", user });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Error logging in." });
  }
});
app.post("/Summary", async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is required." });
  }

  try {
    const summaries = await feedbacks.find({ username:username });
    res.status(200).json(summaries);
  } catch (error) {
    console.error("Error fetching summaries:", error);  // Log the error to the console
    res.status(500).json({ error: "Error fetching workout summaries." });
  }
});

// Start the Server
app.listen(PORT, async () => {
  await connectDb();
  console.log(`Server is running on http://localhost:${PORT}`);
});

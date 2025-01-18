import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import {authData ,feedbacks,goalData,sensorDatas } from "./new_database.js"; 
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
app.post("/addGoal", async (req, res) => {
  const { username, goal } = req.body;

  // Validate inputs
  if (!username || !goal || !goal.exercise || !goal.target || !goal.calories) {
    return res.status(400).json({ error: "Username and valid goal data are required." });
  }

  try {
    // Create a new goal document
    const newGoal = new goalData({
      username: username,
      exerciseName: goal.exercise,
      exerciseCnt: goal.target,
      caloriesToBurn: goal.calories,
      completed: goal.completed || false, // Default to false if not provided
    });

    // Save the new goal to the database
    const savedGoal = await newGoal.save();

    // Respond with the saved goal and its ID
    res.status(201).json({
      message: "Goal added successfully.",
      goalSaved: savedGoal,
      id: savedGoal._id,
    });
  } catch (error) {
    console.error("Error adding goal:", error);
    res.status(500).json({ error: "Error adding goal." });
  }
});
app.post("/UpdateGoal",async(req,res)=>{
  const {id, completed } = req.body ; 
  if (!id || completed === undefined) {
    return res.status(400).json({ error: "ID and completed status are required." });
  }
  try {
    const updatedGoal = await goalData.findByIdAndUpdate(
      id, 
      { completed: completed }, 
      { new: true } 
    );

    if (!updatedGoal) {
      return res.status(404).json({ error: "Goal not found." });
    }

    // Send the updated goal back in the response
    res.status(200).json({
      message: "Goal updated successfully.",
      updatedGoal: updatedGoal, // Send the updated goal
    });
  } catch (error) {
    console.error("Error updating goal:", error);
    res.status(500).json({ error: "Error updating goal." });
  }
})
app.post("/DeleteGoal", async (req, res) => {
  const { id } = req.body; // Get the goal ID from the request body

  if (!id) {
    return res.status(400).json({ error: "ID is required." });
  }

  try {
    // Find the goal by its _id and delete it
    const deletedGoal = await goalData.findByIdAndDelete(id);

    if (!deletedGoal) {
      return res.status(404).json({ error: "Goal not found." });
    }

    // Send a success response
    res.status(200).json({
      message: "Goal deleted successfully.",
      deletedGoal: deletedGoal, // Send the deleted goal (optional)
    });
  } catch (error) {
    console.error("Error deleting goal:", error);
    res.status(500).json({ error: "Error deleting goal." });
  }
});
app.post('/getgoals', async (req, res) => {
  const { username } = req.body; // Get username from request body

  if (!username) {
    return res.status(400).json({ error: "Username is required." });
  }

  try {
    // Fetch goals for the provided username
    const goals = await goalData.find({ username });

    if (goals.length === 0) {
      return res.status(404).json({ message: "No goals found for this username." });
    }

    // Send the goals as response
    res.status(200).json({ goals });
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ error: "Error fetching goals." });
  }
});
app.post('/sendSensorData', async (req, res) => {
  try {
    const { username, duration, temperature, averageHeartBeat, caloriesBurned } = req.body;

    // Validate required fields
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const newSensorData = new sensorDatas({
      username,
      duration: duration || 0,
      temperature: temperature || 0,
      caloriesBurned: caloriesBurned || 0,
      averageHeartBeat: averageHeartBeat || 0,
    });

    const savedData = await newSensorData.save();
    res.status(201).json({ message: 'Sensor data saved successfully', data: savedData });
  } catch (error) {
    console.error('Error saving sensor data:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});
app.post('/getSensorSummary', async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is required." });
  }

  try {
    // Find all sensor data for the given username
    const sensorData = await sensorDatas.find({ username })
      .sort({ _id: -1 }) // Sort by newest first
      .exec();

    if (!sensorData || sensorData.length === 0) {
      return res.status(404).json({ message: "No sensor data found for this user." });
    }

    res.status(200).json({ sensorData });
  } catch (error) {
    console.error('Error fetching sensor data:', error);
    res.status(500).json({ error: "Error fetching sensor data." });
  }
});
let my_globalUsername = '' ; 
app.post('/sendUsername' , async(req,res)=>{
  const {username} = req.body;
  console.log(username) ; 
  my_globalUsername = username ;
})
app.get('/getUsername' , (req,res)=>{
  res.json({username: my_globalUsername});
})
let sensorData = {}; // In-memory storage
app.post('/sensordata', (req, res) => {
  const { temperature, accel_x, accel_y, accel_z, gyro_x, gyro_y, gyro_z,NodemCuData } = req.body;
  sensorData = { temperature, accel_x, accel_y, accel_z, gyro_x, gyro_y, gyro_z, NodemCuData};
  console.log("Received sensor data:", req.body);
  res.send('Data received successfully!');
});

app.get('/getsensordata', (req, res) => {
  // Send the most recent sensor data
  res.json(sensorData);
});

// Start the Server
app.listen(PORT, async () => {
  await connectDb();
  console.log(`Server is running on http://localhost:${PORT}`);
});

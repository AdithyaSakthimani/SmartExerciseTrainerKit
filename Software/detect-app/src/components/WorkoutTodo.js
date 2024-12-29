import React, { useState, useEffect, useContext } from "react";
import "./WorkoutTodo.css";
import NoteContext from "./NoteContext";
import axios from "axios";
function WorkoutTodo() {
  const [goals, setGoals] = useState([]);
  const [exercise, setExercise] = useState("");
  const [target, setTarget] = useState("");
  const [calories, setCalories] = useState("");
  const [completedGoals, setCompletedGoals] = useState(0);
  const{globalUsername} = useContext(NoteContext);
  useEffect(() => {
    const storedGoals = localStorage.getItem("workoutGoals");
    if (storedGoals) {
      const parsedGoals = JSON.parse(storedGoals);
      setGoals(parsedGoals);
      setCompletedGoals(parsedGoals.filter((goal) => goal.completed).length);
    }
  }, []);
  useEffect(() => {
    if (goals.length > 0) {
      localStorage.setItem("workoutGoals", JSON.stringify(goals));
      sendGoals()
    }
  }, [goals]);
  const addGoal = () => {
    if (!exercise || !target || !calories) {
      alert("Please fill in the exercise name, target, and calories!");
      return;
    }
    const newGoal = { exercise, target, calories, completed: false };
    setGoals((prevGoals) => [...prevGoals, newGoal]);
    setExercise("");
    setTarget("");
    setCalories("");
  };

  const toggleCompletion = (index) => {
    const updatedGoals = goals.map((goal, i) =>
      i === index ? { ...goal, completed: !goal.completed } : goal
    );
    setGoals(updatedGoals);
    setCompletedGoals(updatedGoals.filter((goal) => goal.completed).length);
  };

  const removeGoal = async (index) => {
    const updatedGoals = goals.filter((_, i) => i !== index);
    setGoals(updatedGoals);
    setCompletedGoals(updatedGoals.filter((goal) => goal.completed).length);
  };
  

  const progressPercentage =
    goals.length > 0 ? (completedGoals / goals.length) * 100 : 0;

  const sendGoals= async (index)=>{
    try{
    const response = await axios.post('http://localhost:8001/GetGoals', {
      username: globalUsername,
      goals: goals, 
  });
    console.log(response);}
    catch(error){
      console.log("error sending goals " , error);
    }}


  return (
    <div className="goal-main">
      <div className="goal-form">
        <h1 className="calculator-header">Workout Goals</h1>
        <h2>Add a Workout Goal</h2>
        <div className="form-group">
          <label className="val-name">Exercise Name:</label>
          <input
            type="text"
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
            placeholder="Enter exercise (e.g., Push-Ups)"
          />
        </div>
        <div className="form-group">
          <label>Calories To Burn in KCal :</label>
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="Enter target count"
          />
        </div>
        <div className="form-group">
          <label>No of Reps:</label>
          <input
            type="number"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            placeholder="Enter target count"
          />
        </div>
        <button className="calculate-button" onClick={addGoal}>
          Add Goal
        </button>
      </div>

      {goals.length > 0 && (
        <div className="goals">
          <h2 className="my-goal-hed">Your Goals</h2>

          {/* Progress Bar */}
          <div className="progress-container">
            <div
              className="progress-bar"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="progress-label">
            {Math.round(progressPercentage)}% Completed
          </p>

          <ul>
            {goals.map((goal, index) => (
              <li key={index} className="goal-item">
                <div className="new-todo">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={goal.completed}
                  onChange={() => toggleCompletion(index)}
                />
                <span
                  style={{
                    textDecoration: goal.completed ? "line-through" : "none",
                  }}
                >
                  <div className="new-goal">
                    <p>
                      <span className="new-goal-header">{goal.exercise}:</span>{" "}
                      {goal.target} reps
                    </p>
                    <p>
                      <span className="new-goal-header">Calories to burn:</span>{" "}
                      {goal.calories}
                    </p>
                  </div>
                </span>
                <button
                  className="remove-button"
                  onClick={() => removeGoal(index)}
                >
                  Remove
                </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default WorkoutTodo;

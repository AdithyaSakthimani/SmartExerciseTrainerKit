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
  const { globalUsername } = useContext(NoteContext);

  useEffect(() => {
    if (globalUsername) {
      fetchGoals();
    }
  }, [globalUsername]);

  const fetchGoals = async () => {
    try {
      const response = await axios.post(`http://localhost:8001/getgoals`, {
        username: globalUsername,
      });
      setGoals(response.data.goals);
      setCompletedGoals(response.data.goals.filter(goal => goal.completed).length);
    } catch (error) {
      console.log("Error fetching goals:", error);
    }
  };

  const toggleCompletion = async (index) => {
    const updatedGoals = goals.map((goal, i) =>
      i === index ? { ...goal, completed: !goal.completed } : goal
    );

    const updatedGoal = updatedGoals[index];

    try {
      const response = await axios.post('http://localhost:8001/UpdateGoal', {
        id: updatedGoal._id,
        completed: updatedGoal.completed,
      });

      if (response.data.updatedGoal) {
        setGoals(updatedGoals);
        setCompletedGoals(updatedGoals.filter((goal) => goal.completed).length);
      }
    } catch (error) {
      console.error("Error toggling goal completion:", error);
    }
  };

  const removeGoal = async (index) => {
    const goalToRemove = goals[index];

    try {
      const response = await axios.post('http://localhost:8001/DeleteGoal', {
        id: goalToRemove._id,
      });

      if (response.data.deletedGoal) {
        const updatedGoals = goals.filter((_, i) => i !== index);
        setGoals(updatedGoals);
        setCompletedGoals(updatedGoals.filter((goal) => goal.completed).length);
      }
    } catch (error) {
      console.error("Error removing goal:", error);
    }
  };

  const addGoal = async () => {
    const newGoal = {
      exercise: exercise,
      target: target,
      calories: calories,
      completed: false
    };

    try {
      const response = await axios.post('http://localhost:8001/addGoal', {
        username: globalUsername,
        goal: {
          exercise: exercise,
          target: target,
          calories: calories,
          completed: false
        }
      });
      
      if (response.data.goalSaved) {
        const goalWithId = {
          _id: response.data.goalSaved._id,
          exerciseName: response.data.goalSaved.exerciseName,
          exerciseCnt: response.data.goalSaved.exerciseCnt,
          caloriesToBurn: response.data.goalSaved.caloriesToBurn,
          completed: response.data.goalSaved.completed
        };
        setGoals(prevGoals => [...prevGoals, goalWithId]);
        setExercise("");
        setTarget("");
        setCalories("");
      }
    } catch (error) {
      console.log("Error adding goal:", error);
    }
  };

  const progressPercentage = goals.length > 0 ? (completedGoals / goals.length) * 100 : 0;

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
          <label>Calories To Burn in KCal:</label>
          <input
            type="number"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            placeholder="Enter calories to burn"
          />
        </div>
        <div className="form-group">
          <label>No of Reps:</label>
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="Enter target reps"
          />
        </div>
        <button className="calculate-button" onClick={addGoal}>
          Add Goal
        </button>
      </div>

      {goals.length > 0 && (
        <div className="goals">
          <h2 className="my-goal-hed">Your Goals</h2>
          <div className="progress-container">
            <div
              className="progress-bar"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="progress-label">{Math.round(progressPercentage)}% Completed</p>

          <ul>
            {goals.map((goal, index) => (
              <li key={goal._id} className="goal-item">
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
                        <span className="new-goal-header">{goal.exerciseName}:</span> {goal.exerciseCnt} reps
                      </p>
                      <p>
                        <span className="new-goal-header">Calories to burn:</span> {goal.caloriesToBurn}
                      </p>
                    </div>
                  </span>
                  <button className="remove-button" onClick={() => removeGoal(index)}>
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
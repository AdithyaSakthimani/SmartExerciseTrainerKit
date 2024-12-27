import React, { useState, useEffect } from 'react';
import './WorkoutCalculator.css';

function WorkoutCalculator() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [goals, setGoals] = useState([]);
  const [exercise, setExercise] = useState('');
  const [target, setTarget] = useState('');
  const [calories, setCalories] = useState('');

  // Load goals from localStorage when component mounts
  useEffect(() => {
    const storedGoals = localStorage.getItem('workoutGoals');
    if (storedGoals) {
      setGoals(JSON.parse(storedGoals));
    }
  }, []);

  // Save goals to localStorage whenever goals state changes
  useEffect(() => {
    if (goals.length > 0) {
      localStorage.setItem('workoutGoals', JSON.stringify(goals));
    }
  }, [goals]);

  const addGoal = () => {
    if (!exercise || !target || !calories) {
      alert('Please fill in the exercise name, target, and calories!');
      return;
    }
    const newGoal = { exercise, target, calories, completed: false };
    setGoals((prevGoals) => [...prevGoals, newGoal]);
    setExercise('');
    setTarget('');
    setCalories('');
  };

  const toggleCompletion = (index) => {
    const updatedGoals = goals.map((goal, i) =>
      i === index ? { ...goal, completed: !goal.completed } : goal
    );
    setGoals(updatedGoals);
  };

  const removeGoal = (index) => {
    const updatedGoals = goals.filter((_, i) => i !== index);
    setGoals(updatedGoals);
  };

  return (
    <div className='goal-main'>
      <div className="goal-form">
      <h1 className="calculator-header">Workout Goals</h1>
        <h2>Add a Workout Goal</h2>
        <div className="form-group">
          <label>Exercise Name:</label>
          <input
            type="text"
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
            placeholder="Enter exercise (e.g., Push-Ups)"
          />
        </div>
        <div className="form-group">
          <label>Calories To Burn:</label>
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
          <h2 className='my-goal-hed'>Your Goals</h2>
          <ul>
            {goals.map((goal, index) => (
              <li key={index} className="goal-item">
                <span
                  style={{
                    textDecoration: goal.completed ? 'line-through' : 'none',
                  }}
                >
                  <div className='new-goal'>
                    <p><span className='new-goal-header'>{goal.exercise}:</span> {goal.target} reps</p>
                    <p><span className='new-goal-header'>Calories to burn:</span> {goal.calories}</p>
                  </div>
                </span>
                <input
                  type="checkbox"
                  className='checkbox'
                  checked={goal.completed}
                  onChange={() => toggleCompletion(index)}
                />
                <button
                  className="remove-button"
                  onClick={() => removeGoal(index)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default WorkoutCalculator;

import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ExerciseDetector from './components/ExerciseDetector';
import './App.css'; // Import the CSS file

function App() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <div className="exercise-box">
          <h2 className="title">Bicep Curl Counter</h2>
          <ExerciseDetector />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;

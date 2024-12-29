import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import NoteState from './components/NoteState';
import {
  HashRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import Navbar from './components/Navbar';
import FeedbackPage from './components/Feedbackpage';
import WorkoutTodo from './components/WorkoutTodo';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <NoteState>
      <Router>
        {/* Navbar should be outside of Routes to be rendered on all pages */}
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tracker" element={<App />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/Summary" element={<FeedbackPage />} />
          <Route path="/Goals" element={<WorkoutTodo />} />
        </Routes>
      </Router>
    </NoteState>
  </React.StrictMode>
);

reportWebVitals();

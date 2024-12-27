import React, { useState } from 'react';
import './AuthPage.css'; // Add your custom CSS styles
import { Link, useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8001/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }), // Removed `confirmPassword` as it should be checked locally
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Signup successful:", data);
        // Navigate to the login page or another route
        navigate("/login");
      } else {
        alert(data.error || "Error during signup");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("An error occurred while signing up.");
    }
  };

  return (
    <div className="auth-container">
      <section className="auth-section">
        <h1>Sign Up</h1>
        <form onSubmit={handleSignUp}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className="new-cta-button">Sign Up</button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </section>
    </div>
  );
};

export default SignUpPage;
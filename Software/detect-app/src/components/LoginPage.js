import React, { useContext, useState } from 'react';
import './AuthPage.css'; // Add your custom CSS styles
import { Link, useNavigate } from 'react-router-dom';
import NoteContext from './NoteContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const{setLoggedIn,setGLobalUsername} = useContext(NoteContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data);
        setLoggedIn(true);
        const NewUsername = username ; 
        setGLobalUsername(NewUsername);
        navigate("/");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred while logging in.");
    }
  };

  return (
    <div className="auth-container">
      <section className="auth-section">
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="username"
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
          <button type="submit" className="new-cta-button">Login</button>
        </form>
        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </section>
    </div>
  );
};

export default LoginPage;

import React, { useState, useContext } from 'react';
import './HomePage.css';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import NoteContext from './NoteContext';
import myLogo from '../images/pngtree-running-athlete-logo-on-white-paper-vector-png-image_7210846.png'
function Navbar() {
  const { globalUsername, setGLobalUsername } = useContext(NoteContext);
  const navigate = useNavigate(); // Hook to navigate after logout

  // Function to get the first character of the username for the icon
  const getInitials = (name) => {
    return name ? name[0].toUpperCase() : '';
  };

  // Handle logout by clearing the globalUsername and navigating to the login page
  const handleLogout = () => {
    setGLobalUsername(null); // Clear the global username
    navigate('/'); // Redirect to login page
  };

  return (
    <div>
      <header className="header">
        <Link to="/" onClick={()=>window.scrollTo({ top: 0, behavior: 'smooth' })} className="link1">
          <div className='left-items'>
          <img src={myLogo} className='my-logo'/>
          <div className="logo">Elevate Fitness AI</div>
          </div>
        </Link>
        <nav className="navbar">
          {globalUsername ? (
            // If globalUsername is not null, display username with the icon and logout button
            <div className="user-info">
              <div className="logout-button" >
              <button onClick={handleLogout}>
                Logout
                </button>
              </div>
              <div className="user-icon">
                {getInitials(globalUsername)}
              </div>
              <span className="username">{globalUsername}</span>
            </div>
          ) : (
            // If globalUsername is null, show the Login and Sign Up links
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          )}
        </nav>
      </header>
    </div>
  );
}

export default Navbar;

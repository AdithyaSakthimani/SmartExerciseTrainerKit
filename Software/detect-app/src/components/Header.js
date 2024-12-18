import React from 'react';
import { Dumbbell } from 'lucide-react';
import './Header.css'; // Import the CSS file

const Header = () => {
  return (
    <div className="header">
      <div className="container">
        <div className="flex-container">
          <Dumbbell className="icon" />
          <h1 className="title">AI Exercise Counter</h1>
        </div>
      </div>
    </div>
  );
};

export default Header;

import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/games/letters">Znajdź literę</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
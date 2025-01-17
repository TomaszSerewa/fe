import React from 'react';
import { Link } from 'react-router-dom';

const GameCatalog = () => {
  return (
    <div>
      <h1>Game Catalog</h1>
      <p>Here you can find a variety of games for children.</p>
      <ul>
        <li>
          <Link to="/games/letters">Nauka liter</Link>
        </li>
        {/* Add more games here */}
      </ul>
    </div>
  );
};

export default GameCatalog;
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import GameCatalog from './components/GameCatalog';
import LetterGame from './games/LetterGame/LetterGame';
import Navbar from './components/Navbar';
import Header from './components/Header';

const App = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      sessionStorage.setItem('userId', userId);
    } else {
      sessionStorage.removeItem('userId');
    }
  }, [userId]);

  return (
    <>
      <Header setUserId={setUserId} />
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/games" element={<GameCatalog />} />
        <Route path="/games/letters" element={<LetterGame userId={userId} />} />
      </Routes>
    </>
  );
};

export default App;
import React, { useState, useEffect } from 'react';
import './LetterGame.css'; // Importuj plik CSS

const letters = 'AĄBCĆDEĘFGHIJKLŁMNŃOÓPRSŚTUWYZŹŻ'.split('');

const GuestLetterGame = () => {
  const [currentLetter, setCurrentLetter] = useState('');
  const [options, setOptions] = useState([]);
  const [lettersStats, setLettersStats] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const initializeGame = async () => {
      try {
        const storedStats = sessionStorage.getItem('lettersStats');
        if (storedStats) {
          setLettersStats(JSON.parse(storedStats));
        } else {
          const initialStats = letters.reduce((acc, letter) => {
            acc[letter] = { letterStats: 0 };
            return acc;
          }, {});
          setLettersStats(initialStats);
          sessionStorage.setItem('lettersStats', JSON.stringify(initialStats));
        }
        await generateNewQuestion();
      } catch (error) {
        console.error('Error initializing game:', error);
        setError('Failed to initialize game. Please try again later.');
      }
    };

    initializeGame();
  }, []);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const generateNewQuestion = async () => {
    try {
      const storedLetter = sessionStorage.getItem('currentLetter');
      let data;
      if (storedLetter) {
        data = { letterToGuess: storedLetter };
      } else {
        const letterToGuess = letters[Math.floor(Math.random() * letters.length)];
        data = { letterToGuess };
        sessionStorage.setItem('currentLetter', letterToGuess);
      }
      console.log('Fetched next letter:', data);
      setCurrentLetter(data.letterToGuess);
      speak(`Wskaż literę ${data.letterToGuess}`);

      // Generate options excluding the letter to guess
      const optionsSet = new Set();
      while (optionsSet.size < 3) {
        const randomLetter = letters[Math.floor(Math.random() * letters.length)];
        if (randomLetter !== data.letterToGuess) {
          optionsSet.add(randomLetter);
        }
      }
      const optionsArray = Array.from(optionsSet);
      const randomIndex = Math.floor(Math.random() * 4);
      optionsArray.splice(randomIndex, 0, data.letterToGuess); // Insert the letter to guess at a random position
      console.log('Generated options:', optionsArray); // Log the generated options
      setOptions(optionsArray);
    } catch (error) {
      console.error('Error generating new question:', error);
      setError('Failed to generate new question. Please try again later.');
    }
  };

  const handleOptionClick = async (option) => {
    try {
      const updatedStats = { ...lettersStats };

      if (!updatedStats[option]) {
        updatedStats[option] = { letterStats: 0 };
      }
      if (!updatedStats[currentLetter]) {
        updatedStats[currentLetter] = { letterStats: 0 };
      }

      if (option === currentLetter) {
        setMessage('Correct!');
        updatedStats[option].letterStats += 1;
      } else {
        setMessage('Try again!');
        updatedStats[option].letterStats = 0;
        updatedStats[currentLetter].letterStats = 0;
      }

      setLettersStats(updatedStats);
      sessionStorage.setItem('lettersStats', JSON.stringify(updatedStats));
      sessionStorage.removeItem('currentLetter'); // Usuń aktualną literę po odgadnięciu
      await generateNewQuestion(); // Wywołaj generateNewQuestion, aby zaprezentować nowy zestaw liter
    } catch (error) {
      console.error('Error updating letter stats:', error);
      setError('Failed to update letter stats. Please try again later.');
    }
  };

  return (
    <div>
      <h1>Letter Game</h1>
      {error && <p className="error-message">{error}</p>}
      <p>Guess the letter: {currentLetter}</p>
      <button onClick={() => speak(`Wskaż literę ${currentLetter}`)}>Odczytaj polecenie</button>
      <div className="options-container">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option)}
            className="letter-button"
            style={{ backgroundColor: getRandomColor() }}
          >
            {option}
          </button>
        ))}
      </div>
      <button onClick={generateNewQuestion}>Nowa Gra</button>

      {message && <p>{message}</p>}
      <h2>Alfabet</h2>
      <div className="alphabet-container">
        {letters.map(letter => (
          <div key={letter} className="letter-box">
            {letter}: {lettersStats[letter]?.letterStats || 0} punktów
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuestLetterGame;
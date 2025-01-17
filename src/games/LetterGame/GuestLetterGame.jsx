import React, { useState, useEffect } from 'react';
import './LetterGame.css'; // Importuj plik CSS

const letters = 'AĄBCĆDEĘFGHIJKLŁMNŃOÓPRSŚTUWYZŹŻ'.split('');

const GuestLetterGame = () => {
  const [currentLetter, setCurrentLetter] = useState('');
  const [options, setOptions] = useState([]);
  const [lettersStats, setLettersStats] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [voices, setVoices] = useState([]);


  useEffect(() => {
    const loadVoices = async () => {
      return new Promise(async (resolve) => {
        let voices = await speechSynthesis.getVoices();
        if (voices.length !== 0) {
          setVoices(voices);
          self.polishFemaleVoice = voices.find(voice => voice.lang === 'pl-PL' && voice.name.includes('Paulina'));
          resolve();
        } else {
          speechSynthesis.onvoiceschanged = async () => {
            voices = await speechSynthesis.getVoices();
            debugger
            setVoices(voices);
            self.polishFemaleVoice = voices.find(voice => voice.lang === 'pl-PL' && voice.name.includes('Paulina'));
            resolve();
          };
        }
      });
    };

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

    const initialize = async () => {
      await loadVoices();
      await initializeGame();
    };

    initialize();
  }, []);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    if (self.polishFemaleVoice) {
      utterance.voice =  self.polishFemaleVoice;
    }

    utterance.lang = 'pl-PL'; // Ustaw język na polski
    utterance.rate = 0.9; // 10% wolniej niż domyślna prędkość
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

  const renderStars = (points) => {
    if (points === 0) {
      return [];
    }

    const stars = [];
    const fullStars = Math.floor(points / 2);
    const halfStar = points % 2;

    const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'center'];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} className={`star full ${positions[i]}`}>★</span>);
    }

    if (halfStar) {
      stars.push(<span key="half" className={`star half ${positions[fullStars]}`}>☆</span>);
    }

    return stars;
  };

  const handleLetterClick = (letter) => {
    if (letter === 'W'){
      speak(`To jest litera wu`);
      return;
    }
    if (letter === 'Ę'){
      speak(`To jest litera ę`);

      return;
    }
    speak(`To jest litera ${letter}`);
  };

  const handleHelpGameClick = () => {
    speak("Gra polega na wskazaniu litery o którą prosi lektor. Za prawidłowe wskazanie literki otrzymujesz gwiazdki. Zbierz 5 gwiazdek przy każdej literze a zostaniesz mistrzem alfabetu.");
  };

  const handleHelpLettersClick = () => {
    speak("Jeżeli nie poznajesz jakiejś litery kliknij na nią aby ją usłyszeć.");
  };

  const handleGameGoal = (letter) => {
    if (letter === 'W'){
      speak(`Wskaż literę wu`);
      return;
    }
    speak(`Wskaż literę${letter}`);
  };

  return (
    <div>
        <div className="header-container">
        <h1>Letter Game</h1>
        <button className="help-button" onClick={handleHelpGameClick}>
          Pomoc <span role="img" aria-label="help">❓🔊</span>
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
      <div className="button-container">
      <button className="speak-button" onClick={() => handleGameGoal(currentLetter)}>
        Powtórz <span role="img" aria-label="repeat">🔁</span> <span role="img" aria-label="speaker">🔊</span>
        </button>
      </div>
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
      <button className="new-game-button" onClick={generateNewQuestion}>Nowa Gra</button>

      {message && <p>{message}</p>}
      <h2>Alfabet</h2>
      <button className="help-button" onClick={handleHelpLettersClick}>
          Pomoc <span role="img" aria-label="help">❓🔊</span>
        </button>
      <div className="alphabet-container">
        {letters.map(letter => (
          <div key={letter} className="letter-box">
            <button className="letter-square" onClick={() => handleLetterClick(letter)}>{letter}</button>
            <div className="stars-square">{renderStars(lettersStats[letter]?.letterStats || 0)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuestLetterGame;
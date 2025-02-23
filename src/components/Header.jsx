import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../common/api';
import './Header.css'; 

const Header = ({ setUserId }) => {
  const [loginValue, setLoginValue] = useState('');
  const [password, setPassword] = useState('');
  const [registerLogin, setRegisterLogin] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      setLoggedInUser(storedUser);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const data = await login(loginValue, password);
      if (data.error) {
        setErrorMessage(data.error);
      } else {
        setLoggedInUser(loginValue);
        localStorage.setItem('loggedInUser', loginValue);
        localStorage.setItem('userId', data.userId); 
        setUserId(data.userId);
        console.log('Login successful:', data);
      }
    } catch (error) {
      console.error('Login failed:', error);
      setErrorMessage('Błędny login lub hasło');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (registerPassword === confirmPassword) {
      try {
        const data = await register(registerLogin, registerPassword);
        if (data.error) {
          setErrorMessage(data.error);
        } else {
          console.log('Registration successful:', data);
        }
      } catch (error) {
        console.error('Registration failed:', error);
        setErrorMessage('Rejestracja nie powiodła się');
      }
    } else {
      setErrorMessage('Hasła nie są zgodne');
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('userId');
    sessionStorage.removeItem('userId'); 
    setUserId(null);
    navigate('/'); 
  };
  const enableLogin = false;

  function showLoginform(){
    if (enableLogin){
      return (
        <div className="forms">
        {(loggedInUser) ? (
          <div className="welcome">
            <span>Witaj, {loggedInUser}</span>
            <button onClick={handleLogout}>Wyloguj</button>
          </div>
        ) : (
          <>
            <form className="login-form" onSubmit={handleLogin}>
              <div className="form-row">
                <input type="text" value={loginValue} onChange={(e) => setLoginValue(e.target.value)} placeholder="Login" maxLength="20" autoComplete="username" />
                {errorMessage && <div className="error-message">{errorMessage}</div>}
              </div>
              <div className="form-row">
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Hasło" maxLength="20" autoComplete="new-password" />
                <button type="submit">Zaloguj</button>
              </div>
            </form>
            <div className="separator">
              <div className="circle">LUB</div>
            </div>
            <form className="register-form" onSubmit={handleRegister}>
                <input type="text" value={registerLogin} onChange={(e) => setRegisterLogin(e.target.value)} placeholder="Login" maxLength="20" autoComplete="username"/>
                <input type="password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} placeholder="Hasło" maxLength="20" autoComplete="new-password" />
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Potwierdź hasło" maxLength="20" autoComplete="new-password" />
                <button type="submit">Zarejestruj</button>
            </form>
          </>
        )}
      </div>
      );
    }
  }

  const logoLetters = [
    { letter: 'e', color: 'black' },
    { letter: 'd', color: '#dd3434' },
    { letter: 'u', color: 'orange' },
    { letter: 'k', color: 'gold' },
    { letter: 'i', color: '#3cad3c' },
    { letter: 'd', color: '#4c4ce6' },
    { letter: 'o', color: 'indigo' },
    { letter: 's', color: 'violet' },
    { letter: '.', color: 'black' },
    { letter: 'p', color: 'black' },
    { letter: 'l', color: 'black' },
  ];

  const rainbowColors = ['#dd3434', 'orange', 'gold', '#3cad3c', '#4c4ce6', 'indigo', 'violet'];
  const [currentColors, setCurrentColors] = useState(logoLetters);

  useEffect(() => {
    const interval = setInterval(() => {
      const newColor = rainbowColors[Math.floor(Math.random() * rainbowColors.length)];
      setCurrentColors((prevColors) => {
        const newColors = prevColors.map((item, index) => {
          if (index === 0) {
            return { ...item, color: newColor };
          }
          return item;
        });
        return newColors;
      });

      for (let i = 1; i <= 7; i++) {
        setTimeout(() => {
          setCurrentColors((prevColors) => {
            const newColors = prevColors.map((item, index) => {
              if (index === i) {
                return { ...item, color: newColor };
              }
              return item;
            });
            return newColors;
          });

          setTimeout(() => {
            setCurrentColors((prevColors) => {
              const newColors = prevColors.map((item, index) => {
                if (index === i) {
                  return { ...item, color: logoLetters[index].color };
                }
                return item;
              });
              return newColors;
            });
          }, 1000);
        }, i * 1000);
      }

      setTimeout(() => {
        setCurrentColors((prevColors) => {
          const newColors = prevColors.map((item, index) => {
            if (index >= 8 && index <= 10) {
              return { ...item, color: newColor };
            }
            return item;
          });
          return newColors;
        });
      }, 8000);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  function showLogo() {
    return (
      <div className="logo">
        {currentColors.map((item, index) => (
          <span key={index} style={{ color: item.color }}>{item.letter}</span>
        ))}
      </div>
    );
  }

  return (
    <header>
      {showLogo()}
      {showLoginform()}
    </header>
  );
};

export default Header;
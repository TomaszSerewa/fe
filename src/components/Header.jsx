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
        localStorage.setItem('userId', data.userId); // Zakładam, że API zwraca userId
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
    sessionStorage.removeItem('userId'); // Usuń userId z sessionStorage
    setUserId(null);
    navigate('/'); // Przekierowanie na stronę główną
  };

  return (
    <header>
      <div className="logo">
        <span style={{ color: 'red' }}>e</span>
        <span style={{ color: 'orange' }}>d</span>
        <span style={{ color: 'yellow' }}>u</span>
        <span style={{ color: 'green' }}>k</span>
        <span style={{ color: 'blue' }}>i</span>
        <span style={{ color: 'indigo' }}>d</span>
        <span style={{ color: 'violet' }}>o</span>
        <span style={{ color: 'red' }}>s</span>
        <span style={{ color: 'orange' }}>.</span>
        <span style={{ color: 'yellow' }}>p</span>
        <span style={{ color: 'green' }}>l</span>
      </div>
      <div className="forms">
        {loggedInUser ? (
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
              <div className="form-row">
                <input type="text" value={registerLogin} onChange={(e) => setRegisterLogin(e.target.value)} placeholder="Login" maxLength="20" autoComplete="username"/>
                <button type="submit">Zarejestruj</button>
              </div>
              <div className="form-row">
                <input type="password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} placeholder="Hasło" maxLength="20" autoComplete="new-password" />
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Potwierdź hasło" maxLength="20" autoComplete="new-password" />
              </div>
            </form>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
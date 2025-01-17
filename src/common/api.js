import config from './config';

export const register = async (login, password) => {
  try {
    console.log('Register data:', { login, password }); // Logowanie danych
    const response = await fetch(`${config.backendUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ login, password }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
};

export const login = async (login, password) => {
  try {
    console.log('Login data:', { login, password }); // Logowanie danych
    const response = await fetch(`${config.backendUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ login, password }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const getLettersStats = async (userId) => {
  try {
    console.log('Get letters stats for user');
    const response = await fetch(`${config.backendUrl}/letters/${userId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching letters stats:', error);
    throw error;
  }
};

export const updateLettersStats = async (userId, lettersStats) => {
  try {
    const response = await fetch(`${config.backendUrl}/letters/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lettersStats }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating letters stats:', error);
    throw error;
  }
};

export const getNextLetter = async (userId) => {
  try {
    const response = await fetch(`${config.backendUrl}/letters/next/${userId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching next letter:', error);
    throw error;
  }
};
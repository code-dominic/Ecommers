import { useState } from 'react';

export default function UseToken() {

  const getToken = () => {
    const tokenString = localStorage.getItem('token');
    const userToken = tokenString;
    console.log(tokenString)
    return userToken
  };

  const [token, setToken] = useState(getToken());

  const saveToken = userToken => {
    localStorage.setItem('token', userToken);
    setToken(userToken);
  };

  return {
    setToken: saveToken,
    token
  }
}
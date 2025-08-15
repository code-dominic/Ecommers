import { useState } from 'react';

export default function UseToken() {

  const getToken = () => {
  const tokenString = localStorage.getItem("token");
  if (!tokenString || tokenString === "null") return null;
  return tokenString;
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
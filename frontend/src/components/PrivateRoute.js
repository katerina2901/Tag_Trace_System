import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './Login';

const PrivateRoute = ({ children }) => {
  const auth = useAuth();

  // Ваш метод проверки аутентификации здесь
  const isAuthenticated = !!auth.email; // Пример проверки, если email присутствует, значит пользователь аутентифицирован

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;

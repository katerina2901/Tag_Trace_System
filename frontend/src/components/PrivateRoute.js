import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';

const PrivateRoute = ({ children }) => {
    const auth = getAuth();
    const [user, loading, error] = useAuthState(auth);
    
    console.log(auth);
    console.log(user, loading, error);
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    if (error) {
      return <div>Error: {error.message}</div>;
    }
  
    return user ? children : <Navigate to="/login" />;
  };
  
  export default PrivateRoute;

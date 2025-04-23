// app/context/AuthProvider.js
import React, { createContext, useContext } from 'react';
import useAuth from '../../hooks/useAuth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { session, loading } = useAuth();

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);

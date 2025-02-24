/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie'; 
import { request } from '../Service/axios_helper';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);  // Etat pour stocker l'utilisateur
  const [role, setRole] = useState(null); 

  // Fonction pour décoder le token JWT
  const decodeToken = (token) => {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  };

  // Fonction pour se connecter et stocker le token
  const login = (token, rememberMe) => {
    if (rememberMe) {
      Cookies.set('token', token, { expires: 7 });
    } else {
      sessionStorage.setItem('token', token); 
    }
    const decodedUser = decodeToken(token); // Décoder le token
    setUser(decodedUser);
    setRole(decodedUser.role); // Utiliser decodedUser au lieu de user
  };

  // Fonction pour se déconnecter
  const logout = () => {
    Cookies.remove('token');
    sessionStorage.removeItem('token');
    setUser(null);
  };

  // Fonction pour rafraîchir le token
  const refreshToken = async () => {
    try {
      const token = sessionStorage.getItem('token') || Cookies.get('token');
      const response = await request('post', '/auth/refresh', { token }, null);
      if (response.data.token) {
        const decodedUser = decodeToken(response.data.token);
        setUser(decodedUser);
        setRole(decodedUser.role);
      }
    } catch (error) {
      logout(); // Déconnexion si l'opération échoue
    }
  };

  // Vérifie l'utilisateur à chaque ouverture de la page
  useEffect(() => {
    const token = sessionStorage.getItem('token') || Cookies.get('token');
    if (token) {
      const decodedUser = decodeToken(token);
      setUser(decodedUser);  // Décode et met à jour l'utilisateur
      setRole(decodedUser.role); 
    }
  }, []); 

  // Rafraîchissement du token toutes les 15 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      refreshToken();
    }, 15 * 60 * 1000);

    return () => clearInterval(interval);  // Nettoyage
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, login,logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour accéder au contexte
export const useAuth = () => {
  return useContext(AuthContext);
};

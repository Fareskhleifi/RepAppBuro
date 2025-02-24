/* eslint-disable react/prop-types */
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = ({ allowedRoles, children }) => {
  const { user, role } = useAuth();

  if(user)
  {
    if (!allowedRoles.includes(role)) {
      return <Navigate to="/dashboard" />;
    }
  }
  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;

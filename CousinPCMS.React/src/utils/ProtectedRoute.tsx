// src/routes/ProtectedRoute.tsx
import {useUser} from '../hook/useUser';
import {Navigate} from 'react-router';
import {JSX} from 'react/jsx-runtime';

const ProtectedRoute = ({children}: {children: JSX.Element}) => {
  const {validUser} = useUser();

  if (!validUser) {
    return <Navigate to="/404" replace />;
  }

  return children;
};

export default ProtectedRoute;

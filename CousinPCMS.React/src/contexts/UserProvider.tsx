import {useState} from 'react';
import {UserContext} from './UserContext';
import {ValidUser} from '../models/generalModel';

export type UserContextType = {
  validUser: ValidUser | null;
  setValidUser: (user: ValidUser) => void;
};

const getInitialUser = (): ValidUser | null => {
  const storedUser = sessionStorage.getItem('valid-user');
  try {
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (e) {
    console.error('Error parsing user from sessionStorage', e);
    return null;
  }
};

export const UserProvider = ({children}: {children: React.ReactNode}) => {
  const [validUser, setValidUserState] = useState<ValidUser | null>(getInitialUser());

  const setValidUser = (user: ValidUser) => {
    setValidUserState(user);
    sessionStorage.setItem('valid-user', JSON.stringify(user));
  };

  return <UserContext.Provider value={{validUser, setValidUser}}>{children}</UserContext.Provider>;
};

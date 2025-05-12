import {createContext} from 'react';
import {UserContextType} from './UserProvider';

export const UserContext = createContext<UserContextType | undefined>(undefined);

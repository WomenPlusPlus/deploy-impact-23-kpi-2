import { IdTokenClaims } from '@azure/msal-browser';
import { createContext } from 'react';
import { User } from '../types';

export const loginUserLocalstorageItemKey = 'loginUser';

export const AzureUserContext = createContext<IdTokenClaims>(null!);

interface UserContextType {
  user: User;
  setUser: (user: User) => void;
}

export const UserContext = createContext<UserContextType>(null!);
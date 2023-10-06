import { IdTokenClaims } from '@azure/msal-browser';
import { createContext } from 'react';

export const UserContext = createContext<IdTokenClaims>(null!);

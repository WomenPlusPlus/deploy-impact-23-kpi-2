/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { MsalProvider } from '@azure/msal-react';

import { IPublicClientApplication } from '@azure/msal-browser';
import { useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import { getDesignTokens } from './styles';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import UserLogin from './page/UserLogin';
import MainLayout from './page/MainLayout';

const router = createBrowserRouter([
  {
    path: '',
    element: <MainLayout />,
  },
  {
    path: '/login',
    element: <UserLogin />,
  },
]);

/**
 * msal-react is built on the React context API and all parts of your app that require authentication must be
 * wrapped in the MsalProvider component. You will first need to initialize an instance of PublicClientApplication
 * then pass this to MsalProvider as a prop. All components underneath MsalProvider will have access to the
 * PublicClientApplication instance via context as well as all hooks and components provided by msal-react. For more, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
 */
const App = ({ instance }: { instance: IPublicClientApplication }) => {
  const theme = useMemo(() => createTheme(getDesignTokens('light')), []);

  return (
    <ThemeProvider theme={theme}>
      <MsalProvider instance={instance}>
        <RouterProvider router={router} />
      </MsalProvider>
    </ThemeProvider>
  );
};

export default App;

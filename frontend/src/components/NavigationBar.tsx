import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from '@azure/msal-react';
import { loginRequest } from '../authConfig';
import {
  Avatar,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { useState } from 'react';

export const NavigationBar = () => {
  const { instance } = useMsal();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  let activeAccount;

  if (instance) {
    activeAccount = instance.getActiveAccount();
  }

  const handleLoginPopup = () => {
    /**
     * When using popup and silent APIs, we recommend setting the redirectUri to a blank page or a page
     * that does not implement MSAL. Keep in mind that all redirect routes must be registered with the application
     * For more information, please follow this link: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/login-user.md#redirecturi-considerations
     */
    instance
      .loginPopup({
        ...loginRequest,
        redirectUri: '/redirect',
      })
      .catch(error => console.log(error));
  };

  const handleLoginRedirect = () => {
    instance.loginRedirect(loginRequest).catch(error => console.log(error));
  };

  const handleLogoutPopup = () => {
    instance
      .logoutPopup({
        mainWindowRedirectUri: '/', // redirects the top level app after logout
        account: instance.getActiveAccount(),
      })
      .catch(error => console.log(error));
  };

  const handleLogoutRedirect = () => {
    instance.logoutRedirect().catch(error => console.log(error));
  };

  /**
   * Most applications will need to conditionally render certain components based on whether a user is signed in or not.
   * msal-react provides 2 easy ways to do this. AuthenticatedTemplate and UnauthenticatedTemplate components will
   * only render their children if a user is authenticated or unauthenticated, respectively.
   */
  return (
    <nav>
      <a href="/">Microsoft identity platform</a>
      <AuthenticatedTemplate>
        <IconButton onClick={e => setAnchorEl(e.currentTarget)}>
          <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
          <Typography>
            {activeAccount ? activeAccount.name : 'Unknown'}
          </Typography>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={() => setAnchorEl(null)}
          onClick={() => setAnchorEl(null)}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleLogoutPopup}>
            <Avatar /> pop up logout
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogoutRedirect}>
            <Avatar /> redirect logout
          </MenuItem>
        </Menu>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Button onClick={e => setAnchorEl(e.currentTarget)}>Log In</Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={() => setAnchorEl(null)}
          onClick={() => setAnchorEl(null)}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleLoginPopup}>
            <Avatar /> pop up login
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLoginRedirect}>
            <Avatar /> redirect login
          </MenuItem>
        </Menu>
      </UnauthenticatedTemplate>
    </nav>
  );
};

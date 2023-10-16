import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from '@azure/msal-react';
import { loginRequest } from '../authConfig';
import {
  AppBar,
  Avatar,
  Button,
  Divider,
  Menu,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { routes } from '../utils/route';

export const NavigationBar = ({ page }: { page: number }) => {
  const { instance } = useMsal();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

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

  // const handleLoginRedirect = () => {
  //   instance.loginRedirect(loginRequest).catch(error => console.log(error));
  // };

  const handleLogoutPopup = () => {
    instance
      .logoutPopup({
        mainWindowRedirectUri: '/login', // redirects after logout
        account: instance.getActiveAccount(),
      })
      .catch(error => console.log(error));
  };

  // const handleLogoutRedirect = () => {
  //   instance.logoutRedirect().catch(error => console.log(error));
  // };

  const handleChangePage = (page: number) => {
    if (0 <= page && page < routes.tab.length) {
      navigate(`/${routes.tab[page]}`);
    }
  };

  /**
   * Most applications will need to conditionally render certain components based on whether a user is signed in or not.
   * msal-react provides 2 easy ways to do this. AuthenticatedTemplate and UnauthenticatedTemplate components will
   * only render their children if a user is authenticated or unauthenticated, respectively.
   */
  return (
    <AppBar
      elevation={0}
      sx={{ background: 'white' }}
    >
      <Toolbar>
        <Tabs
          value={page}
          onChange={(_, newPage) => handleChangePage(newPage)}
          sx={{ ml: '48px', flexGrow: 1 }}
        >
          <Tab label="KPI Overview" />
          <Tab label="Activity" />
          <Tab label="GateKeeper Tools" />
        </Tabs>
        <Stack
          direction={'row'}
          columnGap={'48px'}
          mr={'48px'}
          flexGrow={0}
        >
          <AuthenticatedTemplate>
            <Button
              onClick={e => setAnchorEl(e.currentTarget)}
              variant="text"
              sx={{ p: '8px 0px' }}
            >
              <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
              <Typography>
                {activeAccount ? activeAccount.name : 'Unknown'}
              </Typography>
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={() => setAnchorEl(null)}
              onClick={() => setAnchorEl(null)}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleLogoutPopup}>pop up logout</MenuItem>
              <Divider />
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
              <MenuItem onClick={handleLoginPopup}>pop up login</MenuItem>
              <Divider />
            </Menu>
          </UnauthenticatedTemplate>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

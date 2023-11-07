import { useMsal } from '@azure/msal-react';
import {
  AppBar,
  Avatar,
  Button,
  Menu,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { headerTabRoutes } from '../utils/route';
import { UserContext, loginUserLocalstorageItemKey } from '../utils/context';
import { userGetApi } from '../services/userService';
import { UserProfile } from '../types';
import { autoLoginAfterExpire } from '../utils';
import InsertKpiDrawer from './InsertKpiDrawer';

export const NavigationBar = ({ page }: { page: number }) => {
  const { instance } = useMsal();
  const { user, setUser } = useContext(UserContext);
  const [userProfile, setUserProfile] = useState<UserProfile>();
  const [userActionMenuOpen, setUserActionMenuOpen] =
    useState<null | HTMLElement>(null);
  const open = Boolean(userActionMenuOpen);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.id < 0) return;
    userGetApi(user.id, user.token)
      .then(res => {
        setUserProfile(res.user);
      })
      .catch(err => {
        if (err.response.status === 401)
          autoLoginAfterExpire(user, setUser).catch(err => navigate('/login'));
        else console.log(err);
      });
  }, [user, setUser, navigate]);

  // const handleLoginRedirect = () => {
  //   instance.loginRedirect(loginRequest).catch(error => console.log(error));
  // };

  const handleLogoutPopup = () => {
    if (user.email === 'test@test.com' || user.email === 'martin@test.com') {
      setUser({ email: '', token: '', id: -1, isGatekeeper: false });
      localStorage.removeItem(loginUserLocalstorageItemKey);
      navigate('/login');
      return;
    }
    instance
      .logoutPopup({
        mainWindowRedirectUri: '/login', // redirects after logout
        account: instance.getActiveAccount(),
      })
      .then(() => {
        setUser({ email: '', token: '', id: -1, isGatekeeper: false });
        localStorage.removeItem(loginUserLocalstorageItemKey);
      })
      .catch(error => console.log(error));
  };

  // const handleLogoutRedirect = () => {
  //   instance.logoutRedirect().catch(error => console.log(error));
  // };

  const handleChangePage = (page: number) => {
    if (0 <= page && page < headerTabRoutes.tab.length) {
      navigate(`/${headerTabRoutes.tab[page]}`);
    }
  };

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
          {user.isGatekeeper && <Tab label="GateKeeper Tools" />}
        </Tabs>
        <Stack
          direction={'row'}
          columnGap={'24px'}
          mr={'48px'}
          flexGrow={0}
          alignItems={'center'}
        >
          <InsertKpiDrawer />
          <Button
            onClick={e => setUserActionMenuOpen(e.currentTarget)}
            variant="text"
            sx={{ p: '8px 0px' }}
          >
            <Avatar
              sx={{ width: 32, height: 32 }}
              alt={userProfile ? userProfile.first_name : 'Unknown'}
              src="/not-supported.jpg"
            />
            <Typography
              fontSize={'14px'}
              fontWeight={400}
            >
              {userProfile ? userProfile.display_name : 'Unknown'}
            </Typography>
          </Button>
          <Menu
            anchorEl={userActionMenuOpen}
            open={open}
            onClose={() => setUserActionMenuOpen(null)}
            onClick={() => setUserActionMenuOpen(null)}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem>Profile settings</MenuItem>
            <MenuItem
              onClick={handleLogoutPopup}
              sx={{ color: '#D63503' }}
            >
              Sign out
            </MenuItem>
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

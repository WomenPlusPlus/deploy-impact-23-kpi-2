import { useMsal } from '@azure/msal-react';
import { AppBar, Button, Stack, Toolbar, Typography } from '@mui/material';
import { ReactComponent as MicrosoftLogoSVG } from '../assets/Microsoft_logo.svg';
import { loginRequest } from '../authConfig';
import { ReactComponent as LogoSVG } from '../assets/Logo.svg';
import { useNavigate } from 'react-router-dom';
import { userLoginApi } from '../services/userService';
import { useContext } from 'react';
import { UserContext, loginUserLocalstorageItemKey } from '../utils/context';

const styles = {
  toolbar: {
    marginTop: '48px',
    marginBottom: '56px',
  },
};

const UserLogin = () => {
  /**
   * useMsal is a hook that returns the PublicClientApplication instance.
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/hooks.md
   */
  const { instance } = useMsal();
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

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
      .then(_ => navigate('/'))
      .catch(err => {
        console.error(err);
        setUser({ email: '', token: '', id: -1, isGatekeeper: false });
        localStorage.removeItem(loginUserLocalstorageItemKey);
        navigate('/login');
      });
  };

  const mockLoginGatekeeper = () => {
    userLoginApi('martin@test.com')
      .then(res => {
        const loginUser = {
          id: res.user.id,
          email: 'martin@test.com',
          token: res.access_token,
          isGatekeeper: true,
        };
        setUser(loginUser);
        localStorage.setItem(
          loginUserLocalstorageItemKey,
          JSON.stringify(loginUser)
        );
        navigate('/');
      })
      .catch(err => {
        console.log(err);
      });
  };

  const mockLoginEconomist = () => {
    userLoginApi('test@test.com')
      .then(res => {
        const loginUser = {
          id: res.user.id,
          email: 'test@test.com',
          token: res.access_token,
          isGatekeeper: false,
        };
        setUser(loginUser);
        localStorage.setItem(
          loginUserLocalstorageItemKey,
          JSON.stringify(loginUser)
        );
        navigate('/');
      })
      .catch(err => {
        console.log(err);
      });
  };

  /**
   * Most applications will need to conditionally render certain components based on whether a user is signed in or not.
   * msal-react provides 2 easy ways to do this. AuthenticatedTemplate and UnauthenticatedTemplate components will
   * only render their children if a user is authenticated or unauthenticated, respectively. For more, visit:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
   */
  return (
    <>
      <AppBar
        elevation={0}
        sx={{ background: 'white' }}
      >
        <Toolbar sx={styles.toolbar}>
          <Typography
            ml={'264px'}
            fontSize={'24px'}
            fontWeight={500}
          >
            KPI Dashboard
          </Typography>
        </Toolbar>
        <LogoSVG style={{ position: 'absolute', left: '48px' }} />
      </AppBar>
      <Toolbar sx={styles.toolbar} />
      <Stack
        pl={'264px'}
        rowGap={'40px'}
        alignItems={'flex-start'}
      >
        <Typography
          mt={'40px'}
          fontSize={'32px'}
          fontWeight={600}
        >
          Welcome
        </Typography>
        <Button
          variant="outlined"
          onClick={handleLoginPopup}
        >
          <MicrosoftLogoSVG style={{ marginRight: '4px' }} />
          Sign in with Microsoft
        </Button>
        <Button
          variant="outlined"
          onClick={mockLoginGatekeeper}
        >
          Test sign in as Gatekeeper
        </Button>
        <Button
          variant="outlined"
          onClick={mockLoginEconomist}
        >
          Test sign in as Economist
        </Button>
      </Stack>
    </>
  );
};
export default UserLogin;

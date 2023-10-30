import { Box, Toolbar } from '@mui/material';
import { NavigationBar } from '../components/NavigationBar';
import { useContext, useEffect, useRef, useState } from 'react';
import GatekeeperLayout from './GatekeeperTools/GatekeeperLayout';
import { useNavigate, useOutlet, useParams } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import { headerTabRoutes } from '../utils/route';
import Overview from './Overview';
import { UserContext, loginUserLocalstorageItemKey } from '../utils/context';
import { userLoginApi } from '../services/userService';
import Activity from './Activity';

const MainLayout = () => {
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const { instance } = useMsal();
  const { user, setUser } = useContext(UserContext);
  const { tabId } = useParams();
  const isGatekeeperDashboard = useOutlet();
  const initializing = useRef(false);

  useEffect(() => {
    if (initializing.current) return;
    if (user.id < 0) {
      initializing.current = true;
      const userItem = localStorage.getItem(loginUserLocalstorageItemKey);
      if (!userItem) {
        const activeAccount = instance.getActiveAccount();
        if (!activeAccount) {
          navigate('/login');
        } else {
          userLoginApi(activeAccount.username)
            .then(res => {
              const loginUser = {
                id: res.user.id,
                email: activeAccount.username,
                token: res.access_token,
                isGatekeeper: res.user.is_gatekeeper,
              };
              setUser(loginUser);
              localStorage.setItem(
                loginUserLocalstorageItemKey,
                JSON.stringify(loginUser)
              );
              initializing.current = false;
            })
            .catch(() => {
              navigate('/login');
            });
        }
      } else {
        setUser(JSON.parse(userItem));
        initializing.current = false;
      }
    }
    const pageNumber = headerTabRoutes.tab.indexOf(tabId ?? '');
    setPage(pageNumber >= 0 ? pageNumber : 0);
  }, [instance, navigate, tabId, user.id, setUser]);

  return (
    <>
      <NavigationBar page={page} />
      <Toolbar />
      <Box p={'40px 48px'}>
        {page === 0 && <Overview />}
        {page === 1 && <Activity />}
        {page === 2 && user.isGatekeeper && (
          <GatekeeperLayout isDashboard={!isGatekeeperDashboard} />
        )}
      </Box>
    </>
  );
};

export default MainLayout;

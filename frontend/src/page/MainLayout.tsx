import { Box, Toolbar } from '@mui/material';
import { NavigationBar } from '../components/NavigationBar';
import { useEffect, useState } from 'react';
import Overview from './Overview';
import GatekeeperLayout from './GatekeeperLayout';
import { useNavigate, useOutlet, useParams } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import { routes } from '../utils/route';

const MainLayout = () => {
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const { instance } = useMsal();
  const { tabId } = useParams();
  const isGatekeeperDashboard = useOutlet();

  useEffect(() => {
    if (!instance.getActiveAccount()) {
      navigate('/login');
    }
    const pageNumber = routes.tab.indexOf(tabId ?? '');
    setPage(pageNumber >= 0 ? pageNumber : 0);
  }, [instance, navigate, tabId]);

  return (
    <>
      <NavigationBar page={page} />
      <Toolbar />
      <Box p={'40px 48px'}>
        {page === 0 && <Overview />}
        {page === 1 && <></>}
        {page === 2 && (
          <GatekeeperLayout isDashboard={!isGatekeeperDashboard} />
        )}
      </Box>
    </>
  );
};

export default MainLayout;

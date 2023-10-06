import { Toolbar } from '@mui/material';
import { NavigationBar } from '../components/NavigationBar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <>
      <NavigationBar />
      <Toolbar />
      <Outlet />
    </>
  );
};

export default MainLayout;

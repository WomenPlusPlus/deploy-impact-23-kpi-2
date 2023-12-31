import {
  Breadcrumbs,
  Button,
  Grid,
  Stack,
  SxProps,
  Typography,
} from '@mui/material';
import { globalStyles } from '../../styles';
import { ReactComponent as KPIOverviewIcon } from '../../assets/KPIOverview.svg';
import { ReactComponent as CreateNewKPIIcon } from '../../assets/Document-add.svg';
import { ReactComponent as CircleIcon } from '../../assets/Pencil-circle.svg';
import { ReactComponent as UserIcon } from '../../assets/Users.svg';
import { Outlet, useNavigate } from 'react-router-dom';
import { headerTabRoutes } from '../../utils/route';

const styles: Record<string, SxProps> = {
  container: {
    p: '16px',
    // display: 'flex',
  },
  containerTitle: {
    fontSize: '18px',
    fontWeight: 500,
    mb: '32px',
  },
  button: {
    p: '24px',
    border: '1px solid var(--gray-600, #ABA8A3)',
    rowGap: '16px',
    flexDirection: 'column',
    flex: '1 0 0',
  },
};

const GatekeeperLayout = ({ isDashboard }: { isDashboard: boolean }) => {
  const navigate = useNavigate();

  return (
    <Stack rowGap={'48px'}>
      {isDashboard ? (
        <>
          <Breadcrumbs>
            [
            <Typography sx={globalStyles.pageTitle}>
              Gatekeeper Tools
            </Typography>
            ]
          </Breadcrumbs>
          <Grid
            container
            columnSpacing={'32px'}
            marginLeft={'-16px'}
          >
            <Grid
              item
              md={6}
              sx={styles.container}
            >
              <Typography sx={styles.containerTitle}>KPI Management</Typography>
              <Stack
                direction={'row'}
                columnGap={'32px'}
              >
                <Button
                  variant="outlined"
                  sx={styles.button}
                  onClick={() =>
                    navigate(`/${headerTabRoutes.tab[2]}/kpi/overview`)
                  }
                >
                  <KPIOverviewIcon />
                  KPI Overview
                </Button>
                <Button
                  variant="outlined"
                  sx={styles.button}
                  onClick={() =>
                    navigate(`/${headerTabRoutes.tab[2]}/kpi/create`)
                  }
                >
                  <CreateNewKPIIcon />
                  Create New KPI
                </Button>
              </Stack>
            </Grid>
            <Grid
              item
              md={3}
              sx={styles.container}
            >
              <Typography sx={styles.containerTitle}>
                Circle Management
              </Typography>
              <Stack
                direction={'row'}
                columnGap={'32px'}
              >
                <Button
                  variant="outlined"
                  sx={styles.button}
                >
                  <CircleIcon />
                  Circle Overview
                </Button>
              </Stack>
            </Grid>
            <Grid
              item
              md={3}
              sx={styles.container}
            >
              <Typography sx={styles.containerTitle}>
                User Management
              </Typography>
              <Stack
                direction={'row'}
                columnGap={'32px'}
              >
                <Button
                  variant="outlined"
                  sx={styles.button}
                >
                  <UserIcon />
                  User Overview
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </>
      ) : (
        <Outlet />
      )}
    </Stack>
  );
};

export default GatekeeperLayout;

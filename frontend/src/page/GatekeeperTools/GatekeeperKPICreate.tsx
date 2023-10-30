import {
  Breadcrumbs,
  Button,
  Dialog,
  DialogContent,
  Stack,
  Typography,
} from '@mui/material';
import { globalStyles } from '../../styles';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Link, useNavigate } from 'react-router-dom';
import { headerTabRoutes } from '../../utils/route';
import { ReactComponent as SuccessIcon } from '../../assets/Check-circle.svg';
import { useContext, useEffect, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Circle, Kpi, dummyKpi } from '../../types';
import { UserContext } from '../../utils/context';
import { circleGetAllApi } from '../../services/circleService';
import { kpiAddApi } from '../../services/kpiService';
import GatekeeperKpiForm from '../../components/GatekeeperKpiForm';

const GatekeeperKPICreate = () => {
  const { user } = useContext(UserContext);
  const [createKPIsuccess, setCreateKPIsuccess] = useState(false);
  const navigate = useNavigate();
  const [kpiAdd, setKpiAdd] = useState<Kpi>(dummyKpi);
  const [circles, setCircles] = useState<Circle[]>();

  useEffect(() => {
    if (user.id < 0) return;
    if (!circles) {
      circleGetAllApi(user.token)
        .then(res => setCircles(res.circles))
        .catch(err => console.error(err));
    }
  }, [circles, user]);

  const submitCreateKPI = () => {
    kpiAddApi(kpiAdd, user.token)
      .then(res => {
        setCreateKPIsuccess(true);
      })
      .catch(err => console.error(err));
  };

  return (
    <>
      <Stack rowGap={'48px'}>
        <Breadcrumbs separator={<NavigateNextIcon sx={{ fontSize: '24px' }} />}>
          [
          <Link
            to={`/${headerTabRoutes.tab[2]}`}
            style={globalStyles.pageHistory}
          >
            Gatekeeper Tools
          </Link>
          ,<Typography sx={globalStyles.pageTitle}>Create new KPI</Typography>]
        </Breadcrumbs>
        <GatekeeperKpiForm
          kpi={kpiAdd}
          setKpi={setKpiAdd}
          submit={submitCreateKPI}
        />
      </Stack>
      <Dialog
        open={createKPIsuccess}
        onClose={() => setCreateKPIsuccess(false)}
      >
        <DialogContent>
          <SuccessIcon />
          <Typography
            sx={{ fontSize: '16px', fontWeight: 400, height: '48px' }}
          >
            New KPI created successfully
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate(-1)}
          >
            <ArrowBackIcon />
            Go back to Gatekeeper Tools
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GatekeeperKPICreate;

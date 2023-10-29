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
import { Link, useNavigate, useParams } from 'react-router-dom';
import { headerTabRoutes } from '../../utils/route';
import { useContext, useEffect, useState } from 'react';
import { ReactComponent as SuccessIcon } from '../../assets/Check-circle.svg';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { UserContext } from '../../utils/context';
import { kpiEditApi, kpiGetApi } from '../../services/kpiService';
import { Kpi, dummyKpi } from '../../types';
import GatekeeperKpiForm from '../../components/GatekeeperKpiForm';

const GatekeeperKPIEdit = () => {
  const { user } = useContext(UserContext);
  const [kpiEdit, setKpiEdit] = useState<Kpi>(dummyKpi);
  const [saveKpiSuccess, setSaveKpiSuccess] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (!id || Number.isNaN(Number(id)) || user.id < 0) return;
    if (!user.isGatekeeper) navigate('/');
    kpiGetApi(Number(id), user.token)
      .then(res => {
        setKpiEdit(res.kpi);
      })
      .catch(err => console.error(err));
  }, [id, navigate, user]);

  const submitSaveKpi = () => {
    kpiEditApi(kpiEdit, user.token)
      .then(res => {
        setSaveKpiSuccess(true);
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
          ,
          <Link
            to={`/${headerTabRoutes.tab[2]}/kpi/overview`}
            style={globalStyles.pageHistory}
          >
            Edit KPI
          </Link>
          ,<Typography sx={globalStyles.pageTitle}>{kpiEdit.name}</Typography>]
        </Breadcrumbs>
        <GatekeeperKpiForm
          kpi={kpiEdit}
          setKpi={setKpiEdit}
          submit={submitSaveKpi}
        />
      </Stack>
      <Dialog
        open={saveKpiSuccess}
        onClose={() => setSaveKpiSuccess(false)}
      >
        <DialogContent>
          <SuccessIcon />
          <Typography
            sx={{ fontSize: '16px', fontWeight: 400, height: '48px' }}
          >
            {kpiEdit.name} KPI edited successfully
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

export default GatekeeperKPIEdit;

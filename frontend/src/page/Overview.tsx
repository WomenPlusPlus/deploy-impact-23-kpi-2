import {
  Button,
  FormLabel,
  Grid,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { globalStyles } from '../styles';
import { ReactComponent as SaveIcon } from '../assets/Save.svg';
import EconomistKpiOverviewTable from '../components/EconomistKpiOverviewTable';
import { FormControl } from '@mui/base';
import { useContext, useEffect, useMemo, useState } from 'react';
import { circleGetAllApi } from '../services/circleService';
import { UserContext } from '../utils/context';
import { Circle, Kpi, KpiOverviewRow } from '../types';
import { kpiValueSearchApi } from '../services/kpiValueService';
import { kpiGetAllApi } from '../services/kpiService';
import dayjs from 'dayjs';
import { autoLoginAfterExpire } from '../utils';
import { useNavigate } from 'react-router-dom';
import GatekeeperKpiOverviewTable from '../components/GatekeeperKpiOverviewTable';
import PerformanceLineAllCircles from '../components/Graphs/PerformanceLineAllCircles';
import ProgressBarAllCircles from '../components/Graphs/ProgressBarAllCircles';
import ProgressCircularAllCircles from '../components/Graphs/ProgressCircularAllCircles';
import ProgressDonutAllCircles from '../components/Graphs/ProgressDonutAllCircles';
import ProgressStreamAllCircles from '../components/Graphs/ProgressStreamAllCircles';
import ProgressRadialAllCircles from '../components/Graphs/ProgressRadialAllCircles';
import KpiCumulative from '../components/Graphs/KpiCumulative';
import ProgressBarHR from '../components/Graphs/ProgressBarHR';
import ProgressDonutHR from '../components/Graphs/ProgressDonutHR';
import ProgressCircularHR from '../components/Graphs/ProgressCircularHR';
import ProgressRadialHR from '../components/Graphs/ProgressRadialHR';

const Overview = () => {
  const { user, setUser } = useContext(UserContext);
  const [circleSelected, setCircleSelected] = useState(1);
  const [periodSelected, setPeriodSelected] = useState('this_year');
  const [circles, setCircles] = useState<Circle[]>();
  const [kpis, setKpis] = useState<Kpi[]>();
  const displayYear = useMemo(() => {
    if (periodSelected === 'last_year') return dayjs().year() - 1;
    else return dayjs().year();
  }, [periodSelected]);
  const [kpiTableRows, setKpiTableRows] = useState<KpiOverviewRow[]>([]);
  const [graphOpen, setGraphOpen] = useState(false);
  const [progressOpen, setProgressOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.id < 0) return;
    if (!circles) {
      circleGetAllApi(user.token)
        .then(res => setCircles(res.circles))
        .catch(err => {
          if (err.response.status === 401)
            autoLoginAfterExpire(user, setUser).catch(err =>
              navigate('/login')
            );
          else console.log(err);
        });
    }
    if (!kpis) {
      kpiGetAllApi(user.token)
        .then(res => setKpis(res.kpi_list))
        .catch(err => {
          if (err.response.status === 401)
            autoLoginAfterExpire(user, setUser).catch(err =>
              navigate('/login')
            );
          else console.log(err);
        });
    }
    if (circles && kpis) {
      submitKpiValueSearch();
    }
    // eslint-disable-next-line
  }, [user, circles, kpis]);

  const submitKpiValueSearch = async () => {
    kpiValueSearchApi(circleSelected, periodSelected, user.token)
      .then(res => {
        let rows: KpiOverviewRow[] = [];
        if (res.KPI_Values) {
          for (let kpiValue of res.KPI_Values) {
            const index = rows.findIndex(row => row.id === kpiValue.kpi_id);
            if (index < 0) {
              const kpi = kpis!.find(item => item.id === kpiValue.kpi_id)!;
              rows.push({
                id: kpiValue.kpi_id,
                kpiName: kpi.name,
                kpi: {
                  ...kpi,
                  circle_name: circles!.find(item => item.id === kpi.circle_id)!
                    .name,
                },
                kpiTarget: kpi.target_value,
                kpiCreatedAt: '',
              });
              Object.defineProperty(
                rows[rows.length - 1],
                `kpiPeriod${kpiValue.period_month - 1}`,
                { value: kpiValue.value }
              );
              Object.defineProperty(
                rows[rows.length - 1],
                `kpiPeriod${kpiValue.period_month - 1}Id`,
                { value: kpiValue.id }
              );
            } else {
              Object.defineProperty(
                rows[index],
                `kpiPeriod${kpiValue.period_month - 1}`,
                { value: kpiValue.value }
              );
              Object.defineProperty(
                rows[index],
                `kpiPeriod${kpiValue.period_month - 1}Id`,
                { value: kpiValue.id }
              );
            }
          }
        }
        setKpiTableRows(rows);
      })
      .catch(err => console.error(err));
  };

  return (
    <Stack rowGap={'32px'}>
      <Typography sx={globalStyles.pageTitle}>KPI Overview</Typography>
      <Stack direction={'row'}>
        <Stack
          direction={'row'}
          columnGap={'24px'}
          alignItems={'center'}
          flexGrow={1}
        >
          <FormControl style={{ display: 'flex' }}>
            <FormLabel sx={{ padding: '8px 12px', fontWeight: 400 }}>
              Circle
            </FormLabel>
            {circles && (
              <TextField
                select
                variant="standard"
                sx={{ width: '184px' }}
                value={circleSelected}
                onChange={e => setCircleSelected(Number(e.target.value))}
              >
                {circles.map(circle => (
                  <MenuItem
                    key={circle.id}
                    value={circle.id}
                  >
                    {circle.name}
                  </MenuItem>
                ))}
                <MenuItem value={-1}>All</MenuItem>
              </TextField>
            )}
          </FormControl>
          <FormControl style={{ display: 'flex' }}>
            <FormLabel sx={{ padding: '8px 12px', fontWeight: 400 }}>
              Period
            </FormLabel>
            <TextField
              select
              variant="standard"
              sx={{ width: '184px' }}
              value={periodSelected}
              onChange={e => setPeriodSelected(e.target.value)}
            >
              <MenuItem value="this_month">this month</MenuItem>
              <MenuItem value="last_month">last month</MenuItem>
              <MenuItem value="this_quarter">this quarter</MenuItem>
              <MenuItem value="last_quarter">last quarter</MenuItem>
              <MenuItem value="this_year">this year</MenuItem>
              <MenuItem value="last_year">last year</MenuItem>
            </TextField>
          </FormControl>
          <Button
            variant="outlined"
            sx={globalStyles.buttonTinySize}
            onClick={submitKpiValueSearch}
          >
            <SaveIcon />
            Apply Filters
          </Button>
        </Stack>
        <FormControl style={{ display: 'flex' }}>
          <FormLabel sx={{ padding: '8px 12px', fontWeight: 400 }}>
            Graphs
          </FormLabel>
          <Switch
            value={graphOpen}
            onChange={e => setGraphOpen(e.target.checked)}
          />
        </FormControl>
        {!user.isGatekeeper && (
          <FormControl style={{ display: 'flex' }}>
            <FormLabel sx={{ padding: '8px 12px', fontWeight: 400 }}>
              Progress
            </FormLabel>
            <Switch
              value={progressOpen}
              onChange={e => setProgressOpen(e.target.checked)}
            />
          </FormControl>
        )}
      </Stack>
      {graphOpen && !user.isGatekeeper && (
        <Grid container>
          {kpiTableRows.map(() => (
            <Grid
              item
              xs={4}
            >
              <KpiCumulative />
            </Grid>
          ))}
        </Grid>
      )}
      {progressOpen && !user.isGatekeeper && (
        <Grid container>
          <Grid
            item
            xs={3}
          >
            <ProgressDonutHR />
          </Grid>
          <Grid
            item
            xs={3}
          >
            <ProgressCircularHR />
          </Grid>
          <Grid
            item
            xs={3}
          >
            <ProgressBarHR />
          </Grid>
          <Grid
            item
            xs={3}
          >
            <ProgressRadialHR />
          </Grid>
        </Grid>
      )}
      {graphOpen && user.isGatekeeper && (
        <Grid container spacing={'32px'}>
          <Grid
            item
            xs={4}
          >
            <ProgressStreamAllCircles />
          </Grid>
          <Grid
            item
            xs={4}
          >
            <ProgressBarAllCircles />
          </Grid>
          <Grid
            item
            xs={4}
          >
            <ProgressCircularAllCircles />
          </Grid>
          <Grid
            item
            xs={4}
          >
            <ProgressRadialAllCircles />
          </Grid>
          <Grid
            item
            xs={4}
          >
            <PerformanceLineAllCircles />
          </Grid>
          <Grid
            item
            xs={4}
          >
            <ProgressDonutAllCircles />
          </Grid>
        </Grid>
      )}
      {user.isGatekeeper ? (
        <GatekeeperKpiOverviewTable rows={kpiTableRows} />
      ) : (
        <EconomistKpiOverviewTable
          rows={kpiTableRows}
          year={displayYear}
        />
      )}
    </Stack>
  );
};

export default Overview;

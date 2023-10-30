import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useContext, useEffect, useState } from 'react';
import { Circle } from '../types';
import { UserContext } from '../utils/context';
import { circleGetAllApi } from '../services/circleService';
import { autoLoginAfterExpire } from '../utils';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as SaveIcon } from '../assets/Save.svg';
import {
  Button,
  FormControl,
  FormLabel,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { globalStyles } from '../styles';
import { kpiValueChangelogSearchApi } from '../services/kpiValueService';
import dayjs from 'dayjs';

interface ActivityRow {
  id: number;
  date: string;
  user: string;
  circle: string;
  activityType: 'Created' | 'Updated';
  kpiName: string;
  kpiValue: number;
  kpiPeriodMonth: number;
  kpiPeriodYear: number;
  kpiPeriod: string;
}

const Activity = () => {
  const { user, setUser } = useContext(UserContext);
  const [circleSelected, setCircleSelected] = useState(1);
  const [periodSelected, setPeriodSelected] = useState('this_month');
  const [circles, setCircles] = useState<Circle[]>();
  const [rows, setRows] = useState<ActivityRow[]>([]);
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
    if (circles) {
      submitChangelogSearch();
    }
    // eslint-disable-next-line
  }, [user, circles, navigate, setUser]);

  const submitChangelogSearch = () => {
    kpiValueChangelogSearchApi(circleSelected, periodSelected, user.token)
      .then(res => {
        let rows: ActivityRow[] = [],
          index = 0;
        if (res.change_log) {
          for (let changeLog of res.change_log) {
            rows.push({
              id: index,
              date: dayjs(changeLog.registered_at).format('DD.MM.YYYY'),
              user: changeLog.username,
              kpiName: changeLog.kpi_name,
              kpiValue: changeLog.value,
              activityType: changeLog.activity,
              kpiPeriod: '',
              kpiPeriodMonth: 0,
              kpiPeriodYear: 0,
            } as ActivityRow);
            index += 1;
          }
        }
        setRows(rows);
      })
      .catch(err => console.error(err));
  };

  const columns: GridColDef[] = [
    {
      field: 'date',
      headerName: 'Date',
      headerClassName: '-first-column-header',
      width: 120,
    },
    {
      field: 'user',
      headerName: 'User',
      width: 268,
    },
    {
      field: 'circle',
      headerName: 'Circle',
      valueGetter: () => {
        return circles!.find(circle => circle.id === circleSelected)!.name;
      },
      width: 120,
    },
    {
      field: 'activity',
      headerName: 'Activity',
      valueGetter: (params: GridValueGetterParams) => {
        const row = rows.find(row => row.id === params.id);
        if (!row) return '';
        switch (row.activityType) {
          case 'Created':
            return 'New Value';
          case 'Updated':
            return 'Edit Value';
        }
      },
      width: 120,
    },
    {
      field: 'kpiName',
      headerName: 'KPI Name',
      width: 268,
    },
    {
      field: 'kpiValue',
      headerName: 'Value',
      headerClassName: '-end-column',
      cellClassName: '-end-column',
      width: 120,
    },
    {
      field: 'kpiPeriod',
      headerName: 'Period',
      headerClassName: '-end-column',
      cellClassName: '-end-column',
      width: 120,
    },
  ];

  return (
    <Stack rowGap={'32px'}>
      <Typography sx={globalStyles.pageTitle}>Activity</Typography>
      <Stack
        direction={'row'}
        columnGap={'24px'}
        alignItems={'center'}
      >
        <FormControl style={{ display: 'flex', flexDirection: 'row' }}>
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
            </TextField>
          )}
        </FormControl>
        <FormControl style={{ display: 'flex', flexDirection: 'row' }}>
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
          </TextField>
        </FormControl>
        <Button
          variant="outlined"
          sx={globalStyles.buttonTinySize}
          onClick={submitChangelogSearch}
        >
          <SaveIcon />
          Apply Filters
        </Button>
      </Stack>
      <DataGrid
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        disableColumnFilter
        disableColumnMenu
        hideFooter
        rowHeight={44}
        columnHeaderHeight={44}
        sx={{
          maxHeight: '70vh',
          borderWidth: '0px',
          borderBottom: '1px solid var(--sunglow-600, #FBBB21)',
          borderTop: '1px solid var(--sunglow-600, #FBBB21)',
          '.MuiDataGrid-columnHeaders': {
            borderBottom: '1px solid var(--sunglow-600, #FBBB21)',
          },
          '.MuiDataGrid-columnHeader': {
            py: '10px',
            borderRight: '1px solid var(--sunglow-600, #FBBB21)',
          },
          '.MuiDataGrid-columnSeparator': {
            display: 'none',
          },
          '.MuiDataGrid-cell': {
            px: '8px',
            justifyContent: 'flex-start',
            alignItems: 'center',
          },
          '.-action-column:focus': {
            outline: 'unset',
          },
          '.-action-column:focus-within': {
            outline: 'unset',
          },
          '& .-end-column': {
            justifyContent: 'flex-end',
          },
          '& .-first-column-header': {
            justifyContent: 'flex-start',
            borderLeft: '1px solid var(--sunglow-600, #FBBB21)',
          },
        }}
      />
    </Stack>
  );
};

export default Activity;

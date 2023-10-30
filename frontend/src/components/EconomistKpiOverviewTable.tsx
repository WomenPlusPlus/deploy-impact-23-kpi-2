import {
  Button,
  Dialog,
  DialogContent,
  Divider,
  Drawer,
  FormControl,
  FormLabel,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from '@mui/x-data-grid';
import { ReactComponent as EditIcon } from '../assets/Pencil-alt.svg';
import { useContext, useEffect, useRef, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { ReactComponent as CancelIcon } from '../assets/X-circle.svg';
import { ReactComponent as SaveIcon } from '../assets/Save.svg';
import { DatePicker } from '@mui/x-date-pickers';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { globalStyles } from '../styles';
import Tooltip from './Tooltip';
import { ReactComponent as SuccessIcon } from '../assets/Check-circle.svg';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  AggregatedKpi,
  KpiOverviewRow,
  dummyKpi,
  dummyKpiValue,
} from '../types';
import dayjs from 'dayjs';
import { checkUnitValidity, isPeriod } from '../utils';
import {
  kpiValueAddApi,
  kpiValueChangelogGetApi,
  kpiValueEditApi,
} from '../services/kpiValueService';
import { UserContext } from '../utils/context';

interface ChangelogRecord {
  id: number;
  kpi_value_id: number;
  user_id: number;
  registered_at: string;
  activity: 'Created' | 'Updated';
}

interface Changelog {
  id: number;
  kpiValue: number;
  userName: string;
  timestamp: string;
  activity: string;
}

const EconomistKpiOverviewTable = ({
  rows,
  year,
}: {
  rows: KpiOverviewRow[];
  year: number;
}) => {
  const { user } = useContext(UserContext);
  const [editKPI, setEditKPI] = useState<AggregatedKpi>({
    kpi: dummyKpi,
    value: dummyKpiValue,
  });
  const [saveKpiSuccess, setSaveKpiSuccess] = useState(false);
  const [invalidDate, setInvalidDate] = useState(false);
  const [kpiValueChangelog, setKpiValueChangelog] = useState<Changelog[]>([]);
  const tableRef = useRef<HTMLDivElement>(null);
  const [periodErrorMsg, setPeriodErrorMsg] = useState('');
  const [valueErrorMsg, setValueErrorMsg] = useState('');

  useEffect(() => {
    if (editKPI.value.id < 0 || user.id < 0) return;
    kpiValueChangelogGetApi(editKPI.value.id, user.token).then(res => {
      setKpiValueChangelog(
        res.mini_change_log.map((record: ChangelogRecord) => {
          return {
            id: record.id,
            kpiValue: record.kpi_value_id,
            userName: `${record.user_id}`,
            timestamp: dayjs(record.registered_at).format('DD.MM.YYYY'),
            activity:
              record.activity === 'Created' ? 'New Value' : 'Edit Value',
          } as Changelog;
        })
      );
    });
  }, [editKPI.value.id, user]);

  const columns: GridColDef[] = [
    {
      field: 'kpiName',
      headerName: 'KPI Name',
      headerClassName: '-first-column',
      cellClassName: '-first-column',
      width: 170,
    },
    {
      field: 'kpiPeriod0',
      headerName: `01.${year % 100}`,
      width: 72,
      sortable: false,
      headerAlign: 'center',
    },
    {
      field: 'kpiPeriod1',
      headerName: `02.${year % 100}`,
      width: 72,
      sortable: false,
      headerAlign: 'center',
    },
    {
      field: 'kpiPeriod2',
      headerName: `03.${year % 100}`,
      width: 72,
      sortable: false,
      headerAlign: 'center',
    },
    {
      field: 'kpiPeriod3',
      headerName: `04.${year % 100}`,
      width: 72,
      sortable: false,
      headerAlign: 'center',
    },
    {
      field: 'kpiPeriod4',
      headerName: `05.${year % 100}`,
      width: 72,
      sortable: false,
      headerAlign: 'center',
    },
    {
      field: 'kpiPeriod5',
      headerName: `06.${year % 100}`,
      width: 72,
      sortable: false,
      headerAlign: 'center',
    },
    {
      field: 'kpiPeriod6',
      headerName: `07.${year % 100}`,
      width: 72,
      sortable: false,
      headerAlign: 'center',
    },
    {
      field: 'kpiPeriod7',
      headerName: `08.${year % 100}`,
      width: 72,
      sortable: false,
      headerAlign: 'center',
    },
    {
      field: 'kpiPeriod8',
      headerName: `09.${year % 100}`,
      width: 72,
      sortable: false,
      headerAlign: 'center',
    },
    {
      field: 'kpiPeriod9',
      headerName: `10.${year % 100}`,
      width: 72,
      sortable: false,
      headerAlign: 'center',
    },
    {
      field: 'kpiPeriod10',
      headerName: `11.${year % 100}`,
      width: 72,
      sortable: false,
      headerAlign: 'center',
    },
    {
      field: 'kpiPeriod11',
      headerName: `12.${year % 100}`,
      width: 72,
      sortable: false,
      headerAlign: 'center',
    },
    {
      field: 'kpiAvg',
      headerName: 'Avg.',
      valueGetter: (params: GridValueGetterParams) => {
        let total = 0,
          count = 0;
        for (let i = 0; i < 12; ++i) {
          if (params.row[`kpiPeriod${i}`]) {
            total += Number(params.row[`kpiPeriod${i}`]);
            count += 1;
          }
        }
        return `${(total / count).toFixed(1)}`;
      },
      width: 72,
      editable: false,
      sortable: false,
      headerAlign: 'center',
    },
    {
      field: 'kpiTarget',
      headerName: 'Target',
      width: 72,
      sortable: false,
      headerAlign: 'center',
    },
    {
      field: 'option',
      headerName: 'Option',
      width: 120,
      sortable: false,
      headerAlign: 'center',
      cellClassName: '-action-column',
      renderCell: (params: GridRenderCellParams<any, any>) => (
        <Button
          variant="outlined"
          onClick={() => handleEditKPI(params.row.id)}
          sx={globalStyles.buttonTinySize}
        >
          <EditIcon />
          Edit
        </Button>
      ),
    },
  ];

  const handleEditKPI = (id: number) => {
    const kpiItem = rows.find(item => item.id === id);
    setEditKPI({
      kpi: kpiItem!.kpi,
      value: { ...dummyKpiValue, kpi_id: kpiItem!.id },
    });
  };

  const submitEditKPI = () => {
    if (!editKPI.value.date) {
      setPeriodErrorMsg('Please fill out this field');
      return;
    }
    if (!checkUnitValidity(editKPI.kpi.unit, editKPI.value.value)) {
      setValueErrorMsg('Please insert a valid value');
      return;
    }
    if (invalidDate) {
      kpiValueAddApi(editKPI.value, user.token)
        .then(res => {
          setEditKPI({ kpi: dummyKpi, value: dummyKpiValue });
          setSaveKpiSuccess(true);
        })
        .catch(err => console.error(err));
    } else {
      kpiValueEditApi(editKPI.value, user.token)
        .then(res => {
          setEditKPI({ kpi: dummyKpi, value: dummyKpiValue });
          setSaveKpiSuccess(true);
        })
        .catch(err => console.error(err));
    }
  };

  const submitDeleteKpi = () => {
    if (!editKPI.value.date) return;
    if (invalidDate) {
      return;
    } else {
      kpiValueEditApi({ ...editKPI.value, value: 0 }, user.token)
        .then(res => {
          setEditKPI({ kpi: dummyKpi, value: dummyKpiValue });
          setSaveKpiSuccess(true);
        })
        .catch(err => console.error(err));
    }
  };

  return (
    <Box
      ref={tableRef}
      sx={{
        width: '100%',
        '& .greater': {
          color: '#1C6420',
        },
        '& .less': {
          color: '#D63503',
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        disableColumnFilter
        disableColumnMenu
        hideFooter
        rowHeight={44}
        columnHeaderHeight={44}
        getCellClassName={(params: GridCellParams<any, any, number>) => {
          if (params.field !== 'kpiAvg' || params.value == null) {
            return '';
          }
          return params.value >= params.row.kpiTarget ? 'greater' : 'less';
        }}
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
          },
          '.MuiDataGrid-columnSeparator': {
            display: 'none',
          },
          '.MuiDataGrid-cell': {
            px: '8px',
            justifyContent: 'flex-end',
            alignItems: 'center',
          },
          '.-action-column:focus': {
            outline: 'unset',
          },
          '.-action-column:focus-within': {
            outline: 'unset',
          },
          '& .-first-column': {
            boxShadow: '3px 0px 2px 0px rgba(0, 0, 0, 0.15)',
            justifyContent: 'flex-start',
          },
        }}
      />
      <Drawer
        open={editKPI.kpi.id >= 0}
        anchor="right"
        onClose={() => setEditKPI({ kpi: dummyKpi, value: dummyKpiValue })}
      >
        <Box
          display={'flex'}
          justifyContent={'flex-end'}
          pt={'12px'}
        >
          <IconButton
            onClick={() => setEditKPI({ kpi: dummyKpi, value: dummyKpiValue })}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Stack
          sx={{
            pb: '12px',
            px: '48px',
            alignItems: 'flex-start',
            rowGap: '40px',
            width: '503px',
          }}
        >
          <Typography
            fontSize={'24px'}
            fontWeight={500}
          >
            Edit KPI value
          </Typography>
          <Stack
            rowGap={'24px'}
            width={'100%'}
          >
            <Stack
              direction={'row'}
              columnGap={'24px'}
            >
              <Typography sx={globalStyles.drawerInputLabel}>Circle</Typography>
              <Typography sx={globalStyles.drawerLabelContent}>
                {editKPI.kpi.circle_name}
              </Typography>
            </Stack>
            <Stack
              direction={'row'}
              columnGap={'24px'}
            >
              <Typography sx={globalStyles.drawerInputLabel}>
                KPI Name
              </Typography>
              <Typography sx={globalStyles.drawerLabelContent}>
                {editKPI.kpi.name}
              </Typography>
            </Stack>
            <FormControl>
              <FormLabel>
                Period
                <Tooltip
                  title="The date range to which this KPI value belongs."
                  width="278px"
                />
              </FormLabel>
              <DatePicker
                slotProps={{
                  textField: {
                    variant: 'standard',
                    fullWidth: true,
                    helperText: periodErrorMsg,
                    error: periodErrorMsg.length > 0,
                  },
                }}
                maxDate={dayjs()}
                value={editKPI.value.date}
                onChange={selectDate => {
                  const date = selectDate ?? dayjs();
                  const value = Object.getOwnPropertyDescriptor(
                    rows.find(item => item.id === editKPI.kpi.id)!,
                    `kpiPeriod${date.month()}`
                  )?.value;
                  const kpiValueId = Object.getOwnPropertyDescriptor(
                    rows.find(item => item.id === editKPI.kpi.id)!,
                    `kpiPeriod${date.month()}Id`
                  )?.value;
                  if (value >= 0) {
                    setEditKPI({
                      kpi: editKPI.kpi,
                      value: {
                        ...editKPI.value,
                        date: date,
                        value: value,
                        id: kpiValueId,
                      },
                    });
                    setInvalidDate(false);
                  } else {
                    setEditKPI({
                      kpi: editKPI.kpi,
                      value: {
                        ...editKPI.value,
                        date: date,
                      },
                    });
                    setInvalidDate(true);
                  }
                  setPeriodErrorMsg('');
                }}
                shouldDisableDate={date =>
                  !isPeriod(date, editKPI.kpi.periodicity)
                }
                views={['month', 'year']}
                format="MM.YYYY"
              />
            </FormControl>
            <TextField
              variant="standard"
              label="Value"
              value={editKPI.value.value}
              required
              fullWidth
              onChange={e => {
                setEditKPI({
                  kpi: editKPI.kpi,
                  value: {
                    ...editKPI.value,
                    value: parseInt(e.target.value)
                      ? parseInt(e.target.value)
                      : 0,
                  },
                });
                setValueErrorMsg('');
              }}
              disabled={!editKPI.value.date}
              error={valueErrorMsg.length > 0}
              helperText={valueErrorMsg}
            />
          </Stack>
          <Stack
            direction={'row'}
            justifyContent={'space-between'}
            width={'100%'}
          >
            <Button
              variant="text"
              size="small"
              color="error"
              onClick={submitDeleteKpi}
            >
              <DeleteOutlineIcon />
              Clear Value
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() =>
                setEditKPI({ kpi: dummyKpi, value: dummyKpiValue })
              }
            >
              <CancelIcon />
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={submitEditKPI}
              size="small"
            >
              <SaveIcon />
              Save KPI edit
            </Button>
          </Stack>
          <Divider
            sx={{
              width: '100%',
              borderColor: '#F0EEEB',
            }}
          />
          <Stack rowGap={'24px'}>
            <Typography
              fontSize={'18px'}
              fontWeight={400}
            >
              KPI History
            </Typography>
            <TableContainer component={'div'}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Date</TableCell>
                    <TableCell align="left">User</TableCell>
                    <TableCell align="right">Activity</TableCell>
                    <TableCell align="right">Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {kpiValueChangelog.map(item => (
                    <TableRow>
                      <TableCell>{item.timestamp}</TableCell>
                      <TableCell>{item.userName}</TableCell>
                      <TableCell>{item.activity}</TableCell>
                      <TableCell>{item.kpiValue}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </Stack>
      </Drawer>
      <Dialog
        open={saveKpiSuccess}
        onClose={() => window.location.reload()}
      >
        <DialogContent>
          <SuccessIcon />
          <Typography
            sx={{ fontSize: '16px', fontWeight: 400, height: '48px' }}
          >
            KPI value has been saved succesfully
          </Typography>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
          >
            <ArrowBackIcon />
            Go back
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default EconomistKpiOverviewTable;

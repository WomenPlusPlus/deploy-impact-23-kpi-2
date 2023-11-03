import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Drawer,
  FormControl,
  FormLabel,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { AggregatedKpi, Circle, Kpi, dummyKpi, dummyKpiValue } from '../types';
import Tooltip from './Tooltip';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import CloseIcon from '@mui/icons-material/Close';
import { ReactComponent as CancelIcon } from '../assets/X-circle.svg';
import { ReactComponent as SaveIcon } from '../assets/Save.svg';
import { ReactComponent as SuccessIcon } from '../assets/Check-circle.svg';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ReactComponent as AddIcon } from '../assets/Plus-circle.svg';
import { circleGetAllApi } from '../services/circleService';
import { kpiGetAllApi } from '../services/kpiService';
import { checkUnitValidity, isPeriod } from '../utils';
import { kpiValueAddApi } from '../services/kpiValueService';
import { useContext, useState } from 'react';
import { UserContext } from '../utils/context';
import { globalStyles } from '../styles';

const InsertKpiDrawer = () => {
  const { user } = useContext(UserContext);
  const [insertKPI, setInsertKPI] = useState<AggregatedKpi>({
    kpi: dummyKpi,
    value: dummyKpiValue,
  });
  const [circles, setCircles] = useState<Circle[]>();
  const [kpis, setKpis] = useState<Kpi[]>();
  const [saveKpiSuccess, setSaveKpiSuccess] = useState(false);
  const [circleErrorMsg, setCircleErrorMsg] = useState('');
  const [kpiErrorMsg, setKpiErrorMsg] = useState('');
  const [periodErrorMsg, setPeriodErrorMsg] = useState('');
  const [valueErrorMsg, setValueErrorMsg] = useState('');

  const handleInsertKPIValue = () => {
    circleGetAllApi(user.token)
      .then(res => {
        setCircles(res.circles);
        kpiGetAllApi(user.token)
          .then(res => {
            setKpis(res.kpi_list);
            setInsertKPI({
              kpi: dummyKpi,
              value: { ...dummyKpiValue, id: 1 },
            });
          })
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
  };

  const submitInsertKPIValue = () => {
    if (insertKPI.kpi.circle_id < 0) {
      setCircleErrorMsg('Please select a circle');
      return;
    }
    if (insertKPI.kpi.id < 0) {
      setKpiErrorMsg('Please select a KPI');
      return;
    }
    if (!insertKPI.value.date) {
      setPeriodErrorMsg('Please fill out this field');
      return;
    }
    const kpiSelected = kpis!.find(kpi => kpi.id === insertKPI.kpi.id);
    if (!checkUnitValidity(kpiSelected!.unit, insertKPI.value.value)) {
      setValueErrorMsg('Please insert a valid value');
      return;
    }
    kpiValueAddApi(insertKPI.value, user.token)
      .then(res => {
        setInsertKPI({ kpi: kpiSelected!, value: dummyKpiValue });
        setSaveKpiSuccess(true);
      })
      .catch(err => {
        if (err.response.status === 400) {
          setPeriodErrorMsg('The KPI value already exists for this period ');
        } else console.error(err);
      });
  };

  return (
    <>
      <Button
        variant="contained"
        sx={globalStyles.buttonTinySize}
        onClick={handleInsertKPIValue}
      >
        <AddIcon />
        Insert KPI Value
      </Button>
      <Drawer
        open={insertKPI.value.id >= 0}
        anchor="right"
        onClose={() => setInsertKPI({ kpi: dummyKpi, value: dummyKpiValue })}
      >
        <Box
          display={'flex'}
          justifyContent={'flex-end'}
          pt={'12px'}
        >
          <IconButton
            onClick={() =>
              setInsertKPI({ kpi: dummyKpi, value: dummyKpiValue })
            }
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
            Input KPI value
          </Typography>
          <Stack
            rowGap={'24px'}
            width={'100%'}
          >
            <TextField
              select
              variant="standard"
              label="Circle"
              fullWidth
              value={insertKPI.kpi.circle_id}
              onChange={e => {
                setInsertKPI({
                  kpi: {
                    ...insertKPI.kpi,
                    circle_id: Number(e.target.value),
                    id: -1,
                  },
                  value: insertKPI.value,
                });
                setCircleErrorMsg('');
              }}
              error={circleErrorMsg.length > 0}
              helperText={circleErrorMsg}
            >
              <MenuItem
                disabled
                value={-1}
                sx={{ display: 'none' }}
              >
                Select one
              </MenuItem>
              {circles?.map(circle => (
                <MenuItem
                  key={circle.id}
                  value={circle.id}
                >
                  {circle.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              variant="standard"
              label="KPI Name"
              fullWidth
              value={insertKPI.kpi.id}
              onChange={e => {
                const kpi = kpis!.find(
                  kpi => kpi.id === Number(e.target.value)
                )!;
                setInsertKPI({
                  kpi: kpi,
                  value: { ...insertKPI.value, kpi_id: kpi.id },
                });
                setKpiErrorMsg('');
              }}
              disabled={insertKPI.kpi.circle_id < 0}
              error={kpiErrorMsg.length > 0}
              helperText={kpiErrorMsg}
            >
              <MenuItem
                disabled
                value={-1}
                sx={{ display: 'none' }}
              >
                Select one
              </MenuItem>
              {kpis?.map(
                kpi =>
                  kpi.circle_id === insertKPI.kpi.circle_id && (
                    <MenuItem
                      key={kpi.id}
                      value={kpi.id}
                    >
                      {kpi.name}
                    </MenuItem>
                  )
              )}
            </TextField>
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
                value={insertKPI.value.date}
                onChange={selectDate => {
                  setInsertKPI({
                    kpi: insertKPI.kpi,
                    value: {
                      ...insertKPI.value,
                      date: selectDate ?? dayjs(),
                    },
                  });
                  setPeriodErrorMsg('');
                }}
                shouldDisableDate={date =>
                  !isPeriod(date, insertKPI.kpi.periodicity)
                }
                disabled={(insertKPI.kpi.id ?? -1) < 0}
                views={['month', 'year']}
                format="MM.YYYY"
              />
            </FormControl>
            <TextField
              variant="standard"
              label="Value"
              placeholder={'00'}
              required
              fullWidth
              value={insertKPI.value.value}
              onChange={e => {
                setInsertKPI({
                  kpi: insertKPI.kpi,
                  value: {
                    ...insertKPI.value,
                    value: parseInt(e.target.value)
                      ? parseInt(e.target.value)
                      : 0,
                  },
                });
                setValueErrorMsg('');
              }}
              disabled={!insertKPI.value.date}
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
              variant="outlined"
              size="small"
              onClick={() =>
                setInsertKPI({ kpi: dummyKpi, value: dummyKpiValue })
              }
            >
              <CancelIcon />
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={submitInsertKPIValue}
              size="small"
            >
              <SaveIcon />
              Save new KPI value
            </Button>
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
    </>
  );
};

export default InsertKpiDrawer;

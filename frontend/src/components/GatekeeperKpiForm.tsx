import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as CancelIcon } from '../assets/X-circle.svg';
import { ReactComponent as SaveIcon } from '../assets/Save.svg';
import Tooltip from '../components/Tooltip';
import { circleGetAllApi } from '../services/circleService';
import { useContext, useEffect, useState } from 'react';
import { Circle, Kpi, isKpiPeriod, isKpiUnit } from '../types';
import { UserContext } from '../utils/context';
import { autoLoginAfterExpire, checkUnitValidity } from '../utils';

const GatekeeperKpiForm = ({
  kpi,
  setKpi,
  submit,
}: {
  kpi: Kpi;
  setKpi: (k: Kpi) => void;
  submit: () => void;
}) => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [circles, setCircles] = useState<Circle[]>();

  const handleSubmit = () => {
    if (kpi.name.length === 0) {
      console.log('name');
      return;
    }
    if (kpi.circle_id === -1) {
      console.log('circle');
      return;
    }
    if (
      !checkUnitValidity(kpi.unit, kpi.initial_value) ||
      !checkUnitValidity(kpi.unit, kpi.target_value)
    ) {
      console.log('value');
      return;
    }
    submit();
  };

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
  }, [circles, user, navigate, setUser]);
  return (
    <>
      <Stack
        px={'326px'}
        rowGap={'32px'}
      >
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          columnGap={'32px'}
        >
          <TextField
            variant="standard"
            label={
              <>
                Name
                <Tooltip
                  title="Enter the unique name of the KPI to identify it easily on the dashboard. For example, 'Customer Satisfaction', 'Private Donations', etc."
                  width="262px"
                />
              </>
            }
            placeholder="Name of new KPI Type"
            fullWidth
            value={kpi.name}
            onChange={e => setKpi({ ...kpi, name: e.target.value })}
          />

          <TextField
            select
            label={
              <>
                Period
                <Tooltip
                  title="Choose how often this KPI should be updated or reviewed. Options can range from monthly, quarterly, or annually. This helps in tracking the progress and performance over a specified time frame."
                  width="378px"
                />
              </>
            }
            variant="standard"
            fullWidth
            value={kpi.periodicity}
            onChange={e =>
              isKpiPeriod(e.target.value) &&
              setKpi({ ...kpi, periodicity: e.target.value })
            }
          >
            <MenuItem value={'Monthly'}>Month</MenuItem>
            <MenuItem value={'Quarterly'}>Quarter</MenuItem>
            <MenuItem value={'Yearly'}>Year</MenuItem>
          </TextField>
        </Box>
        <TextField
          select
          label={
            <>
              Circle
              <Tooltip
                title="Select the team responsible for this KPI. This helps in organising and assigning the KPIs to the appropriate teams for monitoring and management."
                width="288px"
              />
            </>
          }
          variant="standard"
          placeholder="Select one"
          fullWidth
          value={kpi.circle_id}
          onChange={e => setKpi({ ...kpi, circle_id: Number(e.target.value) })}
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
        <FormControl>
          <FormLabel>
            Unit
            <Tooltip
              title="Specify the unit used to measure this KPI. This provides context to the values and goals set for the performance indicator."
              width="227px"
            />
          </FormLabel>
          <RadioGroup
            row
            sx={{ width: '80%' }}
            value={kpi.unit}
            onChange={e =>
              isKpiUnit(e.target.value) &&
              setKpi({ ...kpi, unit: e.target.value })
            }
          >
            <FormControlLabel
              value="%"
              control={<Radio />}
              label={
                <>
                  Percent
                  <Tooltip
                    title="Select this option if the KPI is measured in terms of a percentage. For instance, it can be used for metrics like customer satisfaction rate or task completion rate."
                    width="275px"
                  />
                </>
              }
              sx={{ width: '185px' }}
            />
            <FormControlLabel
              value="amount"
              control={<Radio />}
              label={
                <>
                  Amount
                  <Tooltip
                    title="Opt for this unit if the KPI is quantified as a numerical value or count, such as the number of visits on a website or number of volunteers."
                    width="247px"
                  />
                </>
              }
              sx={{ width: '185px' }}
            />
            <FormControlLabel
              value="chf"
              control={<Radio />}
              label={
                <>
                  CHF
                  <Tooltip
                    title="Choose this option if the KPI is to be measured in Swiss Francs (CHF). Ideal for financial KPIs related to revenue, expenses, or budgets specifically dealing with this currency."
                    width="328px"
                  />
                </>
              }
              sx={{ width: '185px' }}
            />
            <FormControlLabel
              value="score"
              control={<Radio />}
              label={
                <>
                  Score
                  <Tooltip
                    title="Select ‘score’ if the KPI is measured using a rating or scoring system, such as employee performance rating, product quality score, or customer feedback rating."
                    width="288px"
                  />
                </>
              }
              sx={{ width: '185px' }}
            />
          </RadioGroup>
        </FormControl>

        <Box
          display={'flex'}
          justifyContent={'space-between'}
          columnGap={'32px'}
        >
          <TextField
            variant="standard"
            label={
              <>
                Initial Value
                <Tooltip
                  title="Enter the starting value of the KPI. This is the baseline value from which progress or regression will be measured over time."
                  width="226px"
                />
              </>
            }
            fullWidth
            value={kpi.initial_value}
            onChange={e =>
              setKpi({ ...kpi, initial_value: Number(e.target.value) })
            }
          />
          <TextField
            variant="standard"
            label={
              <>
                Target Value
                <Tooltip
                  title="Input the desired value you aim to achieve for this KPI within the specified period. This sets a clear goal for the team to work towards."
                  width="247px"
                />
              </>
            }
            fullWidth
            value={kpi.target_value}
            onChange={e =>
              setKpi({ ...kpi, target_value: Number(e.target.value) })
            }
          />
        </Box>
        <Box />
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
        >
          <Button
            variant="text"
            onClick={() => navigate(-1)}
          >
            <CancelIcon />
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
          >
            <SaveIcon />
            Save new KPI
          </Button>
        </Stack>
      </Stack>
    </>
  );
};

export default GatekeeperKpiForm;

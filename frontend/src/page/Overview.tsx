import {
  Button,
  FormLabel,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { globalStyles } from '../styles';
import { ReactComponent as SaveIcon } from '../assets/Save.svg';
import KPIOverviewTable from '../components/KPIOverviewTable';
import { FormControl } from '@mui/base';

const Overview = () => {
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
            <TextField
              select
              variant="standard"
              sx={{ width: '184px' }}
            ></TextField>
          </FormControl>
          <FormControl style={{ display: 'flex' }}>
            <FormLabel sx={{ padding: '8px 12px', fontWeight: 400 }}>
              Period
            </FormLabel>
            <TextField
              select
              variant="standard"
              sx={{ width: '184px' }}
              defaultValue={'this year'}
            >
              <MenuItem value="this month">this month</MenuItem>
              <MenuItem value="last month">last month</MenuItem>
              <MenuItem value="this quarter">this quarter</MenuItem>
              <MenuItem value="last quarter">last quarter</MenuItem>
              <MenuItem value="this year">this year</MenuItem>
              <MenuItem value="last year">last year</MenuItem>
            </TextField>
          </FormControl>
          <Button
            variant="outlined"
            sx={globalStyles.buttonTinySize}
          >
            <SaveIcon />
            Apply Filters
          </Button>
        </Stack>
        <FormControl style={{ display: 'flex' }}>
          <FormLabel sx={{ padding: '8px 12px', fontWeight: 400 }}>
            Graphs
          </FormLabel>
          <Switch defaultChecked />
        </FormControl>
      </Stack>
      <KPIOverviewTable />
    </Stack>
  );
};

export default Overview;

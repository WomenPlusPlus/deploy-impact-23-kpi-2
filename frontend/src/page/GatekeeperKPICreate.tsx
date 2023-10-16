import {
  Box,
  Breadcrumbs,
  Button,
  Dialog,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { globalStyles } from '../styles';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Link, useNavigate } from 'react-router-dom';
import { routes } from '../utils/route';
import { ReactComponent as CancelIcon } from '../assets/X-circle.svg';
import { ReactComponent as SaveIcon } from '../assets/Save.svg';
import { ReactComponent as SuccessIcon } from '../assets/Check-circle.svg';
import { useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const GatekeeperKPICreate = () => {
  const [createKPIsuccess, setCreateKPIsuccess] = useState(false);
  const navigate = useNavigate();

  const submitCreateKPI = () => {
    setCreateKPIsuccess(true);
  };

  return (
    <>
      <Stack rowGap={'48px'}>
        <Breadcrumbs separator={<NavigateNextIcon sx={{ fontSize: '24px' }} />}>
          [
          <Link
            to={`/${routes.tab[2]}`}
            style={globalStyles.pageHistory}
          >
            Gatekeeper Tools
          </Link>
          ,<Typography sx={globalStyles.pageTitle}>Create new KPI</Typography>]
        </Breadcrumbs>
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
              label="KPI Type"
              placeholder="Name of new KPI Type"
              required
              fullWidth
            />
            <TextField
              select
              label="Period"
              variant="standard"
              defaultValue={'quarter'}
              fullWidth
            >
              <MenuItem value={'month'}>Month</MenuItem>
              <MenuItem value={'quarter'}>Quarter</MenuItem>
              <MenuItem value={'year'}>Year</MenuItem>
            </TextField>
          </Box>
          <TextField
            select
            label="Circle"
            variant="standard"
            placeholder="Select one"
            fullWidth
            defaultValue={'placeholder'}
            required
          >
            <MenuItem
              disabled
              value={'placeholder'}
              sx={{ display: 'none' }}
            >
              Select one
            </MenuItem>
          </TextField>
          <FormControl>
            <FormLabel>Unit</FormLabel>
            <RadioGroup
              row
              sx={{ width: '80%' }}
            >
              <FormControlLabel
                value="percent"
                control={<Radio />}
                label="Percent"
                sx={{ width: '185px' }}
              />
              <FormControlLabel
                value="amount"
                control={<Radio />}
                label="Amount"
                sx={{ width: '185px' }}
              />
              <FormControlLabel
                value="chf"
                control={<Radio />}
                label="CHF"
                sx={{ width: '185px' }}
              />
              <FormControlLabel
                value="score"
                control={<Radio />}
                label="Score"
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
              label="Initial Value"
              placeholder="00%"
              fullWidth
            />
            <TextField
              variant="standard"
              label="Target Value"
              placeholder="00%"
              fullWidth
            />
          </Box>
          <Box />
          <Stack
            direction={'row'}
            justifyContent={'space-between'}
          >
            <Button
              variant="text"
              onClick={() => navigate('/gatekeeper')}
            >
              <CancelIcon />
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={submitCreateKPI}
            >
              <SaveIcon />
              Save new KPI
            </Button>
          </Stack>
        </Stack>
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
            onClick={() => navigate('/gatekeeper')}
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

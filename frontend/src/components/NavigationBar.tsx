import { useMsal } from '@azure/msal-react';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  FormControl,
  FormLabel,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { routes } from '../utils/route';
import { ReactComponent as AddIcon } from '../assets/Plus-circle.svg';
import { DatePicker } from '@mui/x-date-pickers';
import { ReactComponent as CancelIcon } from '../assets/X-circle.svg';
import { ReactComponent as SaveIcon } from '../assets/Save.svg';
import CloseIcon from '@mui/icons-material/Close';
import { globalStyles } from '../styles';
import Tooltip from './Tooltip';

export const NavigationBar = ({ page }: { page: number }) => {
  const { instance } = useMsal();
  const [insertKPI, setInsertKPI] = useState<Record<string, any> | undefined>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  let activeAccount;

  if (instance) {
    activeAccount = instance.getActiveAccount();
  }

  // const handleLoginRedirect = () => {
  //   instance.loginRedirect(loginRequest).catch(error => console.log(error));
  // };

  const handleLogoutPopup = () => {
    instance
      .logoutPopup({
        mainWindowRedirectUri: '/login', // redirects after logout
        account: instance.getActiveAccount(),
      })
      .catch(error => console.log(error));
  };

  // const handleLogoutRedirect = () => {
  //   instance.logoutRedirect().catch(error => console.log(error));
  // };

  const handleChangePage = (page: number) => {
    if (0 <= page && page < routes.tab.length) {
      navigate(`/${routes.tab[page]}`);
    }
  };

  const submitInsertKPI = () => {
    setInsertKPI(undefined);
  };

  return (
    <AppBar
      elevation={0}
      sx={{ background: 'white' }}
    >
      <Toolbar>
        <Tabs
          value={page}
          onChange={(_, newPage) => handleChangePage(newPage)}
          sx={{ ml: '48px', flexGrow: 1 }}
        >
          <Tab label="KPI Overview" />
          <Tab label="Activity" />
          <Tab label="GateKeeper Tools" />
        </Tabs>
        <Stack
          direction={'row'}
          columnGap={'24px'}
          mr={'48px'}
          flexGrow={0}
          alignItems={'center'}
        >
          <Button
            variant="contained"
            sx={globalStyles.buttonTinySize}
            onClick={() => setInsertKPI({})}
          >
            <AddIcon />
            Insert KPI Value
          </Button>
          <Button
            onClick={e => setAnchorEl(e.currentTarget)}
            variant="text"
            sx={{ p: '8px 0px' }}
          >
            <Avatar
              sx={{ width: 32, height: 32 }}
              alt={activeAccount ? activeAccount.name : 'Unknown'}
              src="/not-supported.jpg"
            />
            <Typography
              fontSize={'14px'}
              fontWeight={400}
            >
              {activeAccount ? activeAccount.name : 'Unknown'}
            </Typography>
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
            onClick={() => setAnchorEl(null)}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleLogoutPopup}>pop up logout</MenuItem>
            <Divider />
          </Menu>
        </Stack>
      </Toolbar>
      <Drawer
        open={!!insertKPI}
        anchor="right"
        onClose={() => setInsertKPI(undefined)}
      >
        <Box
          display={'flex'}
          justifyContent={'flex-end'}
          pt={'12px'}
        >
          <IconButton onClick={() => setInsertKPI(undefined)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Stack
          sx={{
            pb: '12px',
            px: '48px',
            alignItems: 'flex-start',
            rowGap: '40px',
            width: '503px', // TODO: remove
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
              defaultValue={'placeholder'}
              fullWidth
            >
              <MenuItem
                disabled
                value={'placeholder'}
                sx={{ display: 'none' }}
              >
                Select one
              </MenuItem>
            </TextField>
            <TextField
              select
              variant="standard"
              label="KPI Name"
              defaultValue={'placeholder'}
              fullWidth
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
              <FormLabel>
                Period
                <Tooltip
                  title="The date range to which this KPI value belongs."
                  width="278px"
                />
              </FormLabel>
              <DatePicker
                views={['month', 'year']}
                format="mm.yyyy"
                slotProps={{
                  textField: { variant: 'standard', fullWidth: true },
                }}
              />
            </FormControl>
            <TextField
              variant="standard"
              label="Value"
              placeholder={'00'}
              required
              fullWidth
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
              onClick={() => setInsertKPI(undefined)}
            >
              <CancelIcon />
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={submitInsertKPI}
              size="small"
            >
              <SaveIcon />
              Save new KPI value
            </Button>
          </Stack>
        </Stack>
      </Drawer>
    </AppBar>
  );
};

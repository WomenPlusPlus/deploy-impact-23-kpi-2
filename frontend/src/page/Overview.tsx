import {
  Button,
  Divider,
  Drawer,
  FormControl,
  FormLabel,
  IconButton,
  Stack,
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
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { ReactComponent as CancelIcon } from '../assets/X-circle.svg';
import { ReactComponent as SaveIcon } from '../assets/Save.svg';
import { DatePicker } from '@mui/x-date-pickers';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const rows = [
  {
    id: 'kpiID0',
    kpiName: 'Share of teams constituted as circles',
    kpiPeriod0: 35,
    kpiPeriod1: 35,
    kpiPeriod2: 35,
    kpiPeriod3: 35,
    kpiPeriod4: 35,
    kpiPeriod5: 35,
    kpiPeriod6: 35,
    kpiPeriod7: 35,
    kpiPeriod8: 35,
    kpiPeriod9: 35,
    kpiPeriod10: 35,
    kpiPeriod11: 35,
    kpiPeriod12: 35,
    kpiTarget: 80,
  },
  {
    id: 'kpiID1',
    kpiName: 'Share short term leave',
    kpiPeriod0: 35,
    kpiPeriod1: 35,
    kpiPeriod2: 35,
    kpiPeriod3: 35,
    kpiPeriod4: 35,
    kpiPeriod5: 35,
    kpiPeriod6: 35,
    kpiPeriod7: 35,
    kpiPeriod8: 35,
    kpiPeriod9: 35,
    kpiPeriod10: 35,
    kpiPeriod11: 35,
    kpiPeriod12: 35,
    kpiTarget: 80,
  },
  {
    id: 'kpiID2',
    kpiName: 'Involuntary headcount change (FTE)',
    kpiPeriod0: 35,
    kpiPeriod1: 35,
    kpiPeriod2: 35,
    kpiPeriod3: 35,
    kpiPeriod4: 35,
    kpiPeriod5: 35,
    kpiPeriod6: 35,
    kpiPeriod7: 35,
    kpiPeriod8: 35,
    kpiPeriod9: 35,
    kpiPeriod10: 35,
    kpiPeriod11: 35,
    kpiPeriod12: 35,
    kpiTarget: 80,
  },
  {
    id: 'kpiID3',
    kpiName: 'asdfasdfasdfasdf',
    kpiPeriod0: 35,
    kpiPeriod1: 35,
    kpiPeriod2: 35,
    kpiPeriod3: 35,
    kpiPeriod4: 35,
    kpiPeriod5: 35,
    kpiPeriod6: 35,
    kpiPeriod7: 35,
    kpiPeriod8: 35,
    kpiPeriod9: 35,
    kpiPeriod10: 35,
    kpiPeriod11: 35,
    kpiPeriod12: 35,
    kpiTarget: 80,
  },
  {
    id: 'kpiIDq',
    kpiName: 'asdfasdfasdfasdf',
    kpiPeriod0: 35,
    kpiPeriod1: 35,
    kpiPeriod2: 35,
    kpiPeriod3: 35,
    kpiPeriod4: 35,
    kpiPeriod5: 35,
    kpiPeriod6: 35,
    kpiPeriod7: 35,
    kpiPeriod8: 35,
    kpiPeriod9: 35,
    kpiPeriod10: 35,
    kpiPeriod11: 35,
    kpiPeriod12: 35,
    kpiTarget: 80,
  },
  {
    id: 'kpiIDp',
    kpiName: 'asdfasdfasdfasdf',
    kpiPeriod0: 35,
    kpiPeriod1: 35,
    kpiPeriod2: 35,
    kpiPeriod3: 35,
    kpiPeriod4: 35,
    kpiPeriod5: 35,
    kpiPeriod6: 35,
    kpiPeriod7: 35,
    kpiPeriod8: 35,
    kpiPeriod9: 35,
    kpiPeriod10: 35,
    kpiPeriod11: 35,
    kpiPeriod12: 35,
    kpiTarget: 80,
  },
  {
    id: 'kpiIDo',
    kpiName: 'asdfasdfasdfasdf',
    kpiPeriod0: 35,
    kpiPeriod1: 35,
    kpiPeriod2: 35,
    kpiPeriod3: 35,
    kpiPeriod4: 35,
    kpiPeriod5: 35,
    kpiPeriod6: 35,
    kpiPeriod7: 35,
    kpiPeriod8: 35,
    kpiPeriod9: 35,
    kpiPeriod10: 35,
    kpiPeriod11: 35,
    kpiPeriod12: 35,
    kpiTarget: 80,
  },
  {
    id: 'kpiIDn',
    kpiName: 'asdfasdfasdfasdf',
    kpiPeriod0: 35,
    kpiPeriod1: 35,
    kpiPeriod2: 35,
    kpiPeriod3: 35,
    kpiPeriod4: 35,
    kpiPeriod5: 35,
    kpiPeriod6: 35,
    kpiPeriod7: 35,
    kpiPeriod8: 35,
    kpiPeriod9: 35,
    kpiPeriod10: 35,
    kpiPeriod11: 35,
    kpiPeriod12: 35,
    kpiTarget: 80,
  },
  {
    id: 'kpiIDm',
    kpiName: 'asdfasdfasdfasdf',
    kpiPeriod0: 35,
    kpiPeriod1: 35,
    kpiPeriod2: 35,
    kpiPeriod3: 35,
    kpiPeriod4: 35,
    kpiPeriod5: 35,
    kpiPeriod6: 35,
    kpiPeriod7: 35,
    kpiPeriod8: 35,
    kpiPeriod9: 35,
    kpiPeriod10: 35,
    kpiPeriod11: 35,
    kpiPeriod12: 35,
    kpiTarget: 80,
  },
  {
    id: 'kpiIDl',
    kpiName: 'asdfasdfasdfasdf',
    kpiPeriod0: 35,
    kpiPeriod1: 35,
    kpiPeriod2: 35,
    kpiPeriod3: 35,
    kpiPeriod4: 35,
    kpiPeriod5: 35,
    kpiPeriod6: 35,
    kpiPeriod7: 35,
    kpiPeriod8: 35,
    kpiPeriod9: 35,
    kpiPeriod10: 35,
    kpiPeriod11: 35,
    kpiPeriod12: 35,
    kpiTarget: 80,
  },
  {
    id: 'kpiIDk',
    kpiName: 'asdfasdfasdfasdf',
    kpiPeriod0: 35,
    kpiPeriod1: 35,
    kpiPeriod2: 35,
    kpiPeriod3: 35,
    kpiPeriod4: 35,
    kpiPeriod5: 35,
    kpiPeriod6: 35,
    kpiPeriod7: 35,
    kpiPeriod8: 35,
    kpiPeriod9: 35,
    kpiPeriod10: 35,
    kpiPeriod11: 35,
    kpiPeriod12: 35,
    kpiTarget: 80,
  },
  {
    id: 'kpiIDj',
    kpiName: 'asdfasdfasdfasdf',
    kpiPeriod0: 35,
    kpiPeriod1: 35,
    kpiPeriod2: 35,
    kpiPeriod3: 35,
    kpiPeriod4: 35,
    kpiPeriod5: 35,
    kpiPeriod6: 35,
    kpiPeriod7: 35,
    kpiPeriod8: 35,
    kpiPeriod9: 35,
    kpiPeriod10: 35,
    kpiPeriod11: 35,
    kpiPeriod12: 35,
    kpiTarget: 80,
  },
  {
    id: 'kpiIDi',
    kpiName: 'asdfasdfasdfasdf',
    kpiPeriod0: 35,
    kpiPeriod1: 35,
    kpiPeriod2: 35,
    kpiPeriod3: 35,
    kpiPeriod4: 35,
    kpiPeriod5: 35,
    kpiPeriod6: 35,
    kpiPeriod7: 35,
    kpiPeriod8: 35,
    kpiPeriod9: 35,
    kpiPeriod10: 35,
    kpiPeriod11: 35,
    kpiPeriod12: 35,
    kpiTarget: 80,
  },
  {
    id: 'kpiIDh',
    kpiName: 'asdfasdfasdfasdf',
    kpiPeriod0: 35,
    kpiPeriod1: 35,
    kpiPeriod2: 35,
    kpiPeriod3: 35,
    kpiPeriod4: 35,
    kpiPeriod5: 35,
    kpiPeriod6: 35,
    kpiPeriod7: 35,
    kpiPeriod8: 35,
    kpiPeriod9: 35,
    kpiPeriod10: 35,
    kpiPeriod11: 35,
    kpiPeriod12: 35,
    kpiTarget: 80,
  },
  {
    id: 'kpiIDg',
    kpiName: 'asdfasdfasdfasdf',
    kpiPeriod0: 35,
    kpiPeriod1: 35,
    kpiPeriod2: 35,
    kpiPeriod3: 35,
    kpiPeriod4: 35,
    kpiPeriod5: 35,
    kpiPeriod6: 35,
    kpiPeriod7: 35,
    kpiPeriod8: 35,
    kpiPeriod9: 35,
    kpiPeriod10: 35,
    kpiPeriod11: 35,
    kpiPeriod12: 35,
    kpiTarget: 80,
  },
  {
    id: 'kpiIDf',
    kpiName: 'asdfasdfasdfasdf',
    kpiPeriod0: 35,
    kpiPeriod1: 35,
    kpiPeriod2: 35,
    kpiPeriod3: 35,
    kpiPeriod4: 35,
    kpiPeriod5: 35,
    kpiPeriod6: 35,
    kpiPeriod7: 35,
    kpiPeriod8: 35,
    kpiPeriod9: 35,
    kpiPeriod10: 35,
    kpiPeriod11: 35,
    kpiPeriod12: 35,
    kpiTarget: 80,
  },
  {
    id: 'kpiIDe',
    kpiName: 'asdfasdfasdfasdf',
    kpiPeriod0: 35,
    kpiPeriod1: 35,
    kpiPeriod2: 35,
    kpiPeriod3: 35,
    kpiPeriod4: 35,
    kpiPeriod5: 35,
    kpiPeriod6: 35,
    kpiPeriod7: 35,
    kpiPeriod8: 35,
    kpiPeriod9: 35,
    kpiPeriod10: 35,
    kpiPeriod11: 35,
    kpiPeriod12: 35,
    kpiTarget: 80,
  },
  {
    id: 'kpiIDd',
    kpiName: 'asdfasdfasdfasdf',
    kpiPeriod0: 35,
    kpiPeriod1: 35,
    kpiPeriod2: 35,
    kpiPeriod3: 35,
    kpiPeriod4: 35,
    kpiPeriod5: 35,
    kpiPeriod6: 35,
    kpiPeriod7: 35,
    kpiPeriod8: 35,
    kpiPeriod9: 35,
    kpiPeriod10: 35,
    kpiPeriod11: 35,
    kpiPeriod12: 35,
    kpiTarget: 80,
  },
  {
    id: 'kpiIDc',
    kpiName: 'asdfasdfasdfasdf',
    kpiPeriod0: 35,
    kpiPeriod1: 35,
    kpiPeriod2: 35,
    kpiPeriod3: 35,
    kpiPeriod4: 35,
    kpiPeriod5: 35,
    kpiPeriod6: 35,
    kpiPeriod7: 35,
    kpiPeriod8: 35,
    kpiPeriod9: 35,
    kpiPeriod10: 35,
    kpiPeriod11: 35,
    kpiPeriod12: 35,
    kpiTarget: 80,
  },
  {
    id: 'kpiIDb',
    kpiName: 'asdfasdfasdfasdf',
    kpiPeriod0: 35,
    kpiPeriod1: 35,
    kpiPeriod2: 35,
    kpiPeriod3: 35,
    kpiPeriod4: 35,
    kpiPeriod5: 35,
    kpiPeriod6: 35,
    kpiPeriod7: 35,
    kpiPeriod8: 35,
    kpiPeriod9: 35,
    kpiPeriod10: 35,
    kpiPeriod11: 35,
    kpiPeriod12: 35,
    kpiTarget: 80,
  },
  {
    id: 'kpiIDa',
    kpiName: 'asdfasdfasdfasdf',
    kpiPeriod0: 35,
    kpiPeriod1: 35,
    kpiPeriod2: 35,
    kpiPeriod3: 35,
    kpiPeriod4: 35,
    kpiPeriod5: 35,
    kpiPeriod6: 35,
    kpiPeriod7: 35,
    kpiPeriod8: 35,
    kpiPeriod9: 35,
    kpiPeriod10: 35,
    kpiPeriod11: 35,
    kpiPeriod12: 35,
    kpiTarget: 80,
  },
];

const Overview = () => {
  const styles = {
    inputLabel: {
      fontSize: '14px',
      fontWeight: 400,
      width: '64px',
    },
    labelContent: {
      fontSize: '14px',
      fontWeight: 400,
    },
  };
  const [editingKPI, setEditingKPI] = useState<
    Record<string, any> | undefined
  >();
  const handleEditKPI = (id: string) => {
    setEditingKPI(rows.find(item => item.id === id));
  };

  const columns: GridColDef[] = [
    {
      field: 'kpiName',
      headerName: 'KPI Type',
      headerClassName: '-first-column',
      cellClassName: '-first-column',
      width: 170,
    },
    {
      field: 'kpiPeriod0',
      headerName: '01.23',
      headerAlign: 'center',
      width: 72,
      sortable: false,
    },
    {
      field: 'kpiPeriod1',
      headerName: '02.23',
      width: 72,
      sortable: false,
      headerAlign: 'center',
    },
    {
      field: 'kpiPeriod2',
      headerName: '03.23',
      width: 72,
      sortable: false,
      headerAlign: 'center',
    },
    {
      field: 'kpiPeriod3',
      headerName: '04.23',
      width: 72,
      sortable: false,
      headerAlign: 'center',
    },
    {
      field: 'kpiPeriod4',
      headerName: '05.23',
      width: 72,
      sortable: false,
      headerAlign: 'center',
    },
    {
      field: 'kpiPeriod5',
      headerName: '06.23',
      width: 72,
      sortable: false,
      headerAlign: 'center',
    },
    {
      field: 'kpiPeriod6',
      headerName: '07.23',
      width: 72,
      sortable: false,
      headerAlign: 'center',
    },
    {
      field: 'kpiPeriod7',
      headerName: '08.23',
      width: 72,
      sortable: false,
      headerAlign: 'center',
    },
    {
      field: 'kpiPeriod8',
      headerName: '09.23',
      width: 72,
      sortable: false,
      headerAlign: 'center',
    },
    {
      field: 'kpiPeriod9',
      headerName: '10.23',
      width: 72,
      sortable: false,
      headerAlign: 'center',
    },
    {
      field: 'kpiPeriod10',
      headerName: '11.23',
      width: 72,
      sortable: false,
      headerAlign: 'center',
    },
    {
      field: 'kpiPeriod11',
      headerName: '12.23',
      width: 72,
      sortable: false,
      headerAlign: 'center',
    },
    {
      field: 'kpiAvg',
      headerName: 'Avg.',
      valueGetter: (params: GridValueGetterParams) => {
        let total = 0;
        for (let i = 0; i < 12; ++i) {
          total += Number(params.row[`kpiPeriod${i}`]);
        }
        return `${total / 12}`;
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
          sx={{
            p: '6px 8px',
            fontSize: '12px',
            height: '28px',
          }}
        >
          <EditIcon />
          Edit
        </Button>
      ),
    },
    //   {
    //     field: 'fullName',
    //     headerName: 'Full name',
    //     description: 'This column has a value getter and is not sortable.',
    //     sortable: false,
    //     width: 160,
    //     valueGetter: (params: GridValueGetterParams) =>
    //       `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    //   },
  ];

  const submitEditKPI = () => {
    setEditingKPI(undefined);
  };

  return (
    <Box
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
        open={!!editingKPI}
        anchor="right"
        onClose={() => setEditingKPI(undefined)}
      >
        <Box
          display={'flex'}
          justifyContent={'flex-end'}
          pt={'12px'}
        >
          <IconButton onClick={() => setEditingKPI(undefined)}>
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
              <Typography sx={styles.inputLabel}>Circle</Typography>
              <Typography sx={styles.labelContent}>HR</Typography>
            </Stack>
            <Stack
              direction={'row'}
              columnGap={'24px'}
            >
              <Typography sx={styles.inputLabel}>KPI Type</Typography>
              <Typography sx={styles.labelContent}>
                {editingKPI?.kpiName}
              </Typography>
            </Stack>
            <FormControl>
              <FormLabel>Period</FormLabel>
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
              value={editingKPI?.kpiPeriod0}
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
              variant="text"
              size="small"
              color="error"
            >
              <DeleteOutlineIcon />
              Delete
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setEditingKPI(undefined)}
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
          </Stack>
        </Stack>
      </Drawer>
    </Box>
  );
};

export default Overview;

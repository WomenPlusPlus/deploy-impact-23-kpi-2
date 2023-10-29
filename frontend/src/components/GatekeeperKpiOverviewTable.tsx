import Box from '@mui/material/Box';
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridValueGetterParams,
} from '@mui/x-data-grid';
import { useEffect } from 'react';
import { KpiOverviewRow } from '../types';

const GatekeeperKpiOverviewTable = ({ rows }: { rows: KpiOverviewRow[] }) => {
  useEffect(() => {}, []);

  const columns: GridColDef[] = [
    {
      field: 'kpiCircle',
      headerName: 'Cirlcle',
      headerClassName: '-first-column-header',
      cellClassName: '-first-column',
      valueGetter: (params: GridValueGetterParams) => {
        const row = rows.find(row => row.id === params.id)!;
        return row.kpi.circle_name!;
      },
      width: 254,
    },
    {
      field: 'kpiName',
      headerName: 'KPI Name',
      headerClassName: '-first-column',
      cellClassName: '-first-column',
      width: 507,
    },
    {
      field: 'kpiAvg',
      headerName: 'Avg.',
      valueGetter: (params: GridValueGetterParams) => {
        let total = 0,
          count = 0;
        const row = rows.find(row => row.id === params.id)!;
        for (let i = 0; i < 12; ++i) {
          const kpiValue = Object.getOwnPropertyDescriptor(
            row,
            `kpiPeriod${i}`
          )?.value;
          if (kpiValue) {
            total += kpiValue;
            count += 1;
          }
        }
        return `${(total / count).toFixed(1)}`;
      },
      width: 254,
      editable: false,
      sortable: false,
      headerAlign: 'right',
    },
    {
      field: 'kpiTarget',
      headerName: 'Target',
      width: 254,
      sortable: false,
      headerAlign: 'right',
    },
  ];

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
            borderRight: '1px solid var(--sunglow-600, #FBBB21)',
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
            justifyContent: 'flex-start',
          },
          '& .-first-column-header': {
            justifyContent: 'flex-start',
            borderLeft: '1px solid var(--sunglow-600, #FBBB21)',
          },
        }}
      />
    </Box>
  );
};

export default GatekeeperKpiOverviewTable;

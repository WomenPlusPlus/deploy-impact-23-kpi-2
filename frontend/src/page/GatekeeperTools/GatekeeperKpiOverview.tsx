import {
  Breadcrumbs,
  Button,
  Dialog,
  DialogContent,
  Stack,
  Typography,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from '@mui/x-data-grid';
import { ReactComponent as EditIcon } from '../../assets/Pencil-alt.svg';
import { useContext, useEffect, useState } from 'react';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { globalStyles } from '../../styles';
import { Circle, Kpi, KpiOverviewRow } from '../../types';
import { UserContext } from '../../utils/context';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Link, useNavigate } from 'react-router-dom';
import { headerTabRoutes } from '../../utils/route';
import { circleGetAllApi } from '../../services/circleService';
import { kpiEditApi, kpiGetAllApi } from '../../services/kpiService';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import { ReactComponent as SuccessIcon } from '../../assets/Trash.svg';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ReactComponent as ConfirmIcon } from '../../assets/Question-circle.svg';
import { ReactComponent as CancelIcon } from '../../assets/X-circle.svg';
import { autoLoginAfterExpire } from '../../utils';

const GatekeeperKpiOverview = () => {
  const { user, setUser } = useContext(UserContext);
  const [kpiTableRows, setKpiTableRows] = useState<KpiOverviewRow[]>([]);
  const [deleteKpiSuccess, setDeleteKpiSuccess] = useState('');
  const [deleteKpiConfirm, setDeleteKpiConfirm] = useState(-1);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.id < 0) return;
    if (kpiTableRows.length === 0) {
      circleGetAllApi(user.token)
        .then(res => {
          const circles: Circle[] = res.circles;
          kpiGetAllApi(user.token)
            .then(res => {
              setKpiTableRows(
                res.kpi_list.map((kpi: Kpi) => {
                  return {
                    id: kpi.id,
                    kpi: {
                      ...kpi,
                      circle_name: circles.find(
                        circle => circle.id === kpi.circle_id
                      )!.name,
                    } as Kpi,
                    kpiName: kpi.name,
                    kpiActive: kpi.active ? 'Active' : 'Inactive',
                  };
                })
              );
            })
            .catch(err => console.log(err));
        })
        .catch(err => {
          if (err.response.status === 401)
            autoLoginAfterExpire(user, setUser).catch(err =>
              navigate('/login')
            );
          else console.log(err);
        });
    }
  }, [kpiTableRows.length, user, navigate, setUser]);

  const columns: GridColDef[] = [
    {
      field: 'kpiName',
      headerName: 'KPI Name',
      headerClassName: '-first-column-header',
      width: 507,
    },
    {
      field: 'kpiCircle',
      headerName: 'Circle',
      valueGetter: (params: GridValueGetterParams) => {
        const row = kpiTableRows.find(row => row.id === params.id)!;
        return row.kpi.circle_name!;
      },
      width: 254,
    },
    {
      field: 'kpiActive',
      headerName: 'Active',
      width: 254,
    },
    {
      field: 'option',
      headerName: 'Option',
      width: 254,
      sortable: false,
      cellClassName: '-action-column',
      renderCell: (params: GridRenderCellParams<any, any>) => (
        <Stack
          direction={'row'}
          columnGap={'55px'}
        >
          <Button
            variant="outlined"
            onClick={() => handleEditKpi(params.row.id)}
            sx={globalStyles.buttonTinySize}
          >
            <EditIcon />
            Edit
          </Button>
          <Button
            variant="text"
            color="error"
            onClick={() => handleDeleteKpi(params.row.id)}
            sx={globalStyles.buttonTinySize}
          >
            <DeleteOutlineIcon sx={{ fontSize: '16px' }} />
            Remove
          </Button>
        </Stack>
      ),
    },
  ];

  const handleEditKpi = (id: number) => {
    navigate(`/${headerTabRoutes.tab[2]}/kpi/edit/${id}`);
  };

  const handleDeleteKpi = (id: number) => {
    setDeleteKpiConfirm(id);
  };

  const submitDeleteKpi = (kpi: Kpi) => {
    kpiEditApi({ ...kpi, active: false }, user.token)
      .then(res => {
        setDeleteKpiConfirm(-1);
        setDeleteKpiSuccess(kpi.name);
      })
      .catch(err => console.error(err));
  };

  return (
    <>
      <Stack rowGap={'48px'}>
        <Stack direction={'row'}>
          <Breadcrumbs
            separator={<NavigateNextIcon sx={{ fontSize: '24px' }} />}
            sx={{ flexGrow: 1 }}
          >
            [
            <Link
              to={`/${headerTabRoutes.tab[2]}`}
              style={globalStyles.pageHistory}
            >
              Gatekeeper Tools
            </Link>
            ,<Typography sx={globalStyles.pageTitle}>KPI Overview</Typography>]
          </Breadcrumbs>
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate(`/${headerTabRoutes.tab[2]}/kpi/create`)}
          >
            <NoteAddOutlinedIcon sx={{ fontSize: '20px' }} />
            Create New KPI
          </Button>
        </Stack>
        <DataGrid
          rows={kpiTableRows}
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
            '& .-first-column-header': {
              borderLeft: '1px solid var(--sunglow-600, #FBBB21)',
            },
          }}
        />
      </Stack>
      <Dialog
        open={deleteKpiConfirm >= 0}
        onClose={() => setDeleteKpiConfirm(-1)}
      >
        <DialogContent>
          <ConfirmIcon />
          <Typography
            sx={{
              fontSize: '16px',
              fontWeight: 400,
              height: '48px',
              textAlign: 'center',
            }}
          >
            Are you sure you want to remove this item from the KPI list?
          </Typography>
          <Stack
            direction={'row'}
            columnGap={'24px'}
          >
            <Button
              variant="outlined"
              size="small"
              onClick={() => setDeleteKpiConfirm(-1)}
            >
              <CancelIcon />
              Cancel
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() =>
                submitDeleteKpi(
                  kpiTableRows.find(row => row.id === deleteKpiConfirm)!.kpi
                )
              }
            >
              <DeleteOutlineIcon fontSize="small" />
              Proceed
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
      <Dialog
        open={deleteKpiSuccess.length > 0}
        onClose={() => setDeleteKpiSuccess('')}
      >
        <DialogContent>
          <SuccessIcon />
          <Typography
            sx={{ fontSize: '16px', fontWeight: 400, height: '48px' }}
          >
            {deleteKpiSuccess} successfully removed
          </Typography>
          <Button
            variant="contained"
            onClick={() => setDeleteKpiSuccess('')}
          >
            <ArrowBackIcon />
            Go back to KPI Overview
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GatekeeperKpiOverview;

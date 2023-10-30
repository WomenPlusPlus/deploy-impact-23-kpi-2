import axios from 'axios';
import { KPI_ADD, KPI_EDIT, KPI_GET, KPI_GET_ALL } from './routes';
import { Kpi } from '../types';

export const kpiGetAllApi = async (token: string) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.get(KPI_GET_ALL, config);
  if (response.status === 200) {
    return response.data;
  } else throw response;
};

export const kpiGetApi = async (kpiId: number, token: string) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.get(KPI_GET(kpiId), config);
  if (response.status === 200) {
    return response.data;
  } else throw response;
};

export const kpiAddApi = async (kpi: Kpi, token: string) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const params = {
    circle_id: kpi.circle_id,
    name: kpi.name,
    periodicity: kpi.periodicity,
    unit: kpi.unit === '%' ? 'percentage' : kpi.unit,
    initial_value: kpi.initial_value,
    target_value: kpi.target_value,
  };
  const response = await axios.post(KPI_ADD, params, config);
  if (response.status === 201) {
    return response.data;
  } else throw response;
};

export const kpiEditApi = async (kpi: Kpi, token: string) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const params = {
    circle_id: kpi.circle_id,
    name: kpi.name,
    periodicity: kpi.periodicity,
    unit: kpi.unit === '%' ? 'percentage' : kpi.unit,
    initial_value: kpi.initial_value,
    target_value: kpi.target_value,
    active: kpi.active ? 'True' : 'False',
  };
  const response = await axios.put(KPI_EDIT(kpi.id), params, config);
  if (response.status === 200) {
    return response.data;
  } else throw response;
};

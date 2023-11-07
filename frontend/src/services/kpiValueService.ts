import axios from 'axios';
import {
  CHANGE_LOG_KPI_VALUE,
  CHANGE_LOG_SEARCH,
  KPI_VALUE_ADD,
  KPI_VALUE_EDIT,
  KPI_VALUE_SEARCH,
} from './routes';
import { KpiValue } from '../types';
import dayjs from 'dayjs';

export const kpiValueGet = () => {};

export const kpiValueSearchApi = async (
  circleId: number,
  period: string,
  token: string
) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      ...(circleId >= 0 ? { circle_id: circleId } : {}),
      period,
    },
  };
  const response = await axios.get(KPI_VALUE_SEARCH, config);
  if (response.status === 200) {
    return response.data;
  } else if (response.status === 204) {
    return {};
  } else throw response;
};

export const kpiValueAddApi = async (kpiValue: KpiValue, token: string) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const params = {
    kpi_id: kpiValue.kpi_id,
    period_year: kpiValue.date!.year(),
    period_month: kpiValue.date!.month() + 1,
    value: kpiValue.value,
  };
  const response = await axios.post(KPI_VALUE_ADD, params, config);
  if (response.status === 201) {
    return response.data;
  } else throw response;
};

export const kpiValueEditApi = async (kpiValue: KpiValue, token: string) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const params = {
    kpi_id: kpiValue.kpi_id,
    period_year: kpiValue.date!.year(),
    period_month: kpiValue.date!.month() + 1,
    value: kpiValue.value,
  };
  const response = await axios.put(KPI_VALUE_EDIT(kpiValue.id), params, config);
  if (response.status === 200) {
    return response.data;
  } else throw response;
};

export const kpiValueChangelogSearchApi = async (
  circleId: number,
  period: string,
  token: string
) => {
  let dateRange = {
    from_year: dayjs().year(),
    to_year: dayjs().year(),
    from_month: dayjs().month(),
    to_month: dayjs().month(),
  };
  switch (period) {
    case 'this_month':
      break;
    case 'last_month':
      dateRange.from_month = dayjs().subtract(1, 'month').month();
      dateRange.to_month = dateRange.from_month;
      break;
    case 'this_quarter':
      dateRange.from_month = Math.floor(dateRange.from_month / 3) * 3;
      break;
    case 'last_quarter':
      dateRange.from_month =
        Math.floor(dayjs().subtract(3, 'month').month() / 3) * 3;
      dateRange.to_month = dateRange.from_month + 2;
      break;
  }
  // change from 0..11 to 1..12, for backend compatibility
  dateRange.from_month += 1;
  dateRange.to_month += 1;

  const config = {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      circle_id: circleId,
      ...dateRange,
    },
  };
  const response = await axios.get(CHANGE_LOG_SEARCH, config);
  if (response.status === 200 || response.status === 204) {
    return response.data;
  } else throw response;
};

export const kpiValueChangelogGetApi = async (
  kpiValueId: number,
  token: string
) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.get(CHANGE_LOG_KPI_VALUE(kpiValueId), config);
  if (response.status === 200) {
    return response.data;
  } else throw response;
};

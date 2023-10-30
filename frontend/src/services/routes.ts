export const API_PREFIX = 'http://127.0.0.1:5000/';

export const USER_LOGIN = API_PREFIX + 'login';
export const USER_GET = (id: number) => API_PREFIX + `users/${id}`;
export const USER_LOGOUT = API_PREFIX + 'logout';

export const KPI_GET_ALL = API_PREFIX + 'kpis';
export const KPI_GET = (id: number) => API_PREFIX + `kpis/${id}`;
export const KPI_ADD = API_PREFIX + 'kpis/add';
export const KPI_EDIT = (id: number) => API_PREFIX + `kpis/${id}/edit`;

export const KPI_VALUE_SEARCH = API_PREFIX + 'kpi_values';
export const KPI_VALUE_ADD = API_PREFIX + 'kpi_values/add';
export const KPI_VALUE_EDIT = (id: number) =>
  API_PREFIX + `kpi_values/${id}/edit`;

export const CIRCLE_GET_ALL = API_PREFIX + 'circles';

export const CHANGE_LOG_SEARCH = API_PREFIX + 'kpi_values/change_log';
export const CHANGE_LOG_KPI_VALUE = (id: number) =>
  API_PREFIX + `kpi_values/${id}/change_log`;

import { Dayjs } from 'dayjs';

export interface User {
  id: number;
  isGatekeeper: boolean;
  email: string;
  token: string;
}

export interface UserProfile {
  active: boolean;
  circles: { id: number; name: string }[];
  display_name: string;
  email: string;
  first_name: string;
  id: number;
  last_name: string;
  user_login_name: string;
}

export interface Circle {
  id: number;
  name: string;
}

export type KpiPeriod = 'Yearly' | 'Quarterly' | 'Monthly';
export const isKpiPeriod = (x: string): x is KpiPeriod =>
  x === 'Yearly' || x === 'Quarterly' || x === 'Monthly';

export type KpiUnit = 'chf' | '%' | 'amount' | 'score';
export const isKpiUnit = (x: string): x is KpiUnit =>
  x === 'chf' || x === '%' || x === 'amount' || x === 'score';

export interface Kpi {
  active?: boolean;
  circle_id: number;
  circle_name?: string;
  id: number;
  initial_value: number;
  name: string;
  periodicity: KpiPeriod;
  target_value: number;
  unit: KpiUnit;
}

export const dummyKpi: Kpi = {
  circle_id: -1,
  id: -1,
  name: '',
  periodicity: 'Monthly',
  unit: 'chf',
  target_value: 0,
  initial_value: 0,
};

export interface KpiValue {
  id: number;
  kpi_id: number;
  value: number;
  date: Dayjs | null;
}

export const dummyKpiValue: KpiValue = {
  id: -1,
  kpi_id: -1,
  value: 0,
  date: null,
};

export interface KpiOverviewRow {
  id: number;
  kpi: Kpi;
  kpiName: string;
  kpiPeriod1?: number;
  kpiPeriod2?: number;
  kpiPeriod3?: number;
  kpiPeriod4?: number;
  kpiPeriod5?: number;
  kpiPeriod6?: number;
  kpiPeriod7?: number;
  kpiPeriod8?: number;
  kpiPeriod9?: number;
  kpiPeriod10?: number;
  kpiPeriod11?: number;
  kpiPeriod12?: number;
  kpiPeriod1Id?: number;
  kpiPeriod2Id?: number;
  kpiPeriod3Id?: number;
  kpiPeriod4Id?: number;
  kpiPeriod5Id?: number;
  kpiPeriod6Id?: number;
  kpiPeriod7Id?: number;
  kpiPeriod8Id?: number;
  kpiPeriod9Id?: number;
  kpiPeriod10Id?: number;
  kpiPeriod11Id?: number;
  kpiPeriod12Id?: number;
  kpiTarget: number;
  kpiCreatedAt: string;
}

export interface AggregatedKpi {
  kpi: Kpi;
  value: KpiValue;
}

export interface GraphTooltipParam {
  axisValueLabel: string;
  marker: string;
  seriesName: string;
  value: number;
  name: string;
  data: string;
}

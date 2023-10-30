import { Dayjs } from 'dayjs';
import { userLoginApi } from '../services/userService';
import { User, KpiPeriod, KpiUnit } from '../types';
import { loginUserLocalstorageItemKey } from './context';

let isLogin = false;

export const autoLoginAfterExpire = async (
  user: User,
  setUser: (user: User) => void
) => {
  if (isLogin) return;
  console.log('login session expire, login again...');
  isLogin = true;
  userLoginApi(user.email)
    .then(res => {
      const loginUser = {
        ...user,
        token: res.access_token,
      };
      setUser(loginUser);
      localStorage.setItem(
        loginUserLocalstorageItemKey,
        JSON.stringify(loginUser)
      );
      isLogin = false;
    })
    .catch(err => {
      isLogin = false;
      throw err;
    });
};

export const isPeriod = (date: Dayjs, period: KpiPeriod | undefined) => {
  if (!period) return false;
  const month = date.get('month');
  switch (period) {
    case 'Monthly':
      return true;
    case 'Quarterly':
      if (month % 3 === 2) return true;
      else return false;
    case 'Yearly':
      if (month === 11) return true;
      else return false;
  }
};

export const checkUnitValidity = (unit: KpiUnit, value: number) => {
  if (value < 0 || Number.isNaN(value)) {
    return false;
  }
  switch (unit) {
    case 'chf':
    case 'amount':
    case 'score':
      break;
    case '%':
      if (value > 100) {
        return false;
      }
  }
  return true;
};

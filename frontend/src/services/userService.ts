import axios from 'axios';
import { USER_GET, USER_LOGIN, USER_LOGOUT } from './routes';

export const userLoginApi = async (email: string) => {
  const params = {
    email,
  };
  const response = await axios.post(USER_LOGIN, params);
  if (response.status === 200) {
    return response.data;
  } else throw response;
};

export const userGetApi = async (userId: number, token: string) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.get(USER_GET(userId), config);
  if (response.status === 200) {
    return response.data;
  } else throw response;
};

export const userLogoutApi = async (token: string) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.delete(USER_LOGOUT, config);
  if (response.status === 200) {
    return response.data;
  } else throw response;
};

import axios from 'axios';
import { CIRCLE_GET_ALL } from './routes';

export const circleGetAllApi = async (token: string) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.get(CIRCLE_GET_ALL, config);
  if (response.status === 200) {
    return response.data;
  } else throw response;
};

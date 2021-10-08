import axios, { AxiosResponse } from 'axios';
const api = `${process.env.REACT_APP_API_URL || ''}`;

async function get<ResponsePayload = {}>(endpoint: string): Promise<ResponsePayload> {
  const { data } = await axios.request<void, AxiosResponse<ResponsePayload>>({
    url: `${api}/${endpoint}`,
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return data;
}

export const apiService = {
  get,
};

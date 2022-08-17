import axios from 'axios';

export const baseUrl = 'https://dummyjson.com';

export const get = (url: string) => axios.get(baseUrl + url);

export const post = (url: string, body: unknown) =>
  axios.post(baseUrl + url, body);

export const put = (url: string, body: unknown) =>
  axios.put(baseUrl + url, body);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deleteReq = (url: string, body: any = {}) =>
  axios.delete(baseUrl + url, body);

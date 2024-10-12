import axios from "axios";

const BASE_URL = "https://theater-reservation-system-production.up.railway.app";


export default axios.create({
  baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "content-type": "application/json" },
  withCredentials: true,
});

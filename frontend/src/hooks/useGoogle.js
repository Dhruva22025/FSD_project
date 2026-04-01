import axios from "axios";
import { API_BASE } from "./api";

const api = axios.create({
  baseURL: API_BASE,
});

export const googleAuth = (code: any) => api.get(`/google?code=${code}`);

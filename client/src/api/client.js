import axios from "axios";
import { API_BASE_URL } from "./config";

export const AUTH_TOKEN_KEY = "flashcard_maker_token";



const api = axios.create({
  baseURL: `${API_BASE_URL}/api`, 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

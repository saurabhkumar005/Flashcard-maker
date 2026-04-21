import api, { AUTH_TOKEN_KEY } from "./client";

export const signUp = async ({ name, email, password }) => {
  const { data } = await api.post("/auth/signup", { name, email, password });
  return data;
};

export const login = async ({ email, password }) => {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
};

export const getMe = async () => {
  const { data } = await api.get("/auth/me");
  return data;
};

export const persistToken = (token) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const clearToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

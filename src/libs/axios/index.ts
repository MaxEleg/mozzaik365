import axios from "axios";
import { MEME_API_TOKEN_KEY } from "../../config/constants";

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

// Create an Axios instance for memeApi
export const memeApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setMemeApiToken = (token: string) => {
  memeApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  localStorage.setItem(MEME_API_TOKEN_KEY, token);
};

export type PaginatedMemeApiResponse<T> = {
  results: ReadonlyArray<T>;
  total: number;
  pageSize: number;
};

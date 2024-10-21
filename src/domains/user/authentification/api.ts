import { memeApi } from "../../../libs/axios";
import { LoginResponse } from "./types";

export const login = async (username: string, password: string) => {
  const { data } = await memeApi.post<LoginResponse>(
    "/authentication/login",
    { username, password },
    { headers: { "Content-Type": "application/json" } }
  );

  return data;
};

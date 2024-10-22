import { useMutation } from "@tanstack/react-query";
import { login } from "./api";
import { useAuthentication } from "../../../contexts/authentication";
import { LoginResponse } from "./types";
import { AxiosError } from "axios";

export const usePostAuth = () => {
  const { authenticate } = useAuthentication();
  return useMutation<
    LoginResponse,
    AxiosError,
    { username: string; password: string }
  >({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const res = await login(credentials.username, credentials.password);
      authenticate(res.jwt);

      return res;
    },
  });
};

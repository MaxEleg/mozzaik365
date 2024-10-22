import { useQuery } from "@tanstack/react-query";
import { QueryParams } from "../../libs/react-query/types";
import { userQueryKeys } from "./userQueryKeys";
import { getUserById, getUsersFromIds } from "./api";
import { useAuthToken } from "../../contexts/authentication";
import { jwtDecode } from "jwt-decode";

export const useGetUsers = (
  ids: ReadonlyArray<string>,
  options?: QueryParams
) => {
  return useQuery({
    ...options,
    queryKey: userQueryKeys.getUsersKeys(ids),
    queryFn: () => getUsersFromIds(ids),
  });
};

export const useGetUser = () => {
  const token = useAuthToken();
  return useQuery({
    queryKey: userQueryKeys.getUserKeys(token),
    queryFn: async () => getUserById(jwtDecode<{ id: string }>(token).id),
    enabled: !!token,
  });
};

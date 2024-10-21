import { useQuery } from "@tanstack/react-query";
import { QueryParams } from "../../libs/react-query/types";
import { userQueryKeys } from "./userQueryKeys";
import { getUsersFromIds } from "./api";

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

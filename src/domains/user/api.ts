import { memeApi } from "../../libs/axios";
import { GetUsersByIdsResponse } from "./types";

export const getUsersFromIds = async (ids: ReadonlyArray<string>) => {
  const { data } = await memeApi.get<GetUsersByIdsResponse>(
    `/users?ids=${ids.join(`&ids=`)}`
  );

  return data;
};

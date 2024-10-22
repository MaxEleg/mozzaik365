import { memeApi } from "../../libs/axios";
import { GetUserByIdResponse, GetUsersByIdsResponse } from "./types";

export const getUsersFromIds = async (ids: ReadonlyArray<string>) => {
  const { data } = await memeApi.get<GetUsersByIdsResponse>(
    `/users?ids=${ids.join(`&ids=`)}`
  );

  return data;
};

export const getUserById = async (id: string) => {
  const { data } = await memeApi.get<GetUserByIdResponse>(`/users/${id}`);

  return data;
};

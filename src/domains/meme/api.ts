import { memeApi } from "../../libs/axios";
import { GetMemesResponse } from "./types";

export const getMemes = async (pageNumber: number) => {
  const { data } = await memeApi.get<GetMemesResponse>(
    `/memes?Page=${pageNumber}`
  );

  return data;
};

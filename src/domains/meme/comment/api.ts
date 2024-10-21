import { memeApi } from "../../../libs/axios";
import { Comment, GetCommentsResponse } from "./types";

export const getComments = async (memeId: string, pageNumber: number) => {
  const { data } = await memeApi.get<GetCommentsResponse>(
    `/memes/${memeId}/comments?page=${pageNumber || 1}`
  );

  return data;
};

export const postComment = async (memeId: string, content: string) => {
  const { data } = await memeApi.post<Comment>(`/memes/${memeId}/comments`, {
    content,
  });

  return data;
};

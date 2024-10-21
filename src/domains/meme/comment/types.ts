import { PaginatedMemeApiResponse } from "../../../libs/axios";

export type Comment = {
  id: string;
  authorId: string;
  memeId: string;
  content: string;
  createdAt: string;
};

export type GetCommentsResponse = PaginatedMemeApiResponse<Comment>;

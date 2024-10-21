import { PaginatedMemeApiResponse } from "../../libs/axios";
import { User } from "../user/types";

export type Meme = {
  id: string;
  authorId: User["id"];
  pictureUrl: User["pictureUrl"];
  description: string;
  commentsCount: number;
  texts: ReadonlyArray<{
    content: string;
    x: number;
    y: number;
  }>;
  createdAt: string;
};

export type GetMemesResponse = PaginatedMemeApiResponse<Meme>;

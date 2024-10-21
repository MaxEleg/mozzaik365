import { Comment } from "../../../../domains/meme/comment/types";
import { Meme } from "../../../../domains/meme/types";
import { GetUsersByIdsResponse } from "../../../../domains/user/types";
import { PaginatedMemeApiResponse } from "../../../../libs/axios";

const currentDate = new Date();

const twoDaysAgo = new Date(currentDate.setDate(currentDate.getDate() - 2));
const threeYearsAgo = new Date().setFullYear(currentDate.getFullYear() - 3);

export const memesResponseFixture: PaginatedMemeApiResponse<Meme> = {
  total: 2,
  pageSize: 10,
  results: [
    {
      id: "dummy-meme-id-1",
      authorId: "user-1",
      pictureUrl: "https://dummy.url/meme/1",
      description: "Dummy meme 1",
      commentsCount: 2,
      texts: [
        { content: "dummy text 1", x: 0, y: 0 },
        { content: "dummy text 2", x: 100, y: 100 },
      ],
      createdAt: twoDaysAgo.toString(),
    },
    {
      id: "dummy-meme-id-2",
      authorId: "user-2",
      pictureUrl: "https://dummy.url/meme/2",
      description: "Dummy meme 2",
      commentsCount: 3,
      texts: [
        { content: "dummy text 3", x: 0, y: 0 },
        { content: "dummy text 4", x: 100, y: 100 },
      ],
      createdAt: threeYearsAgo.toString(),
    },
  ],
};

export const usersListResponseFixture: GetUsersByIdsResponse = [
  {
    id: "user-1",
    username: "TestUser1",
    pictureUrl: "imageURL2",
  },
  {
    id: "user-2",
    username: "TestUser2",
    pictureUrl: "imageURL2",
  },
];

export const meme1commentsResponse: PaginatedMemeApiResponse<Comment> = {
  total: 2,
  pageSize: 10,
  results: [
    {
      id: "dummy-comment-id-1",
      authorId: "user-1",
      memeId: "dummy-meme-id-1",
      content: "dummy comment 1",
      createdAt: twoDaysAgo.toString(),
    },
    {
      id: "dummy-comment-id-2",
      authorId: "user-2",
      memeId: "dummy-meme-id-1",
      content: "dummy comment 2",
      createdAt: twoDaysAgo.toString(),
    },
  ],
};

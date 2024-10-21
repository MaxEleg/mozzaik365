import { cloneDeep } from "lodash";
import { useMemo } from "react";
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { GetCommentsResponse } from "./types";
import { commentQueryKeys } from "./commentQueryKeys";
import { getComments, postComment } from "./api";
import { QueryParams } from "../../../libs/react-query/types";
import { getPaginatedNextPage } from "../../../utils";
import { GetMemesResponse } from "../types";
import { memeQueryKeys } from "../memeQueryKeys";

export const useGetInfiniteComments = (
  memeId: string,
  options?: QueryParams
) => {
  const { data, ...rest } = useInfiniteQuery<GetCommentsResponse>({
    ...options,
    queryKey: commentQueryKeys.getCommentsKeys(memeId),
    queryFn: ({ pageParam = 0 }) => getComments(memeId, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allLoadedPages) =>
      getPaginatedNextPage(lastPage, allLoadedPages),
  });

  return {
    ...rest,
    data: useMemo(
      () => data?.pages.flatMap((page) => page.results) || [],
      [data]
    ),
  };
};

export const usePostComment = () => {
  type PostCommentParams = {
    memeId: string;
    content: string;
  };
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ memeId, content }: PostCommentParams) => {
      const newComment = await postComment(memeId, content);

      queryClient.setQueryData<InfiniteData<GetCommentsResponse, number>>(
        // here we need to add the new comment to the beginning of the first page
        commentQueryKeys.getCommentsKeys(memeId),
        (
          oldData = {
            pages: [{ results: [], total: 0, pageSize: 0 }],
            pageParams: [],
          }
        ) => {
          const newData = cloneDeep(oldData);

          newData.pages[0].results = [
            newComment,
            ...(newData?.pages[0].results || []),
          ];

          return newData;
        }
      );

      // we need to increase the comments count number
      queryClient.setQueryData<InfiniteData<GetMemesResponse, number>>(
        memeQueryKeys.getMemesKeys(),
        (
          oldData = {
            pages: [{ results: [], total: 0, pageSize: 0 }],
            pageParams: [],
          }
        ) => ({
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            results: page.results.map((meme) => ({
              ...meme,
              commentsCount:
                // if the meme id is the same as the new comment
                // then we need to increase the count to +1 because
                // of the new comment we just added
                meme.id === newComment.memeId
                  ? meme.commentsCount + 1
                  : meme.commentsCount,
            })),
          })),
        })
      );
    },
  });
};

export const useGetCommentsAuthorsIds = (memeId: string) => {
  const { data } = useGetInfiniteComments(memeId, { enabled: false });

  return useMemo(() => {
    return Object.keys(
      data?.reduce((acc: Record<string, string>, comment) => {
        acc[comment.authorId] = comment.authorId;
        return acc;
      }, {})
    );
  }, [data]);
};

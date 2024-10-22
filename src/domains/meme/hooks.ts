import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { GetMemesResponse } from "./types";
import { memeQueryKeys } from "./memeQueryKeys";
import { getMemes, postMeme } from "./api";
import { QueryParams } from "../../libs/react-query/types";
import { useMemo } from "react";
import { getPaginatedNextPage } from "../../utils";

export const useGetInfiniteMemes = (options?: QueryParams) => {
  const { data, ...rest } = useInfiniteQuery<GetMemesResponse>({
    ...options,
    queryKey: memeQueryKeys.getMemesKeys(),
    queryFn: ({ pageParam = 0 }) => getMemes(pageParam as number),
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

export const usePostMeme = () => {
  return useMutation({
    mutationFn: postMeme,
  });
};

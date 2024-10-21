import { useInView } from "react-intersection-observer";
import { useGetInfiniteMemes } from "../../../domains/meme/hooks";
import { useEffect } from "react";

export const useGetMemesOnScrollEnd = () => {
  const { ref, inView } = useInView();
  const { data, fetchNextPage, isLoading, status, hasNextPage } =
    useGetInfiniteMemes();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  return {
    ref,
    data,
    isLoading,
    status,
    hasNextPage,
  };
};

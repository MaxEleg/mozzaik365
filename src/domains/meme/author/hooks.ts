import { useMemo } from "react";
import { useGetInfiniteMemes } from "../hooks";

export const useGetMemesAuthorsIds = () => {
  const { data } = useGetInfiniteMemes({ enabled: false });

  return useMemo(() => {
    // here we accumulate all the authors ids from all the pages
    const mappedMemeIds = data?.reduce((acc: Record<string, string>, meme) => {
      acc[meme.authorId] = meme.authorId;
      return acc;
    }, {});

    return Object.keys(mappedMemeIds || {});
  }, [data]);
};

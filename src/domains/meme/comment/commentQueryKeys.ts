import { QUERY_KEYS_INDEX } from "../../../libs/react-query";

export const commentQueryKeys = {
  getCommentsKeys: (memeId: string) =>
    [QUERY_KEYS_INDEX.COMMENTS, memeId] as const,
} as const;

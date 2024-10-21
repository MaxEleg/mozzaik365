import { QUERY_KEYS_INDEX } from "../../libs/react-query";

export const memeQueryKeys = {
  getMemesKeys: () => [QUERY_KEYS_INDEX.MEMES] as const,
} as const;

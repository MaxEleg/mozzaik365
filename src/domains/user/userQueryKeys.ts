import { QUERY_KEYS_INDEX } from "../../libs/react-query";

export const userQueryKeys = {
  getUsersKeys: (ids: ReadonlyArray<string>) =>
    [QUERY_KEYS_INDEX.USERS, ids] as const,
} as const;

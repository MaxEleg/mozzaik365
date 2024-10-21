import { format } from "timeago.js";
import { PaginatedMemeApiResponse } from "../libs/axios";

export const getPaginatedNextPage = <C>(
  lastPage: PaginatedMemeApiResponse<C>,
  allLoadedPages: PaginatedMemeApiResponse<C>[]
) => {
  const totalPages = Math.ceil(lastPage.total / lastPage.pageSize);
  const currentPageNumber = allLoadedPages.length;
  // if we are not at the latest page, we can load the next one
  return currentPageNumber < totalPages ? currentPageNumber + 1 : undefined;
};

export const formatDate = (dateStr: string) => format(dateStr);

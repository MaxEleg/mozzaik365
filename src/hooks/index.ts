import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { memeApi } from "../libs/axios";
import { useAuthentication } from "../contexts/authentication";
import { AxiosError, AxiosResponse } from "axios";

export const useRefetchOnScroll = (refetch: () => void) => {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      refetch();
    }
  }, [refetch, inView]);

  return {
    ref,
  };
};

// this hook will add an even listener when the backend error is 401 (Unauthorized)
// then we must logout the user
export const useLogoutOnUnauthorizedToken = () => {
  const { signout, state } = useAuthentication();
  useEffect(() => {
    memeApi.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error?.response?.status === 401 && state.isAuthenticated) {
          // if the response status is 401 we logout the user
          signout();
        }

        return Promise.reject(error);
      }
    );
  }, [signout, state]);
};

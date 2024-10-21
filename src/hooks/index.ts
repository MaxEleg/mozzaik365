import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

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

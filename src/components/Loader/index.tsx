import { Flex, Spinner } from "@chakra-ui/react";
import { forwardRef } from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export const Loader = forwardRef<HTMLDivElement, Props>((props, ref) => {
  return (
    <Flex
      {...props}
      ref={ref}
      width="full"
      height="full"
      alignItems="center"
      justifyContent="center"
    >
      <Spinner color="cyan.600" size="xl" />
    </Flex>
  );
});

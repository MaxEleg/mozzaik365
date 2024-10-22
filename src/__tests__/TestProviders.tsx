import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthenticationContext } from "../contexts/authentication";

export const TestProviders = ({ children }: { children?: React.ReactNode }) => (
  <ChakraProvider>
    <QueryClientProvider client={new QueryClient()}>
      <AuthenticationContext.Provider
        value={{
          state: {
            isAuthenticated: true,
            userId: "dummy_user_id",
            token: "dummy_token",
          },
          authenticate: () => {},
          signout: () => {},
        }}
      >
        {children}
      </AuthenticationContext.Provider>
    </QueryClientProvider>
  </ChakraProvider>
);

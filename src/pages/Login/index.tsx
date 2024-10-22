import {
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Text,
  Input,
  Button,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Navigate, useSearch } from "@tanstack/react-router";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAuthentication } from "../../contexts/authentication";
import { AxiosError } from "axios";
import { usePostAuth } from "../../domains/user/authentification/hook";
import { LoginFormType } from "./types";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginFormSchema } from "./validation";

function ApiError({ error }: { error: AxiosError }) {
  if (error.status === 401) {
    return <FormErrorMessage>Wrong credentials</FormErrorMessage>;
  }
  return (
    <FormErrorMessage>
      An unknown error occured, please try again later
    </FormErrorMessage>
  );
}

export const LoginPage = () => {
  const { state } = useAuthentication();
  const { mutate, error, isPending } = usePostAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>({
    resolver: yupResolver(loginFormSchema),
  });
  const redirect = useSearch({
    select: (url) => url?.redirect,
    from: "/login",
  });
  const onSubmit: SubmitHandler<LoginFormType> = async (data) => {
    const { username, password } = data;

    if (!username || !password) {
      return;
    }

    mutate({
      username,
      password,
    });
  };

  if (state.isAuthenticated) {
    return <Navigate to={redirect ?? "/"} />;
  }
  return (
    <Flex
      height="full"
      width="full"
      alignItems="center"
      justifyContent="center"
    >
      <Flex
        direction="column"
        bgGradient="linear(to-br, cyan.100, cyan.200)"
        p={8}
        borderRadius={16}
      >
        <Heading as="h2" size="md" textAlign="center" mb={4}>
          Login
        </Heading>
        <Text textAlign="center" mb={4}>
          Welcome back! 👋
          <br />
          Please enter your credentials.
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              placeholder="Enter your username"
              bg="white"
              size="sm"
              borderColor={errors.username ? "red" : undefined}
              {...register("username")}
            />
          </FormControl>
          <FormControl isInvalid={error !== null}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter your password"
              bg="white"
              size="sm"
              borderColor={errors.password ? "red" : undefined}
              {...register("password")}
            />
            {error && <ApiError error={error} />}
          </FormControl>
          <Button
            color="white"
            colorScheme="cyan"
            mt={4}
            size="sm"
            type="submit"
            width="full"
            isLoading={isPending}
          >
            Login
          </Button>
        </form>
      </Flex>
    </Flex>
  );
};

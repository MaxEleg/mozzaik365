import { Menu } from "../components/Menu";
import { createRootRouteWithContext } from "@tanstack/react-router";
import { AuthenticationState } from "../contexts/authentication";

type RouterContext = {
  authState: AuthenticationState;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Menu,
});

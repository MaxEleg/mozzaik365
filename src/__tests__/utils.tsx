import React, { PropsWithChildren } from "react";
import {
  ListenerFn,
  Outlet,
  RouterEvents,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { render } from "@testing-library/react";
import { TestProviders } from "./TestProviders";

function createTestRouter(component: React.FC, currentUrl: string) {
  const rootRoute = createRootRoute({
    component: Outlet,
  });

  const componentRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: currentUrl.split("?")[0],
    component,
  });

  const router = createRouter({
    routeTree: rootRoute.addChildren([componentRoute]),
    history: createMemoryHistory({ initialEntries: [currentUrl] }),
  });

  return router;
}

type RenderWithRouterParams = {
  component: React.FC;
  Wrapper?: React.ComponentType<PropsWithChildren>;
  onNavigate?: ListenerFn<RouterEvents["onBeforeNavigate"]>;
  currentUrl?: string;
};

export function renderWithRouter({
  component,
  Wrapper = React.Fragment,
  onNavigate = () => {},
  currentUrl = "/",
}: RenderWithRouterParams) {
  const router = createTestRouter(component, currentUrl);
  router.subscribe("onBeforeNavigate", onNavigate);
  const renderResult = render(
    <Wrapper>
      {/* @ts-expect-error */}
      <RouterProvider router={router} />;
    </Wrapper>
  );

  return {
    router,
    renderResult,
  };
}

export const renderWithProvider = (children: React.ReactNode) =>
  render(<TestProviders>{children}</TestProviders>);

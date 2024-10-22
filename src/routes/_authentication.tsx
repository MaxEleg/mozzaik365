import { createFileRoute } from "@tanstack/react-router";
import { Authentication } from "../pages/Authentication";

export const Route = createFileRoute("/_authentication")({
  component: Authentication,
});

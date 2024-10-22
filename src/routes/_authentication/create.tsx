import { createFileRoute } from "@tanstack/react-router";
import { CreateMemePage } from "../../pages/CreateMemePage";

export const Route = createFileRoute("/_authentication/create")({
  component: CreateMemePage,
});

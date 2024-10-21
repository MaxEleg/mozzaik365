import { Navigate, Outlet, useLocation } from "@tanstack/react-router";
import { useAuthentication } from "../../contexts/authentication";

export const Authentication = () => {
  const { state } = useAuthentication();
  const { pathname } = useLocation();

  if (!state.isAuthenticated) {
    return <Navigate to="/login" search={{ redirect: pathname }} replace />;
  }

  return <Outlet />;
};

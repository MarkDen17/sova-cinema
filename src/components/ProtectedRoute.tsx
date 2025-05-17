import { Navigate, Outlet, useLocation } from "react-router"
import { useAppSelector } from "../hooks/hooks";
import { selectUser } from "../features/user/userSlice";

interface ProtectedRouteProps {
  redirectPath?: string
}

function ProtectedRoute({ redirectPath = "/login" }: ProtectedRouteProps) {
  const user = useAppSelector(selectUser);
  const path = useLocation().pathname;

  if (!user.isAuth) {
    return <Navigate to={redirectPath} replace state={path} />;
  }
  return <Outlet />;
}

export default ProtectedRoute
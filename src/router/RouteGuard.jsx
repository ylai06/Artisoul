import { Navigate } from "react-router-dom";
import { useSolidAuth } from "@ldo/solid-react";
import { useSession } from "@inrupt/solid-ui-react";

const RouteGuard = (props) => {
  const { session } = useSession();
  console.log("RouteGuard session:", session);

  if (!session.info.isLoggedIn) {
    return <Navigate to="/home" replace />;
  }
  return props.children;
};

export default RouteGuard;

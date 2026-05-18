// src/components/ProtectedRoute.jsx

import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ role }) => {

  const user = JSON.parse(
    sessionStorage.getItem("user")
  );

 

  if (!user) {
    return (
      <Navigate
        to={`/${role}/login`}
        replace
      />
    );
  }

  if (
    role &&
    user.role !== role
  ) {
    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
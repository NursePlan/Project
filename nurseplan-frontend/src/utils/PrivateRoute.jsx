import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function PrivateRoute({ children, allowedRoles }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/" />; // Reindirizza al login se non autenticato
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />; // Reindirizza se il ruolo non è autorizzato
  }

  return children; // Renderizza il componente protetto
}

export default PrivateRoute;

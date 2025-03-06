import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // Assicurati che il percorso sia corretto

export const useAuth = () => {
  return useContext(AuthContext);
};
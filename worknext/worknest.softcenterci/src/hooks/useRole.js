import { useLocation } from "react-router-dom";
import { getRoleFromPath } from "../../components/navigation";

export default function useRole() {
  const location = useLocation();
  return getRoleFromPath(location.pathname);
}

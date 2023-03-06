import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getLoginStatus } from "../containers/Login/authReducer";

export const useAuth = () => {
  const [isLogged, setIsLogged] = useState(true);
  const isLoggedIn = useSelector(getLoginStatus);
  useEffect(() => {
    setIsLogged(isLoggedIn);
  }, [isLoggedIn]);

  return { isLogged };
};

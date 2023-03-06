import { useSelector } from "react-redux";

export const useAuth = () => {
  const { isAdmin, isLoggedIn } = useSelector((state) => ({
    isAdmin: state.auth.isAdmin,
    isLoggedIn: state.auth.isLoggedIn,
  }));

  return { isLoggedIn, isAdmin };
};

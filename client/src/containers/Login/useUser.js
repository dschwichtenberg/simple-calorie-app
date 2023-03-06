import { useSelector } from "react-redux";

export const useUser = () => {
  const { userId, userName, isAdmin, dailyCalorieLimit, monthlyPriceLimit } =
    useSelector((state) => state.auth);

  return { userId, userName, isAdmin, dailyCalorieLimit, monthlyPriceLimit };
};

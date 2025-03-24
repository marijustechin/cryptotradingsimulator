import { useEffect } from "react";
import UserService from "../../services/UserService";

export const UserOrdersPage = () => {

  // ko gero šią funkciją reikia naudoti portfolioSlice;
  // ar getUserPortfolio turi būti userService ar kurti portfolioService;
  
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await UserService.getUserPortfolio();
        return response;
      } catch (error) {
        console.error("Error fetching data", error);
      };
    }
    fetchPortfolio()
  }, []);

  return (
    <main className="flex flex-col gap-3">
      <h1>Orders</h1>
    </main>
  );
};

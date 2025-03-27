import { useEffect } from "react";
import { useAppSelector } from "../../store/store";
import { getCurrentPrices } from "../../store/features/trading/chartSlice";
import PriceUpdateService from "../../services/PriceUpdateService";

export const useLivePriceSocket = () => {
  const currentPrices = useAppSelector(getCurrentPrices);
  const userPortfolio = useAppSelector(
    (state) => state.orders.orders?.portfolio || []
  );

  useEffect(() => {
    if (!currentPrices?.symbol || userPortfolio.length === 0) return;

    const hasAsset = userPortfolio.some(
      (item) => item.asset_id === currentPrices.symbol
    );

    if (!hasAsset) return;

    const interval = setInterval(async () => {
      try {
        await PriceUpdateService.updatePrice(
          currentPrices.symbol,
          parseFloat(currentPrices.lastPrice)
        );
      } catch (error) {
        console.error("Error sending to price-update:", error);
      }
    }, 10_000);

    return () => clearInterval(interval);
  }, [currentPrices?.symbol, userPortfolio]);
};

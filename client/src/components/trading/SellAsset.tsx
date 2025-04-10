import { useAppSelector } from '../../store/store';
import { selectUserAssets } from '../../store/features/orders/ordersSlice';
import { selectTradingOptions } from '../../store/features/trading/tradingOptionsSlice';
import { getChartSymbol, getCurrentPrices } from '../../store/features/trading/chartSlice';
import { toast } from 'react-hot-toast';

const SellAsset = async () => {
  const assets = useAppSelector(selectUserAssets);
  const tradingOptions = useAppSelector(selectTradingOptions);
  const selectedCrypto = useAppSelector(getChartSymbol);
  const currentPrices = useAppSelector(getCurrentPrices)

  const { amount, orderType, triggerPrice, orderDirection } = tradingOptions;

  // jeigu triggerPrice tai triggerPrice * amount
  // kai vartotojas parduoda
  // ar turi toki asset
  const asset = assets.find((a) => a.asset === selectedCrypto);

  if (!asset || asset.amount < amount) {
    toast.error("You don't have this asset to sell");
    return;
  }

  const priceToCheck = 
  orderType === 'limit' && triggerPrice
  ? triggerPrice
  : currentPrices?.lastPrice;

  if(orderDirection === 'sell')



};

export default SellAsset;
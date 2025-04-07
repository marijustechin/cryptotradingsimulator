import { useAppSelector } from '../../store/store';
import { selectUserAssets } from '../../store/features/orders/ordersSlice';
import { selectTradingOptions } from '../../store/features/trading/tradingOptionsSlice';
import { getChartSymbol } from '../../store/features/trading/chartSlice';
import { toast } from 'react-hot-toast';

const SellAsset = async () => {
  const assets = useAppSelector(selectUserAssets);
  const tradingOptions = useAppSelector(selectTradingOptions);
  const selectedCrypto = useAppSelector(getChartSymbol);

  const { amount } = tradingOptions;

  // kai vartotojas parduoda
  // ar turi toki asset
  const asset = assets.find((a) => a.asset === selectedCrypto);

  if (!asset || asset.amount < amount) {
    toast.error("You don't have this asset to sell");
    return;
  }

};

export default SellAsset;
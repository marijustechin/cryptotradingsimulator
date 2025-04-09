import { selectTradingOptions } from '../../store/features/trading/tradingOptionsSlice';
import { useAppSelector } from '../../store/store';
import { selectUser } from '../../store/features/user/authSlice';
import { toast } from 'react-hot-toast';
import {
  getCurrentPrices,
  getChartSymbol,
} from '../../store/features/trading/chartSlice';

const BuyAsset = async () => {
  const tradingOptions = useAppSelector(selectTradingOptions);
  const user = useAppSelector(selectUser);
  const currentPrices = useAppSelector(getCurrentPrices);
  const selectedCrypto = useAppSelector(getChartSymbol);

  const { amount, orderType, orderDirection, triggerPrice } = tradingOptions;

  // jei vartotojas perka
  // ar uztenka vartotojo pinigu
  const priceToCheck =
    orderType === 'limit' && triggerPrice
      ? triggerPrice
      : currentPrices?.lastPrice;

  if (
    orderDirection === 'buy' &&
    user?.balance !== undefined &&
    user?.balance !== null &&
    priceToCheck !== undefined &&
    user.balance < amount * priceToCheck
  ) {
    toast.error('Insufficient funds');
    return;
  }


  // vartotojas kai nustato BTC triggerPrice jam raso, kad neuztenka lesu
  // nors jis nustato triggerPrice pagal save
  // bet reikia ir tikrinimo, kad triggerPrice nevirsytu balanso, nes tuomet neleistu ivykdyti

  const totalCost = amount * currentPrices?.lastPrice;

  if (orderType === 'limit' && user?.balance < triggerPrice) {
    toast.error(`Insufficient balance to buy ${selectedCrypto} on limit `);
    return;
  }

  if (orderType === 'market' && user?.balance < totalCost) {
    toast.error(`Insufficient balance to buy ${selectedCrypto}`);
    return;
  }
};

export default BuyAsset;

import axios from 'axios'; // Siunčiam POST į back-end
import { useAppDispatch, useAppSelector } from '../../store/store'; // jau turi
import {
  selectTradingOptions,
  setAmount,
  setTriggerPrice,
} from '../../store/features/trading/tradingOptionsSlice';
import {
  getChartSymbol,
  getCurrentPrices,
} from '../../store/features/trading/chartSlice';

export const HandlePlaceOrder = () => {
    const dispatch = useAppDispatch();
    const tradingOptions = useAppSelector(selectTradingOptions);
    const selectedCrypto = useAppSelector(getChartSymbol);
    const currentPrices = useAppSelector(getCurrentPrices);
  
    const handlePlaceOrder = async () => {
      try {
        const {
          amount,
          orderType,
          orderDirection,
          triggerPrice,
        } = tradingOptions;
  
        const assetId = selectedCrypto;
        const price = orderType === 'limit' ? triggerPrice : currentPrices?.lastPrice;
  
        const res = await axios.post('/api/trade', {
          assetId,
          amount,
          ord_type: orderType,
          ord_direct: orderDirection,
          price,
        });
  
        dispatch(setAmount(0));
        dispatch(setTriggerPrice(0));
      } catch (err: any) {
        console.error('Order failed:', err);
      }
    };
  
    return (
      <button onClick={handlePlaceOrder}></button>
    );
  };
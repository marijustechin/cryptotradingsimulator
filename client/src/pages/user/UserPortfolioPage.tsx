import { PlaceOrderButton } from '../../components/trading/PlaceOrderButton';
import { TopCryptos } from '../../components/trading/TopCryptos';
import { SelectOptions } from '../../components/trading/TradeOptions';

export const UserPortfolioPage = () => {
  return (
    <main>
      <SelectOptions />
      <TopCryptos />
      <PlaceOrderButton />
    </main>
  );
};

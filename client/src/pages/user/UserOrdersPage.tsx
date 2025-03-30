import { useState } from 'react';
import { OpenOrders } from '../../components/orders/OpenOrders';
import { OrdersHistory } from '../../components/orders/OrdersHistory';
import { UserAssets } from '../../components/orders/UserAssets';

const UserOrdersPage = () => {
  const [activeTab, setActiveTab] = useState('oo');

  const buttons = [
    {
      text: 'Open Orders',
      tabCode: 'oo',
    },
    {
      text: 'Order History',
      tabCode: 'oh',
    },
    {
      text: 'Assets',
      tabCode: 'ua',
    },
    {
      text: 'Borrowings',
      tabCode: 'br',
    },
  ];

  return (
    <main>
      <nav className="flex items-center justify-around py-2">
        {buttons.map((button) => (
          <button
            key={button.text}
            onClick={() => setActiveTab(button.tabCode)}
            className={`${
              activeTab === button.tabCode
                ? 'border-violet-400 text-violet-200'
                : 'border-violet-800 text-violet-500'
            } p-2 rounded-lg cursor-pointer border `}
          >
            {button.text}
          </button>
        ))}
      </nav>
      <section>
        {activeTab === 'oo' && <OpenOrders />}
        {activeTab === 'oh' && <OrdersHistory />}
        {activeTab === 'ua' && <UserAssets />}
      </section>
    </main>
  );
};
export default UserOrdersPage;

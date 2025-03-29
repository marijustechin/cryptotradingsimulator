import { useState } from 'react';
import { OpenOrders } from '../../components/orders/OpenOrders';
import { OrdersHistory } from '../../components/orders/OrdersHistory';
import { UserAssets } from '../../components/orders/UserAssets';

const UserOrdersPage = () => {
  const [activeTab, setActiveTab] = useState('oo');
  return (
    <main>
      <nav className="flex items-center justify-around py-2">
        <button
          onClick={() => setActiveTab('oo')}
          className={`${
            activeTab === 'oo'
              ? 'border-violet-400 text-violet-200'
              : 'border-violet-800 text-violet-500'
          } p-2 rounded-lg cursor-pointer border `}
        >
          Open Orders(count)
        </button>
        <button
          onClick={() => setActiveTab('oh')}
          className={`${
            activeTab === 'oh'
              ? 'border-violet-400 text-violet-200'
              : 'border-violet-800 text-violet-500'
          } p-2 rounded-lg cursor-pointer border `}
        >
          Orders History
        </button>
        <button
          onClick={() => setActiveTab('ua')}
          className={`${
            activeTab === 'ua'
              ? 'border-violet-400 text-violet-200'
              : 'border-violet-800 text-violet-500'
          } p-2 rounded-lg cursor-pointer border `}
        >
          Assets
        </button>
        <button
          onClick={() => setActiveTab('br')}
          className={`${
            activeTab === 'br'
              ? 'border-violet-400 text-violet-200'
              : 'border-violet-800 text-violet-500'
          } p-2 rounded-lg cursor-pointer border `}
        >
          Borrowings
        </button>
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

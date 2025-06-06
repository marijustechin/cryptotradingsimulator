import { motion } from 'framer-motion';
import './TopMonthlyUsersCard.css';
import { useTranslation } from 'react-i18next';

interface TopUser {
  userId: number;
  first_name?: string;
  totalFee: number;
  orderCount?: number;
}

const medalIcons = ['\ud83e\udd47', '\ud83e\udd48', '\ud83e\udd49'];
const shimmerClasses = ['gold-shimmer', 'silver-shimmer', 'bronze-shimmer'];

export const TopMonthlyUsersCard = ({ users }: { users: TopUser[] }) => {
  const { t } = useTranslation();
  const sortedUsers = [...users].sort((a, b) => b.totalFee - a.totalFee);

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-md w-full mb-6">
      <h2 className="text-xl font-semibold text-gray-200 mb-5">
        {t('admin_card_top_users_title')}
      </h2>
      {sortedUsers.length === 0 ? (
        <p className="text-gray-400">{t('admin_card_top_users_empty')}</p>
      ) : (
        <ul className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {sortedUsers.map((user, index) => (
            <motion.li
              key={user.userId}
              className={`grid grid-cols-[0.5fr_1.5fr] items-center bg-gray-800 p-4 rounded-lg shadow text-center transition-transform transform hover:scale-105 relative overflow-hidden ${shimmerClasses[index]}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.3, duration: 0.7, ease: 'easeOut' }}
            >
              <div className="text-6xl mb-2">{medalIcons[index]}</div>
              <div>
                <p className="text-white font-medium">{user.first_name}</p>
                <p className="text-emerald-500 font-semibold">
                  ${user.totalFee.toFixed(2)}
                </p>
                {user.orderCount !== undefined && (
                  <p className="text-sm text-gray-400">
                    {t('admin_card_top_users_orders')}: {user.orderCount}
                  </p>
                )}
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
};
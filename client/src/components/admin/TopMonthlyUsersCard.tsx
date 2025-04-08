
interface TopUser {
  userId: number;
  email?: string;
  totalFee: number;
  orderCount?: number; // optional if you plan to extend with count
}

export const TopMonthlyUsersCard = ({ users }: { users: TopUser[] }) => {
  return (
    <div className="bg-gray-700 p-6 rounded-xl shadow-md w-full mb-6">
      <h2 className="text-xl font-semibold text-gray-200 mb-4">Top 3 Users This Month</h2>
      {users.length === 0 ? (
        <p className="text-gray-400">No data available.</p>
      ) : (
        <ul className="space-y-4">
          {users.map((user) => (
            <li
              key={user.userId}
              className="flex justify-between items-center bg-gray-800 p-4 rounded-lg shadow"
            >
              <div>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
              <div className="text-right">
                <p className="text-emerald-400 font-semibold">
                  ${user.totalFee.toFixed(2)}
                </p>
                {user.orderCount !== undefined && (
                  <p className="text-sm text-gray-400">
                    Orders: {user.orderCount}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

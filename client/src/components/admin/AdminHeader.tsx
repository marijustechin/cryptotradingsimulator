import { logoutUser } from '../../store/features/user/authSlice';
import { useAppDispatch } from '../../store/store';

export const AdminHeader = () => {
  const dispatch = useAppDispatch();

  return (
    <header>
      <div
        className="p-2 cursor-pointer"
        onClick={() => dispatch(logoutUser())}
      >
        Logout
      </div>
    </header>
  );
};

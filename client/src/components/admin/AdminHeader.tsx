import { logoutUser } from '../../store/features/user/authSlice';
import { useAppDispatch } from '../../store/store';

export const AdminHeader = () => {
  const dispatch = useAppDispatch();

  return (
    <header className="flex justify-end">
      <button onClick={() => dispatch(logoutUser())} className="btn-generic">
        Logout
      </button>
    </header>
  );
};

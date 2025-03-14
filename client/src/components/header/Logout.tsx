import { useAppDispatch } from '../../store/store';
import { logoutUser } from '../../store/features/user/authSlice';

export const Logout = () => {
  const dispatch = useAppDispatch();

  const logout = () => {
    try {
      dispatch(logoutUser());
    } catch (error) {
      console.log('Error to logout', error);
    }
  };

  return (
    <button onClick={logout} className="btn-generic">
      Logout
    </button>
  );
};

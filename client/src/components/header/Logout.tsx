import { useAppDispatch } from '../../store/store';
import { logoutUser } from '../../store/features/user/authSlice';
import { useTranslation } from 'react-i18next';

export const Logout = () => {
  const { t } = useTranslation();
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
      {t('nav_logout')}
    </button>
  );
};

import { useAppSelector } from '../../store/store';
import { selectUser } from '../../store/features/user/authSlice';
import $api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function BorrowingsButton() {
  const user = useAppSelector(selectUser);
  const { t } = useTranslation();

  const handleBorrow = async () => {
    try {
      await $api.post('/users/borrow', {
        amount: 10000,
        reason: 'Personal use',
      });
      toast.success(t('borrow_success'));
      window.location.reload();
    } catch (err) {
      toast.error(t('borrow_error'));
      console.error(err);
    }
  };

  const canBorrow = () => {
    if (!user) return false;
    if (user.balance && user.balance <= 300) {
      return true;
    } else {
      return false;
    }
  };


  return (
    <div>
      <button
        onClick={handleBorrow}
        className="btn-generic my-6"
        disabled={!canBorrow()}
      >
        {t('borrow_amount_example')}
      </button>
      {!canBorrow() && (
        <p className="text-sm text-red-500">{t('borrow_condition')}</p>
      )}
    </div>
  );
}

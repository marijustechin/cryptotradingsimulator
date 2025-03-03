import { useEffect } from 'react';
import {
  getInfo,
  selectUserInfo,
} from '../../store/features/user/userInfoSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';

export const UserProfilePage = () => {
  const dispatch = useAppDispatch();
  const userData = useAppSelector(selectUserInfo);

  useEffect(() => {
    if (!userData) {
      dispatch(getInfo());
    }
  }, []);
  return (
    <main>
      <div className="max-w-sm mx-auto">
        <p>First Name: {userData?.first_name}</p>
        <p>Last Name: {userData?.last_name}</p>
        <p>Email: {userData?.email}</p>
        <p>Address: {userData?.address}</p>
        <p>Phone number: {userData?.phone_number}</p>
      </div>
    </main>
  );
};

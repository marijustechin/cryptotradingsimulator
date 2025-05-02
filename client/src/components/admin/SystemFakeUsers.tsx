import { useEffect, useState } from 'react';
import {
  generateUsers,
  getSettingsStatus,
  selectFakeUsers,
} from '../../store/features/admin/settingsSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { ConfirmationModal } from '../../components/ConfirmationModal';
import { useTranslation } from "react-i18next";

export const SystemFakeUsers = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const fakeUsersFromStore = useAppSelector(selectFakeUsers);
  const status = useAppSelector(getSettingsStatus);
  const [fakeUsers, setFakeUsers] = useState(0);
  const [ref, setRef] = useState(false);
  const [password, setPassword] = useState('password1');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    if (fakeUsersFromStore !== null) setFakeUsers(fakeUsersFromStore);
  }, [fakeUsersFromStore]);

  const generateFakeUsers = async () => {
    setRef(true);
    await dispatch(
      generateUsers({ usersCount: fakeUsers ?? 100, defaultPassword: password })
    );
    setRef(false);
  };

  const handleModalOpen = () => {
    setModalMessage(t("admin_fake_users_confirm"));
    setIsModalOpen(true);
  };

  const confirmGenerate = async () => {
    setIsModalOpen(false);
    await generateFakeUsers();
  };

  return (
    <main className="bg-gray-800 rounded-xl p-4 shadow">
      <h2>{t("admin_fake_users_title")}</h2>
      {status === "loading" && ref ? (
        <div className="p-3 border border-rose-500 rounded-2xl font-semibold text-emerald-500">
          {t("admin_fake_users_generating")}
        </div>
      ) : (
        <div className="flex flex-col gap-3 border border-violet-700 rounded-lg p-2 lg:flex-row lg:justify-around">
          <div className="flex flex-col">
            <label htmlFor="defaultPassword">{t("admin_fake_users_default_password")}</label>
            <input
              id="defaultPassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 w-40 border border-violet-900 rounded-lg"
              type="text"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="fake_users">{t("admin_fake_users_count")}</label>
            <div className="flex gap-2">
              <input
                value={fakeUsers}
                onChange={(e) => setFakeUsers(parseFloat(e.target.value))}
                type="number"
                step={1}
                className="p-2 w-40 border border-violet-900 rounded-lg"
                id="fake_users"
              />
            </div>
          </div>
          <div className="flex lg:justify-center py-5 lg:p-5">
            <button
              className="btn-generic"
              type="button"
              onClick={handleModalOpen}
            >
              {t("admin_fake_users_generate_button")}
            </button>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={isModalOpen}
        title={t("admin_fake_users_modal_title")}
        message={modalMessage}
        onConfirm={confirmGenerate}
        onCancel={() => setIsModalOpen(false)}
      />
    </main>
  );
};
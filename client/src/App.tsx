import { BrowserRouter, Route, Routes } from 'react-router';
import { useEffect, lazy, Suspense } from 'react';
import { useAppDispatch } from './store/store';
import { fetchUserInfo, restoreSession } from './store/features/user/authSlice';
import { Loader } from './components/Loader';
import { useTranslation } from 'react-i18next';
import { getSettings } from './store/features/admin/settingsSlice';

// Layouts
const MainLayout = lazy(() => import('./layouts/MainLayout'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const UserLayout = lazy(() => import('./layouts/UserLayout'));

// Pages
const HomePage = lazy(() => import('./pages/HomePage'));
const UserDashboardPage = lazy(() => import('./pages/user/UserDashboardPage'));
const UserProfilePage = lazy(() => import('./pages/user/UserProfilePage'));
const AdminDashboardPage = lazy(
  () => import('./pages/admin/AdminDashboardPage')
);
const SystemSettingsPage = lazy(
  () => import('./pages/admin/SystemSettingsPage')
);
const AdminOrdersPage = lazy(() => import('./pages/admin/AdminOrdersPage'));

const HowToTradePage = lazy(() => import('./pages/HowToTradePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegistrationPage = lazy(() => import('./pages/RegistrationPage'));
const CreditsPage = lazy(() => import('./pages/CreditsPage'));
const UserOrdersPage = lazy(() => import('./pages/user/UserOrdersPage'));
const AllUsersPage = lazy(() => import('./pages/admin/AllUsersPage'));
const RestorePasswordPage = lazy(() => import('./pages/RestorePasswordPage'));
const RestoreConfirmationPage = lazy(
  () => import('./pages/RestoreConfirmationPage')
);
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const UserTradingPage = lazy(() => import('./pages/user/UserTradingPage'));

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const doRestore = async () => {
      const result = await dispatch(restoreSession());
      if (restoreSession.fulfilled.match(result)) {
        dispatch(fetchUserInfo());
      }
    };

    doRestore(); // pirmas kartas

    const interval = setInterval(() => {
      doRestore(); // kas 55 min
    }, 55 * 60 * 1000);

    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    dispatch(getSettings());
  }, [dispatch]);

  const { i18n } = useTranslation();
  // atstatom kalbą
  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="registration" element={<RegistrationPage />} />
            <Route path="how-to-trade" element={<HowToTradePage />} />
            <Route path="credits" element={<CreditsPage />} />
            <Route path="restore-password" element={<RestorePasswordPage />} />
            <Route
              path="restore-password-email"
              element={<RestoreConfirmationPage />}
            />
          </Route>
          <Route path="/dashboard" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route
              path="/dashboard/settings"
              element={<SystemSettingsPage />}
            />
            <Route path="/dashboard/users" element={<AllUsersPage />} />
            <Route path="/dashboard/orders" element={<AdminOrdersPage />} />
          </Route>
          <Route path="/my-dashboard" element={<UserLayout />}>
            <Route index element={<UserDashboardPage />} />
            <Route path="/my-dashboard/trading" element={<UserTradingPage />} />
            <Route path="/my-dashboard/profile" element={<UserProfilePage />} />
            <Route path="/my-dashboard/orders" element={<UserOrdersPage />} />
          </Route>
          <Route path="/404" element={<NotFoundPage />} />{' '}
          {/* Define explicit 404 page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;

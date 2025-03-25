import { BrowserRouter, Route, Routes } from 'react-router';
import { useEffect } from 'react';
import { useAppDispatch } from './store/store';
import { restoreSession } from './store/features/user/authSlice';

// Components

// Layouts
import { MainLayout } from './layouts/MainLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { UserLayout } from './layouts/UserLayout';

// Pages
import { HomePage } from './pages/HomePage';
import { UserDashboardPage } from './pages/user/UserDashboardPage';
import { UserProfilePage } from './pages/user/UserProfilePage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import { SystemSettingsPage } from './pages/admin/SystemSettingsPage';
import { HowToTradePage } from './pages/HowToTradePage';
import { LoginPage } from './pages/LoginPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { CreditsPage } from './pages/CreditsPage';
import { UserOrdersPage } from './pages/user/UserOrdersPage';
import { AllUsersPage } from './pages/admin/AllUsersPage';
import { RestorePasswordPage } from './pages/RestorePasswordPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { UserTradingPage } from './pages/user/UserTradingPage';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path='login' element={<LoginPage />} />
          <Route path='registration' element={<RegistrationPage />} />
          <Route path='how-to-trade' element={<HowToTradePage />} />
          <Route path='credits' element={<CreditsPage />} />
          <Route path='restore-password' element={<RestorePasswordPage />} />
        </Route>
        <Route path='/dashboard' element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path='/dashboard/settings' element={<SystemSettingsPage />} />
          <Route path='/dashboard/users' element={<AllUsersPage />} />
        </Route>
        <Route path='/my-dashboard' element={<UserLayout />}>
          <Route index element={<UserDashboardPage />} />
          <Route path='/my-dashboard/trading' element={<UserTradingPage />} />
          <Route path='/my-dashboard/profile' element={<UserProfilePage />} />
          <Route path='/my-dashboard/orders' element={<UserOrdersPage />} />
        </Route>
        <Route path='/404' element={<NotFoundPage />} />{' '}
        {/* Define explicit 404 page */}
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

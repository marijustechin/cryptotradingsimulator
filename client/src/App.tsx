import { BrowserRouter, Route, Routes } from 'react-router';
import { useEffect } from 'react';
import { useAppDispatch } from './store/store';
import { restoreSession } from './store/features/user/authSlice';

// layouts
import { MainLayout } from './layouts/MainLayout';
import { AdminLayout } from './layouts/AdminLayout';

// pages
import { HomePage } from './pages/HomePage';
import { UserDashboardPage } from './pages/user/UserDashboardPage';
import { UserProfilePage } from './pages/user/UserProfilePage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { SystemSettingsPage } from './pages/admin/SystemSettingsPage';
import { HowToTradePage } from './pages/HowToTradePage';
import { LoginPage } from './pages/LoginPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { CreditsPage } from './pages/CreditsPage';
import { UserLayout } from './layouts/UserLayout';
import { UserStatsPage } from './pages/user/UserStatsPage';
import { UserPortfolioPage } from './pages/user/UserPortfolioPage';
import { AllUsersPage } from './pages/admin/AllUsersPage';

function App() {
  // pasileidziant programai automatiskai atnaujinam
  // refreshTokena - atstatom sesija is localStorage
  // arba jei pasibaiges accessTokeno galiojimas
  // darom refresh
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="registration" element={<RegistrationPage />} />
          <Route path="how-to-trade" element={<HowToTradePage />} />
          <Route path="credits" element={<CreditsPage />} />
        </Route>
        <Route path="/dashboard" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="/dashboard/settings" element={<SystemSettingsPage />} />
          <Route path="/dashboard/users" element={<AllUsersPage />} />
        </Route>
        <Route path="/my-dashboard" element={<UserLayout />}>
          <Route index element={<UserDashboardPage />} />
          <Route path="/my-dashboard/stats" element={<UserStatsPage />} />
          <Route path="/my-dashboard/profile" element={<UserProfilePage />} />
          <Route
            path="/my-dashboard/portfolio"
            element={<UserPortfolioPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

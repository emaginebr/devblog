import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NAuthProvider } from 'nauth-react';
import { NNewsProvider } from 'nnews-react';
import 'nauth-react/styles';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import ArticlesPage from './pages/ArticlesPage';
import ArticleViewPage from './pages/ArticleViewPage';
import ArticleEditorPage from './pages/ArticleEditorPage';
import CategoriesPage from './pages/CategoriesPage';
import TagsPage from './pages/TagsPage';
import { ROUTES } from './lib/constants';

const authApiUrl = import.meta.env.VITE_AUTH_API_URL || 'https://emagine.com.br/auth-api';
const newsApiUrl = import.meta.env.VITE_NEWS_API_URL || 'https://emagine.com.br/news-api';
const tenantHeaders = { 'X-Tenant-Id': 'devblog' };

function App() {
  return (
    <BrowserRouter>
      <NAuthProvider
        config={{
          apiUrl: authApiUrl,
          headers: tenantHeaders,
          enableFingerprinting: true,
          defaultTheme: 'system',
        }}
      >
        <NNewsProvider
          config={{
            apiUrl: newsApiUrl,
            headers: tenantHeaders,
          }}
        >
          <Routes>
              <Route element={<Layout />}>
                {/* Public routes */}
                <Route path={ROUTES.HOME} element={<HomePage />} />
                <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
                <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
                <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
                <Route path={ROUTES.ARTICLES} element={<ArticlesPage />} />
                <Route path={ROUTES.ARTICLE_VIEW} element={<ArticleViewPage />} />

                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
                  <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
                  <Route path={ROUTES.CHANGE_PASSWORD} element={<ChangePasswordPage />} />
                  <Route path={ROUTES.ARTICLE_NEW} element={<ArticleEditorPage />} />
                  <Route path={ROUTES.ARTICLE_EDIT} element={<ArticleEditorPage />} />
                  <Route path={ROUTES.CATEGORIES} element={<CategoriesPage />} />
                  <Route path={ROUTES.TAGS} element={<TagsPage />} />
                </Route>
              </Route>
            </Routes>
        </NNewsProvider>
      </NAuthProvider>
    </BrowserRouter>
  );
}

export default App;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:hash',
  ARTICLES: '/articles',
  ARTICLE_VIEW: '/articles/:id',
  ADMIN_ARTICLES: '/admin/articles',
  ADMIN_ARTICLE_VIEW: '/admin/articles/:id',
  DASHBOARD: '/admin/dashboard',
  PROFILE: '/admin/profile',
  CHANGE_PASSWORD: '/admin/change-password',
  ARTICLE_NEW: '/admin/articles/new',
  ARTICLE_EDIT: '/admin/articles/:id/edit',
  CATEGORIES: '/admin/categories',
  TAGS: '/admin/tags',
} as const;

export const APP_NAME = 'Rodrigo Landim';

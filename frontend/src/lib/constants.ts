export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:hash',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  CHANGE_PASSWORD: '/change-password',
  ARTICLES: '/articles',
  ARTICLE_VIEW: '/articles/:id',
  ARTICLE_NEW: '/articles/new',
  ARTICLE_EDIT: '/articles/:id/edit',
  CATEGORIES: '/categories',
  TAGS: '/tags',
} as const;

export const APP_NAME = 'DevBlog';

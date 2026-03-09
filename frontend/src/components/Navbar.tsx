import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from 'nauth-react';
import { Code2, LogOut, User, LayoutDashboard, FileText, FolderTree, Tags } from 'lucide-react';
import { ROUTES, APP_NAME } from '../lib/constants';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
      <nav className="container mx-auto px-4 max-w-6xl flex items-center justify-between h-16">
        <Link to={ROUTES.HOME} className="flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-white">
          <Code2 className="h-6 w-6 text-blue-600" />
          {APP_NAME}
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link
            to={ROUTES.ARTICLES}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white flex items-center gap-1"
          >
            <FileText className="h-4 w-4" />
            Artigos
          </Link>

          {isAuthenticated && (
            <>
              <Link
                to={ROUTES.DASHBOARD}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white flex items-center gap-1"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                to={ROUTES.CATEGORIES}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white flex items-center gap-1"
              >
                <FolderTree className="h-4 w-4" />
                Categorias
              </Link>
              <Link
                to={ROUTES.TAGS}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white flex items-center gap-1"
              >
                <Tags className="h-4 w-4" />
                Tags
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to={ROUTES.PROFILE}
                className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{user?.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-md text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to={ROUTES.LOGIN}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white px-3 py-2"
              >
                Entrar
              </Link>
              <Link
                to={ROUTES.REGISTER}
                className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Cadastrar
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

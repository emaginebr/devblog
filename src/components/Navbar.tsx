import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from 'nauth-react';
import type { Category } from 'nnews-react';
import {
  LogOut, User, LayoutDashboard, FileText, FolderTree, Tags,
  Menu, X, ChevronDown, Shield,
} from 'lucide-react';
import { ROUTES, APP_NAME } from '../lib/constants';
import { fetchPublic, categoryPath } from '../lib/public-api';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const adminRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPublic<Category[]>('/Category/listByParent').then(setCategories).catch(() => {});
  }, []);

  // Fecha dropdown admin ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (adminRef.current && !adminRef.current.contains(e.target as Node)) {
        setAdminOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinkClass = (path: string) =>
    `text-sm font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all duration-200 ${
      isActive(path)
        ? 'text-dotnet-purple-light bg-dotnet-purple/10'
        : 'text-gray-400 hover:text-white hover:bg-surface-2'
    }`;

  const dropdownItemClass = (path: string) =>
    `flex items-center gap-2 w-full text-left text-sm px-3 py-2 rounded-md transition-all duration-200 ${
      isActive(path)
        ? 'text-dotnet-purple-light bg-dotnet-purple/10'
        : 'text-gray-400 hover:text-white hover:bg-surface-2'
    }`;

  // Top 3 categorias com mais artigos
  const topCategories = [...categories]
    .sort((a, b) => (b.articleCount ?? 0) - (a.articleCount ?? 0))
    .slice(0, 3);

  const adminMenuItems = [
    { to: ROUTES.DASHBOARD, icon: LayoutDashboard, label: 'Dashboard' },
    { to: ROUTES.ADMIN_ARTICLES, icon: FileText, label: 'Artigos' },
    { to: ROUTES.CATEGORIES, icon: FolderTree, label: 'Categorias' },
    { to: ROUTES.TAGS, icon: Tags, label: 'Tags' },
  ];

  return (
    <header className="sticky top-0 z-50 nav-glass">
      <nav className="container mx-auto px-4 max-w-6xl flex items-center justify-between h-16">
        {/* Logo */}
        <Link to={ROUTES.HOME} className="flex items-center gap-2.5 group">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-dotnet-purple to-dotnet-purple-light flex items-center justify-center group-hover:shadow-lg group-hover:shadow-dotnet-purple/30 transition-shadow duration-300">
              <span className="font-mono text-white text-[9px] font-bold">.net</span>
            </div>
          </div>
          <span className="font-display font-bold text-lg text-white tracking-tight">
            {APP_NAME}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {isAuthenticated ? (
            /* Menu Admin dropdown */
            <div className="relative" ref={adminRef}>
              <button
                onClick={() => setAdminOpen(!adminOpen)}
                className={`text-sm font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all duration-200 ${
                  adminOpen
                    ? 'text-dotnet-purple-light bg-dotnet-purple/10'
                    : 'text-gray-400 hover:text-white hover:bg-surface-2'
                }`}
              >
                <Shield className="h-3.5 w-3.5" />
                Admin
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${adminOpen ? 'rotate-180' : ''}`} />
              </button>
              {adminOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-surface-1 border border-surface-3 rounded-lg shadow-xl py-1 animate-slide-down">
                  {adminMenuItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setAdminOpen(false)}
                      className={dropdownItemClass(item.to)}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Categorias públicas */
            topCategories.map((cat) => (
              <Link
                key={cat.categoryId}
                to={categoryPath(cat.title, cat.categoryId)}
                className="text-sm font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all duration-200 text-gray-400 hover:text-white hover:bg-surface-2"
              >
                {cat.title}
              </Link>
            ))
          )}
        </div>

        {/* Auth + Mobile Toggle */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-2">
              <Link
                to={ROUTES.PROFILE}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors px-2 py-1.5 rounded-md hover:bg-surface-2"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-dotnet-purple to-dotnet-cyan flex items-center justify-center">
                  <User className="h-3 w-3 text-white" />
                </div>
                <span className="hidden lg:inline font-medium">{user?.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-md text-gray-500 hover:text-red-400 hover:bg-surface-2 transition-all"
                title="Sair"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link
                to={ROUTES.LOGIN}
                className="text-sm font-medium text-gray-400 hover:text-white px-3 py-2 transition-colors"
              >
                Entrar
              </Link>
              <Link
                to={ROUTES.REGISTER}
                className="btn-primary text-sm !py-2 !px-4"
              >
                <span>Cadastrar</span>
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white rounded-md hover:bg-surface-2"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-surface-3 animate-slide-down">
          <div className="container mx-auto px-4 py-4 space-y-1">
            {isAuthenticated ? (
              /* Admin items no mobile */
              <>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-1">
                  Admin
                </div>
                {adminMenuItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={navLinkClass(item.to)}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
              </>
            ) : (
              /* Categorias no mobile */
              <>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-1">
                  Categorias
                </div>
                {topCategories.map((cat) => (
                  <Link
                    key={cat.categoryId}
                    to={categoryPath(cat.title, cat.categoryId)}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all duration-200 text-gray-400 hover:text-white hover:bg-surface-2"
                  >
                    {cat.title}
                  </Link>
                ))}
              </>
            )}

            <div className="border-t border-surface-3 pt-3 mt-3">
              {isAuthenticated ? (
                <div className="flex items-center justify-between">
                  <Link
                    to={ROUTES.PROFILE}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
                  >
                    <User className="h-4 w-4" />
                    {user?.name}
                  </Link>
                  <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300">
                    Sair
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to={ROUTES.LOGIN}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm text-gray-400 hover:text-white px-3 py-2"
                  >
                    Entrar
                  </Link>
                  <Link
                    to={ROUTES.REGISTER}
                    onClick={() => setMobileOpen(false)}
                    className="btn-primary text-sm !py-2 !px-4"
                  >
                    <span>Cadastrar</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

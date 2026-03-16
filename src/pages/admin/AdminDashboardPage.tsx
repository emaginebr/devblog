import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from 'nauth-react';
import { useArticles, useCategories, useTags } from 'nnews-react';
import { FileText, FolderTree, Tags, Plus, PenLine, Calendar } from 'lucide-react';
import { ROUTES } from '../../lib/constants';
import { articlePath } from '../../lib/public-api';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { articles, fetchArticles } = useArticles();
  const { categories, fetchCategories } = useCategories();
  const { tags, fetchTags } = useTags();

  useEffect(() => {
    fetchArticles({ page: 1, pageSize: 5 });
    fetchCategories();
    fetchTags();
  }, []);

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-xs text-dotnet-cyan opacity-60">{'>'} session.user</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-white tracking-tight">
          Bem-vindo, <span className="text-gradient-dotnet">{user?.name}</span>
        </h1>
        <p className="text-gray-500 mt-1 font-light">
          Gerencie seus artigos, categorias e tags.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up stagger-1">
        <StatCard
          icon={<FileText className="h-5 w-5" />}
          label="Artigos"
          count={articles?.totalCount ?? 0}
          linkTo={ROUTES.ADMIN_ARTICLES}
          color="purple"
        />
        <StatCard
          icon={<FolderTree className="h-5 w-5" />}
          label="Categorias"
          count={categories.length}
          linkTo={ROUTES.CATEGORIES}
          color="cyan"
        />
        <StatCard
          icon={<Tags className="h-5 w-5" />}
          label="Tags"
          count={tags.length}
          linkTo={ROUTES.TAGS}
          color="orange"
        />
      </div>

      {/* Quick Actions */}
      <div className="animate-fade-in-up stagger-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-5 rounded-full bg-gradient-to-b from-dotnet-purple to-dotnet-cyan" />
          <h2 className="font-display text-lg font-semibold text-white">Ações Rápidas</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to={ROUTES.ARTICLE_NEW} className="btn-primary inline-flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Novo Artigo</span>
          </Link>
          <Link to={ROUTES.ADMIN_ARTICLES} className="btn-secondary inline-flex items-center gap-2">
            <PenLine className="h-4 w-4" />
            Gerenciar Artigos
          </Link>
        </div>
      </div>

      {/* Recent Articles */}
      {articles && articles.items.length > 0 && (
        <div className="animate-fade-in-up stagger-3">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-5 rounded-full bg-gradient-to-b from-dotnet-purple to-dotnet-cyan" />
            <h2 className="font-display text-lg font-semibold text-white">Artigos Recentes</h2>
          </div>
          <div className="card-noir divide-y divide-surface-3 overflow-hidden">
            {articles.items.map((article) => (
              <Link
                key={article.articleId}
                to={articlePath(article.category?.title ?? 'artigo', article.title, article.articleId, '/admin/dashboard')}
                className="flex items-center justify-between p-4 hover:bg-surface-2/50 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white truncate group-hover:text-dotnet-purple-light transition-colors">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 font-mono">
                    {article.dateAt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(article.dateAt).toLocaleDateString('pt-BR')}
                      </span>
                    )}
                    {article.category && (
                      <span className="text-dotnet-purple-light opacity-70">
                        {article.category.title}
                      </span>
                    )}
                  </div>
                </div>
                <span className={`ml-3 flex-shrink-0 font-mono text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full ${
                  article.status === 1
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                }`}>
                  {article.status === 1 ? 'live' : 'draft'}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  count,
  linkTo,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  linkTo: string;
  color: 'purple' | 'cyan' | 'orange';
}) {
  const colorMap = {
    purple: {
      iconBg: 'bg-dotnet-purple/10',
      iconText: 'text-dotnet-purple-light',
      glow: 'group-hover:shadow-dotnet-purple/10',
    },
    cyan: {
      iconBg: 'bg-dotnet-cyan/10',
      iconText: 'text-dotnet-cyan',
      glow: 'group-hover:shadow-dotnet-cyan/10',
    },
    orange: {
      iconBg: 'bg-orange-500/10',
      iconText: 'text-orange-400',
      glow: 'group-hover:shadow-orange-500/10',
    },
  };

  const c = colorMap[color];

  return (
    <Link
      to={linkTo}
      className={`card-noir p-5 flex items-center gap-4 group ${c.glow} group-hover:shadow-lg`}
    >
      <div className={`w-11 h-11 rounded-lg ${c.iconBg} flex items-center justify-center ${c.iconText}`}>
        {icon}
      </div>
      <div>
        <p className="font-display text-2xl font-bold text-white">{count}</p>
        <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">{label}</p>
      </div>
    </Link>
  );
}

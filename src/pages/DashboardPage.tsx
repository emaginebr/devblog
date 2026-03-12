import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from 'nauth-react';
import { useArticles, useCategories, useTags } from 'nnews-react';
import { FileText, FolderTree, Tags, Plus, PenLine } from 'lucide-react';
import { ROUTES } from '../lib/constants';

export default function DashboardPage() {
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Bem-vindo, {user?.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Gerencie seus artigos, categorias e tags.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<FileText className="h-8 w-8 text-blue-600" />}
          label="Artigos"
          count={articles?.totalCount ?? 0}
          linkTo={ROUTES.ARTICLES}
        />
        <StatCard
          icon={<FolderTree className="h-8 w-8 text-green-600" />}
          label="Categorias"
          count={categories.length}
          linkTo={ROUTES.CATEGORIES}
        />
        <StatCard
          icon={<Tags className="h-8 w-8 text-purple-600" />}
          label="Tags"
          count={tags.length}
          linkTo={ROUTES.TAGS}
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Acoes Rapidas</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to={ROUTES.ARTICLE_NEW}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Novo Artigo
          </Link>
          <Link
            to={ROUTES.ARTICLES}
            className="inline-flex items-center gap-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <PenLine className="h-4 w-4" />
            Gerenciar Artigos
          </Link>
        </div>
      </div>

      {/* Recent Articles */}
      {articles && articles.items.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Artigos Recentes</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
            {articles.items.map((article) => (
              <Link
                key={article.articleId}
                to={`/articles/${article.articleId}`}
                className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-750"
              >
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{article.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {article.dateAt && new Date(article.dateAt).toLocaleDateString('pt-BR')}
                    {article.category && ` - ${article.category.title}`}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  article.status === 1
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {article.status === 1 ? 'Publicado' : 'Rascunho'}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, count, linkTo }: { icon: React.ReactNode; label: string; count: number; linkTo: string }) {
  return (
    <Link
      to={linkTo}
      className="flex items-center gap-4 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
    >
      {icon}
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      </div>
    </Link>
  );
}

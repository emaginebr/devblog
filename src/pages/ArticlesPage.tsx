import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from 'nauth-react';
import { useArticles, ArticleList } from 'nnews-react';
import { Plus } from 'lucide-react';
import { ROUTES } from '../lib/constants';

export default function ArticlesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { articles, loading, error, fetchArticles } = useArticles();
  const { isAuthenticated } = useAuth();
  const [page, setPage] = useState(1);

  const categoryId = searchParams.get('category')
    ? Number(searchParams.get('category'))
    : undefined;

  useEffect(() => {
    fetchArticles({ page, pageSize: 12, categoryId });
  }, [page, categoryId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Artigos</h1>
        {isAuthenticated && (
          <button
            onClick={() => navigate(ROUTES.ARTICLE_NEW)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Novo Artigo
          </button>
        )}
      </div>

      <ArticleList
        articles={articles}
        loading={loading}
        error={error}
        onArticleClick={(article) => navigate(`/articles/${article.articleId}`)}
        onEditClick={isAuthenticated ? (article) => navigate(`/articles/${article.articleId}/edit`) : undefined}
        showActions={isAuthenticated}
      />

      {/* Pagination */}
      {articles && articles.totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Anterior
          </button>
          <span className="px-4 py-2 text-gray-600 dark:text-gray-400">
            {page} / {articles.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(articles.totalPages, p + 1))}
            disabled={page === articles.totalPages}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Proximo
          </button>
        </div>
      )}
    </div>
  );
}

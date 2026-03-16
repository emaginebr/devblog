import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useArticles, ArticleList } from 'nnews-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ArticlesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { articles, loading, error, fetchArticles } = useArticles();
  const [page, setPage] = useState(1);

  const categoryId = searchParams.get('category')
    ? Number(searchParams.get('category'))
    : undefined;

  useEffect(() => {
    fetchArticles({ page, pageSize: 12, categoryId });
  }, [page, categoryId]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 rounded-full bg-gradient-to-b from-dotnet-purple to-dotnet-cyan" />
          <h1 className="font-display text-3xl font-bold text-white tracking-tight">Artigos</h1>
        </div>
      </div>

      {/* Article List */}
      <div className="animate-fade-in-up stagger-1">
        <ArticleList
          articles={articles}
          loading={loading}
          error={error}
          onArticleClick={(article) => navigate(`/articles/${article.articleId}`)}
        />
      </div>

      {/* Pagination */}
      {articles && articles.totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 pt-4 animate-fade-in-up stagger-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-secondary !py-2 !px-3 inline-flex items-center gap-1 text-sm disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </button>
          <span className="font-mono text-xs text-gray-500 px-3">
            <span className="text-dotnet-purple-light">{page}</span>
            <span className="mx-1">/</span>
            <span>{articles.totalPages}</span>
          </span>
          <button
            onClick={() => setPage((p) => Math.min(articles.totalPages, p + 1))}
            disabled={page === articles.totalPages}
            className="btn-secondary !py-2 !px-3 inline-flex items-center gap-1 text-sm disabled:opacity-30"
          >
            Próximo
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

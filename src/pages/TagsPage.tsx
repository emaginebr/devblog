import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import type { Article, Tag as TagType } from 'nnews-react';
import { ChevronLeft, ChevronRight, Tag, Calendar } from 'lucide-react';
import { fetchPublic, parseTagParam, articlePath, type PagedResult } from '../lib/public-api';

export default function TagsPage() {
  const { tagSlug } = useParams<{ tagSlug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [tag, setTag] = useState<TagType | null>(null);
  const [articles, setArticles] = useState<PagedResult<Article> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const tagId = tagSlug ? parseTagParam(tagSlug) : null;

  useEffect(() => {
    if (!tagId) {
      navigate('/', { replace: true });
      return;
    }

    async function loadTag() {
      try {
        const t = await fetchPublic<TagType>(`/Tag/${tagId}`);
        setTag(t);
      } catch {
        navigate('/', { replace: true });
      }
    }
    loadTag();
  }, [tagId, navigate]);

  useEffect(() => {
    if (!tag?.slug) return;

    async function loadArticles() {
      setLoading(true);
      try {
        const data = await fetchPublic<PagedResult<Article>>('/Article/ListByTag', {
          tagSlug: tag!.slug!,
          page,
          pageSize: 12,
        });
        setArticles(data);
      } catch {
        setArticles(null);
      } finally {
        setLoading(false);
      }
    }
    loadArticles();
  }, [tag?.slug, page]);

  if (!tag) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-dotnet-purple/20 border-t-dotnet-purple" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 rounded-full bg-gradient-to-b from-dotnet-purple to-dotnet-cyan" />
          <Tag className="h-5 w-5 text-orange-400" />
          <h1 className="font-display text-3xl font-bold text-white tracking-tight">
            {tag.title}
          </h1>
          <span className="font-mono text-sm text-gray-500">
            {articles?.totalCount ?? 0} artigo(s)
          </span>
        </div>
      </div>

      {/* Article List */}
      <div className="animate-fade-in-up stagger-1">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-dotnet-purple/20 border-t-dotnet-purple" />
          </div>
        ) : articles && articles.items.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.items.map((article, i) => (
              <Link
                key={article.articleId}
                to={articlePath(article.category?.title ?? 'artigo', article.title, article.articleId, location.pathname)}
                className={`card-noir group overflow-hidden animate-fade-in-up stagger-${Math.min(i + 1, 6)}`}
              >
                <div className="aspect-video overflow-hidden relative bg-surface-2">
                  {(article.imageUrl || article.imageName) ? (
                    <>
                      <img
                        src={article.imageUrl || article.imageName}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface-1 via-transparent to-transparent opacity-60" />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Tag className="h-10 w-10 text-gray-700" />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-display font-semibold text-white mb-3 line-clamp-2 group-hover:text-dotnet-purple-light transition-colors">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500 font-mono">
                    {article.dateAt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(article.dateAt).toLocaleDateString('pt-BR')}
                      </span>
                    )}
                    {article.category && (
                      <span className="badge-dotnet">
                        <Tag className="h-2.5 w-2.5 inline mr-1" />
                        {article.category.title}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 card-noir">
            <Tag className="h-8 w-8 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 font-mono text-sm">
              Nenhum artigo com esta tag.
            </p>
          </div>
        )}
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

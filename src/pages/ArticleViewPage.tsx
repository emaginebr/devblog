import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from 'nauth-react';
import { useArticles, ArticleViewer, type Article } from 'nnews-react';

export default function ArticleViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getArticleById } = useArticles();
  const { isAuthenticated } = useAuth();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getArticleById(Number(id))
        .then(setArticle)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Artigo nao encontrado</h2>
        <button
          onClick={() => navigate('/articles')}
          className="mt-4 text-blue-600 hover:text-blue-700"
        >
          Voltar para artigos
        </button>
      </div>
    );
  }

  return (
    <ArticleViewer
      article={article}
      onBack={() => navigate('/articles')}
      onEdit={isAuthenticated ? (a) => navigate(`/articles/${a.articleId}/edit`) : undefined}
      showActions={isAuthenticated}
    />
  );
}

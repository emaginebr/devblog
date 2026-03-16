import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useArticles, ArticleViewer, type Article } from 'nnews-react';
import { Terminal } from 'lucide-react';
import CodeHighlighter from '../../components/CodeHighlighter';

export default function AdminArticleViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getArticleById } = useArticles();
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
      <div className="flex justify-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-dotnet-purple/20 border-t-dotnet-purple" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-24 animate-fade-in-up">
        <Terminal className="h-10 w-10 text-gray-600 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold text-white mb-2">
          Artigo não encontrado
        </h2>
        <p className="font-mono text-sm text-gray-500 mb-6">
          Error 404 — O recurso solicitado não existe.
        </p>
        <button
          onClick={() => navigate('/admin/articles')}
          className="btn-secondary inline-flex items-center gap-2 text-sm"
        >
          Voltar para artigos
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <CodeHighlighter>
        <ArticleViewer
          article={article}
          onBack={() => navigate('/admin/articles')}
          onEdit={(a) => navigate(`/admin/articles/${a.articleId}/edit`)}
          showActions={true}
        />
      </CodeHighlighter>
    </div>
  );
}

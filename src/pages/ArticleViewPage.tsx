import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArticleViewer, type Article } from 'nnews-react';
import { Terminal, Linkedin, Twitter, Facebook, Link2, ArrowLeft } from 'lucide-react';
import CodeHighlighter from '../components/CodeHighlighter';
import { fetchPublic, parseArticleParam } from '../lib/public-api';
import { toast } from 'sonner';

export default function ArticleViewPage() {
  const { articleSlug } = useParams<{ categorySlug: string; articleSlug: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const returnUrl = searchParams.get('returnUrl') || '/';
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  const articleId = articleSlug ? parseArticleParam(articleSlug) : null;

  useEffect(() => {
    if (articleId) {
      setLoading(true);
      fetchPublic<Article>(`/Article/${articleId}`)
        .then(setArticle)
        .catch(() => setArticle(null))
        .finally(() => setLoading(false));
    }
  }, [articleId]);

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
          onClick={() => navigate(returnUrl)}
          className="btn-secondary inline-flex items-center gap-2 text-sm"
        >
          Voltar para artigos
        </button>
      </div>
    );
  }

  const shareUrl = window.location.origin + window.location.pathname;
  const shareTitle = encodeURIComponent(article.title);
  const shareUrlEncoded = encodeURIComponent(shareUrl);

  const shareLinks = [
    {
      icon: Linkedin,
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrlEncoded}`,
      color: 'hover:text-[#0A66C2]',
    },
    {
      icon: Twitter,
      label: 'X (Twitter)',
      href: `https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrlEncoded}`,
      color: 'hover:text-white',
    },
    {
      icon: Facebook,
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrlEncoded}`,
      color: 'hover:text-[#1877F2]',
    },
  ];

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success('Link copiado!');
    });
  };

  return (
    <div className="animate-fade-in-up">
      {/* Top bar: Voltar + Compartilhar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(returnUrl)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>
        <div className="flex items-center gap-2">
          {shareLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              title={link.label}
              className={`p-2 rounded-lg bg-surface-2 border border-surface-3 text-gray-400 ${link.color} hover:border-dotnet-purple/30 transition-all`}
            >
              <link.icon className="h-4 w-4" />
            </a>
          ))}
          <button
            onClick={copyLink}
            title="Copiar link"
            className="p-2 rounded-lg bg-surface-2 border border-surface-3 text-gray-400 hover:text-dotnet-purple-light hover:border-dotnet-purple/30 transition-all"
          >
            <Link2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <CodeHighlighter>
        <ArticleViewer article={article} />
      </CodeHighlighter>
    </div>
  );
}

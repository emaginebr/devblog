import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useArticles, ArticleList, AIArticleGenerator, ConfirmModal, type Article } from 'nnews-react';
import { Plus, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { ROUTES } from '../../lib/constants';

export default function AdminArticlesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { articles, loading, error, fetchArticles, deleteArticle } = useArticles();
  const [page, setPage] = useState(1);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiMode, setAIMode] = useState<'create' | 'update'>('create');
  const [selectedArticleId, setSelectedArticleId] = useState<number | undefined>();
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const categoryId = searchParams.get('category')
    ? Number(searchParams.get('category'))
    : undefined;

  useEffect(() => {
    fetchArticles({ page, pageSize: 12, categoryId });
  }, [page, categoryId]);

  const handleNewArticleWithAI = () => {
    setAIMode('create');
    setSelectedArticleId(undefined);
    setShowAIModal(true);
  };

  const handleAIClick = (article: Article) => {
    setAIMode('update');
    setSelectedArticleId(article.articleId);
    setShowAIModal(true);
  };

  const handleDeleteClick = (article: Article) => {
    setArticleToDelete(article);
  };

  const handleConfirmDelete = async () => {
    if (!articleToDelete) return;
    setDeleteLoading(true);
    try {
      await deleteArticle(articleToDelete.articleId);
      toast.success('Artigo excluído com sucesso!');
      fetchArticles({ page, pageSize: 12, categoryId });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Falha ao excluir artigo.');
    } finally {
      setDeleteLoading(false);
      setArticleToDelete(null);
    }
  };

  const handleAISuccess = (article: Article) => {
    toast.success(
      aiMode === 'create'
        ? 'Artigo criado com IA com sucesso!'
        : 'Artigo atualizado com IA com sucesso!'
    );
    setShowAIModal(false);
    fetchArticles({ page, pageSize: 12, categoryId });
    navigate(`/admin/articles/${article.articleId}/edit`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 rounded-full bg-gradient-to-b from-dotnet-purple to-dotnet-cyan" />
          <h1 className="font-display text-3xl font-bold text-white tracking-tight">Artigos</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleNewArticleWithAI}
            className="inline-flex items-center gap-2 text-sm font-medium rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2.5 text-white hover:from-cyan-400 hover:to-blue-400 transition-all shadow-lg shadow-cyan-500/20"
          >
            <Sparkles className="h-4 w-4" />
            <span>Criar com IA</span>
          </button>
          <button
            onClick={() => navigate(ROUTES.ARTICLE_NEW)}
            className="btn-primary inline-flex items-center gap-2 text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Novo Artigo</span>
          </button>
        </div>
      </div>

      {/* Article List */}
      <div className="animate-fade-in-up stagger-1">
        <ArticleList
          articles={articles}
          loading={loading}
          error={error}
          onArticleClick={(article) => navigate(`/admin/articles/${article.articleId}/edit`)}
          onEditClick={(article) => navigate(`/admin/articles/${article.articleId}/edit`)}
          onAIClick={handleAIClick}
          onDeleteClick={handleDeleteClick}
          showActions={true}
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

      {/* AI Article Generator Modal */}
      <AIArticleGenerator
        mode={aiMode}
        articleId={selectedArticleId}
        isOpen={showAIModal}
        onSuccess={handleAISuccess}
        onClose={() => setShowAIModal(false)}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={!!articleToDelete}
        onOpenChange={(open) => { if (!open) setArticleToDelete(null); }}
        onConfirm={handleConfirmDelete}
        title="Excluir Artigo"
        description={`Tem certeza que deseja excluir "${articleToDelete?.title}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        variant="danger"
        loading={deleteLoading}
      />
    </div>
  );
}

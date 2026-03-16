import { useEffect, useState } from 'react';
import {
  useCategories,
  CategoryList,
  CategoryModal,
  type Category,
  type CategoryInput,
  type CategoryUpdate,
  type Article,
} from 'nnews-react';
import { Plus, ArrowLeft, Calendar, Tag, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { fetchPublic, articlePath, type PagedResult } from '../../lib/public-api';

export default function AdminCategoriesPage() {
  const {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);

  // Categoria atual para exibir artigos
  const [viewCategory, setViewCategory] = useState<Category | null>(null);
  const [articles, setArticles] = useState<PagedResult<Article> | null>(null);
  const [articlesLoading, setArticlesLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!viewCategory) {
      setArticles(null);
      return;
    }
    async function loadArticles() {
      setArticlesLoading(true);
      try {
        const data = await fetchPublic<PagedResult<Article>>('/Article/ListByCategory', {
          categoryId: viewCategory!.categoryId,
          page,
          pageSize: 10,
        });
        setArticles(data);
      } catch {
        toast.error('Erro ao carregar artigos da categoria.');
      } finally {
        setArticlesLoading(false);
      }
    }
    loadArticles();
  }, [viewCategory, page]);

  const handleSave = async (data: CategoryInput | CategoryUpdate) => {
    try {
      setSaving(true);
      if (selectedCategory) {
        await updateCategory(data as CategoryUpdate);
        toast.success('Categoria atualizada!');
      } else {
        await createCategory(data as CategoryInput);
        toast.success('Categoria criada!');
      }
      setModalOpen(false);
      setSelectedCategory(null);
      await fetchCategories();
    } catch {
      toast.error('Erro ao salvar categoria.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category: Category) => {
    if (!confirm(`Deseja excluir a categoria "${category.title}"?`)) return;
    try {
      await deleteCategory(category.categoryId);
      toast.success('Categoria excluida!');
      if (viewCategory?.categoryId === category.categoryId) {
        setViewCategory(null);
      }
      await fetchCategories();
    } catch {
      toast.error('Erro ao excluir categoria.');
    }
  };

  // View: artigos da categoria selecionada
  if (viewCategory) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => { setViewCategory(null); setPage(1); }}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
          <h1 className="text-3xl font-bold text-white">{viewCategory.title}</h1>
          <span className="text-sm text-gray-500 font-mono">
            {articles?.totalCount ?? 0} artigo(s)
          </span>
        </div>

        {articlesLoading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-dotnet-purple/20 border-t-dotnet-purple" />
          </div>
        ) : articles && articles.items.length > 0 ? (
          <>
            <div className="space-y-3">
              {articles.items.map((article) => (
                <Link
                  key={article.articleId}
                  to={articlePath(viewCategory.title, article.title, article.articleId, '/admin/categories')}
                  className="card-noir p-4 flex items-center gap-4 group hover:border-dotnet-purple/30 transition-all block"
                >
                  {article.imageUrl || article.imageName ? (
                    <img
                      src={article.imageUrl || article.imageName}
                      alt={article.title}
                      className="w-20 h-14 rounded-md object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-14 rounded-md bg-surface-2 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5 text-gray-600" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white group-hover:text-dotnet-purple-light transition-colors truncate">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 font-mono">
                      {article.dateAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(article.dateAt).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                      {article.tags && article.tags.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {article.tags.map(t => t.title).join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Paginação */}
            {articles.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={!articles.hasPrevious}
                  className="px-3 py-1.5 text-sm rounded-lg bg-surface-2 text-gray-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Anterior
                </button>
                <span className="text-sm text-gray-500 font-mono">
                  {articles.page} / {articles.totalPages}
                </span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={!articles.hasNext}
                  className="px-3 py-1.5 text-sm rounded-lg bg-surface-2 text-gray-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 card-noir">
            <FileText className="h-8 w-8 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 font-mono text-sm">
              Nenhum artigo nesta categoria.
            </p>
          </div>
        )}
      </div>
    );
  }

  // View: lista de categorias
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Categorias</h1>
        <button
          onClick={() => {
            setSelectedCategory(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Nova Categoria
        </button>
      </div>

      <CategoryList
        categories={categories}
        loading={loading}
        error={error}
        onCategoryClick={(cat) => { setViewCategory(cat); setPage(1); }}
        onEditClick={(cat) => {
          setSelectedCategory(cat);
          setModalOpen(true);
        }}
        onDeleteClick={handleDelete}
        showActions
      />

      <CategoryModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedCategory(null);
        }}
        category={selectedCategory}
        categories={categories}
        onSave={handleSave}
        loading={saving}
      />
    </div>
  );
}

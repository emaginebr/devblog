import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useArticles,
  useCategories,
  ArticleEditor,
  type Article,
  type ArticleInput,
  type ArticleUpdate,
} from 'nnews-react';
import { toast } from 'sonner';
import { ROUTES } from '../lib/constants';

export default function ArticleEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getArticleById, createArticle, updateArticle } = useArticles();
  const { categories, fetchCategories } = useCategories();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(false);

  const isEditing = !!id;

  useEffect(() => {
    fetchCategories();
    if (id) {
      setLoading(true);
      getArticleById(Number(id))
        .then(setArticle)
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSave = async (data: ArticleInput | ArticleUpdate) => {
    try {
      setLoading(true);
      if (isEditing) {
        await updateArticle(data as ArticleUpdate);
        toast.success('Artigo atualizado com sucesso!');
      } else {
        await createArticle(data as ArticleInput);
        toast.success('Artigo criado com sucesso!');
      }
      navigate(ROUTES.ARTICLES);
    } catch {
      toast.error('Erro ao salvar artigo.');
    } finally {
      setLoading(false);
    }
  };

  if (isEditing && !article && loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        {isEditing ? 'Editar Artigo' : 'Novo Artigo'}
      </h1>
      <ArticleEditor
        article={article}
        categories={categories}
        onSave={handleSave}
        onCancel={() => navigate(ROUTES.ARTICLES)}
        loading={loading}
      />
    </div>
  );
}

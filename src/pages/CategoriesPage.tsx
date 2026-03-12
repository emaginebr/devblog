import { useEffect, useState } from 'react';
import {
  useCategories,
  CategoryList,
  CategoryModal,
  type Category,
  type CategoryInput,
  type CategoryUpdate,
} from 'nnews-react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function CategoriesPage() {
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

  useEffect(() => {
    fetchCategories();
  }, []);

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
      await fetchCategories();
    } catch {
      toast.error('Erro ao excluir categoria.');
    }
  };

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

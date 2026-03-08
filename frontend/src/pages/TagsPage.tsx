import { useEffect, useState } from 'react';
import {
  useTags,
  TagList,
  TagModal,
  TagMerge,
  type Tag,
  type TagInput,
  type TagUpdate,
} from 'nnews-react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function TagsPage() {
  const {
    tags,
    loading,
    error,
    fetchTags,
    createTag,
    updateTag,
    deleteTag,
    mergeTags,
  } = useTags();
  const [modalOpen, setModalOpen] = useState(false);
  const [mergeOpen, setMergeOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  const handleSave = async (data: TagInput | TagUpdate) => {
    try {
      setSaving(true);
      if (selectedTag?.tagId) {
        await updateTag(data as TagUpdate);
        toast.success('Tag atualizada!');
      } else {
        await createTag(data as TagInput);
        toast.success('Tag criada!');
      }
      setModalOpen(false);
      setSelectedTag(null);
      await fetchTags();
    } catch {
      toast.error('Erro ao salvar tag.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (tag: Tag) => {
    if (!confirm(`Deseja excluir a tag "${tag.title}"?`)) return;
    try {
      await deleteTag(tag.tagId!);
      toast.success('Tag excluida!');
      await fetchTags();
    } catch {
      toast.error('Erro ao excluir tag.');
    }
  };

  const handleMerge = async (sourceId: number, targetId: number) => {
    try {
      setSaving(true);
      await mergeTags(sourceId, targetId);
      toast.success('Tags mescladas com sucesso!');
      setMergeOpen(false);
      setSelectedTag(null);
      await fetchTags();
    } catch {
      toast.error('Erro ao mesclar tags.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tags</h1>
        <button
          onClick={() => {
            setSelectedTag(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Nova Tag
        </button>
      </div>

      <TagList
        tags={tags}
        loading={loading}
        error={error}
        onEditClick={(tag) => {
          setSelectedTag(tag);
          setModalOpen(true);
        }}
        onDeleteClick={handleDelete}
        onMergeClick={(tag) => {
          setSelectedTag(tag);
          setMergeOpen(true);
        }}
        showActions
      />

      <TagModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedTag(null);
        }}
        tag={selectedTag}
        onSave={handleSave}
        loading={saving}
      />

      {selectedTag && (
        <TagMerge
          sourceTag={selectedTag}
          availableTags={tags.filter((t) => t.tagId !== selectedTag.tagId)}
          isOpen={mergeOpen}
          onClose={() => {
            setMergeOpen(false);
            setSelectedTag(null);
          }}
          onMerge={handleMerge}
          loading={saving}
        />
      )}
    </div>
  );
}

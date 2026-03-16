import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Article, Category, Tag as TagType } from 'nnews-react';
import { ArrowRight, Calendar, Tag, Search, FolderTree, Tags } from 'lucide-react';
import { ROUTES } from '../lib/constants';
import { fetchPublic, categoryPath, articlePath, tagPath, type PagedResult } from '../lib/public-api';

export default function HomePage() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<PagedResult<Article> | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadPublicData() {
      setLoading(true);
      try {
        const [articlesData, categoriesData, tagsData] = await Promise.all([
          fetchPublic<PagedResult<Article>>('/Article/ListByRoles', { page: 1, pageSize: 6 }),
          fetchPublic<Category[]>('/Category/listByParent'),
          fetchPublic<TagType[]>('/Tag/ListByRoles'),
        ]);
        setArticles(articlesData);
        setCategories(categoriesData);
        setTags(tagsData);
      } catch (err) {
        console.error('Failed to load public data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPublicData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="space-y-12">
      {/* Main Layout: 2 cols + 1 col */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Col 2/3 — Busca + Últimos Artigos */}
        <div className="lg:col-span-2 space-y-8 animate-fade-in-up">
          {/* Busca */}
          <div className="card-noir p-5">
            <div className="flex items-center gap-2 mb-4">
              <Search className="h-4 w-4 text-dotnet-purple-light" />
              <h3 className="font-display font-semibold text-white text-sm">Buscar</h3>
            </div>
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquisar artigos..."
                className="flex-1 bg-surface-2 border border-surface-3 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-dotnet-purple/50 focus:ring-1 focus:ring-dotnet-purple/30 transition-all"
              />
              <button
                type="submit"
                className="btn-primary !py-2 !px-3"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Últimos Artigos */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <SectionHeader title="Últimos Artigos" noMargin />
              <Link
                to={ROUTES.ARTICLES}
                className="text-dotnet-purple-light hover:text-white text-sm font-medium flex items-center gap-1.5 transition-colors"
              >
                Ver todos <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-dotnet-purple/20 border-t-dotnet-purple" />
              </div>
            ) : articles && articles.items.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-5">
                {articles.items.map((article: Article, i: number) => (
                  <ArticleCard key={article.articleId} article={article} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 card-noir">
                <Search className="h-8 w-8 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 font-mono text-sm">
                  Nenhum artigo publicado ainda.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Col 1/3 — Imagem, Categorias, Tags */}
        <div className="space-y-6 animate-fade-in-up stagger-1">
          <div className="card-noir overflow-hidden">
            <img
              src={`${import.meta.env.BASE_URL}dev-fire.jpg`}
              alt="Programador programando em um computador pegando fogo"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Categorias */}
          {categories.length > 0 && (
            <div className="card-noir p-5">
              <div className="flex items-center gap-2 mb-4">
                <FolderTree className="h-4 w-4 text-dotnet-cyan" />
                <h3 className="font-display font-semibold text-white text-sm">Categorias</h3>
              </div>
              <ul className="space-y-1">
                {categories.map((cat) => (
                  <li key={cat.categoryId}>
                    <Link
                      to={categoryPath(cat.title, cat.categoryId)}
                      className="flex items-center justify-between py-1.5 px-2 rounded-md text-sm text-gray-400 hover:text-white hover:bg-surface-2 transition-all group"
                    >
                      <span className="group-hover:text-dotnet-purple-light transition-colors">
                        {cat.title}
                      </span>
                      <span className="font-mono text-xs text-gray-600 bg-surface-2 group-hover:bg-surface-3 px-2 py-0.5 rounded-full transition-colors">
                        {cat.articleCount ?? 0}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="card-noir p-5">
              <div className="flex items-center gap-2 mb-4">
                <Tags className="h-4 w-4 text-orange-400" />
                <h3 className="font-display font-semibold text-white text-sm">Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Link
                    key={tag.tagId}
                    to={tagPath(tag.title, tag.tagId!)}
                    className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1.5 rounded-lg bg-surface-2 border border-surface-3 text-gray-400 hover:text-dotnet-purple-light hover:border-dotnet-purple/30 transition-all"
                  >
                    <Tag className="h-2.5 w-2.5" />
                    {tag.title}
                    <span className="text-gray-600">{tag.articleCount ?? 0}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, noMargin }: { title: string; noMargin?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${noMargin ? '' : 'mb-8'}`}>
      <div className="w-1 h-6 rounded-full bg-gradient-to-b from-dotnet-purple to-dotnet-cyan" />
      <h2 className="font-display font-bold text-2xl text-white tracking-tight">{title}</h2>
    </div>
  );
}

function ArticleCard({ article, index }: { article: Article; index: number }) {
  return (
    <Link
      to={articlePath(article.category?.title ?? 'artigo', article.title, article.articleId)}
      className={`card-noir group overflow-hidden animate-fade-in-up stagger-${Math.min(index + 1, 6)}`}
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
  );
}

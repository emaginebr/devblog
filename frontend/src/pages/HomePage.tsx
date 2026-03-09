import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useArticles, useCategories, type Article } from 'nnews-react';
import { Code2, ArrowRight, Calendar, Tag } from 'lucide-react';
import { ROUTES } from '../lib/constants';

export default function HomePage() {
  const { articles, loading, fetchArticles } = useArticles();
  const { categories, fetchCategories } = useCategories();

  useEffect(() => {
    fetchArticles({ page: 1, pageSize: 6 });
    fetchCategories();
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center py-16">
        <div className="flex justify-center mb-6">
          <Code2 className="h-16 w-16 text-blue-600" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          DevBlog
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
          Blog para desenvolvedores. Artigos sobre programacao, tecnologia,
          boas praticas e muito mais.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to={ROUTES.ARTICLES}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
          >
            Ver Artigos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Categorias</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.categoryId}
                to={`${ROUTES.ARTICLES}?category=${cat.categoryId}`}
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 bg-white dark:bg-gray-800 text-center transition-colors"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white">{cat.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Latest Articles */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Ultimos Artigos</h2>
          <Link
            to={ROUTES.ARTICLES}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
          >
            Ver todos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : articles && articles.items.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.items.map((article: Article) => (
              <ArticleCard key={article.articleId} article={article} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-12">
            Nenhum artigo publicado ainda.
          </p>
        )}
      </section>
    </div>
  );
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      to={`/articles/${article.articleId}`}
      className="group block rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden hover:shadow-lg transition-shadow"
    >
      {article.imageUrl && (
        <div className="aspect-video overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-5">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600">
          {article.title}
        </h3>
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          {article.dateAt && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(article.dateAt).toLocaleDateString('pt-BR')}
            </span>
          )}
          {article.category && (
            <span className="flex items-center gap-1">
              <Tag className="h-3.5 w-3.5" />
              {article.category.title}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

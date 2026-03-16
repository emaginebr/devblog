const newsApiUrl = import.meta.env.VITE_NEWS_API_URL || 'https://emagine.com.br/news-api';
const tenantHeaders = { 'X-Tenant-Id': 'devblog', 'Content-Type': 'application/json' };

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export function toSlug(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function categoryPath(title: string, id: number): string {
  return `/${toSlug(title)}-${id}`;
}

export function parseCategoryParam(param: string): number | null {
  const match = param.match(/-(\d+)$/);
  return match ? Number(match[1]) : null;
}

export function articlePath(categoryTitle: string, articleTitle: string, articleId: number, returnUrl?: string): string {
  const path = `/${toSlug(categoryTitle)}/${toSlug(articleTitle)}-${articleId}`;
  if (returnUrl) return `${path}?returnUrl=${encodeURIComponent(returnUrl)}`;
  return path;
}

export function parseArticleParam(param: string): number | null {
  const match = param.match(/-(\d+)$/);
  return match ? Number(match[1]) : null;
}

export function tagPath(title: string, id: number): string {
  return `/tags/${toSlug(title)}-${id}`;
}

export function parseTagParam(param: string): number | null {
  const match = param.match(/-(\d+)$/);
  return match ? Number(match[1]) : null;
}

export async function fetchPublic<T>(endpoint: string, params?: Record<string, string | number>): Promise<T> {
  const url = new URL(`${newsApiUrl}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  }
  const res = await fetch(url.toString(), { headers: tenantHeaders });
  if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
  return res.json();
}

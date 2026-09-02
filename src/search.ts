import type { Category, KnowHow } from './types';

export interface Filter {
  query: string;
  category: Category | 'all';
  tags: string[];
  favoritesOnly: boolean;
}

export const DEFAULT_FILTER: Filter = {
  query: '',
  category: 'all',
  tags: [],
  favoritesOnly: false,
};

/** 全角・半角、大文字・小文字の違いを吸収する */
export function normalizeText(text: string): string {
  return text.normalize('NFKC').toLowerCase();
}

function searchableText(entry: KnowHow): string {
  return normalizeText(
    [
      entry.title,
      entry.category,
      entry.summary,
      entry.problem,
      entry.cause,
      entry.solution,
      entry.notes,
      entry.tags.join(' '),
    ].join('\n'),
  );
}

export function filterEntries(entries: readonly KnowHow[], filter: Filter): KnowHow[] {
  const tokens = normalizeText(filter.query).split(/\s+/).filter(Boolean);
  const result = entries.filter((entry) => {
    if (filter.category !== 'all' && entry.category !== filter.category) return false;
    if (filter.favoritesOnly && !entry.favorite) return false;
    if (filter.tags.length > 0 && !filter.tags.every((tag) => entry.tags.includes(tag))) return false;
    if (tokens.length > 0) {
      const text = searchableText(entry);
      if (!tokens.every((token) => text.includes(token))) return false;
    }
    return true;
  });
  return result.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : a.updatedAt > b.updatedAt ? -1 : 0));
}

export interface TagCount {
  tag: string;
  count: number;
}

export function collectTags(entries: readonly KnowHow[]): TagCount[] {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    for (const tag of entry.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'ja'));
}

export function countByCategory(entries: readonly KnowHow[]): Map<Category, number> {
  const counts = new Map<Category, number>();
  for (const entry of entries) counts.set(entry.category, (counts.get(entry.category) ?? 0) + 1);
  return counts;
}

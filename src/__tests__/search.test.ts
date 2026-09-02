import { describe, expect, it } from 'vitest';
import { DEFAULT_FILTER, collectTags, countByCategory, filterEntries, normalizeText } from '../search';
import { createEntry } from '../store';
import { EMPTY_INPUT, type KnowHow } from '../types';

function make(overrides: Partial<KnowHow>, updatedAt = '2026-01-01T00:00:00.000Z'): KnowHow {
  return {
    ...createEntry({ ...EMPTY_INPUT, title: 't', solution: 's' }),
    updatedAt,
    ...overrides,
  };
}

const entries: KnowHow[] = [
  make({ id: '1', title: '押湯の配置', category: '加工精度・寸法', tags: ['熱変位', '暖機'], solution: '暖機運転' }, '2026-01-03T00:00:00Z'),
  make({ id: '2', title: 'アルミの溶着', category: '材料', tags: ['溶着', 'アルミ'], favorite: true }, '2026-01-02T00:00:00Z'),
  make({ id: '3', title: '主軸の熱変位', category: '機械の保守・精度管理', tags: ['主軸', '熱変位'], notes: 'ＶＢ 0.2〜0.3mm' }, '2026-01-01T00:00:00Z'),
];

describe('normalizeText', () => {
  it('folds full-width and case', () => {
    expect(normalizeText('ＣＢ ABC')).toBe('cb abc');
  });
});

describe('filterEntries', () => {
  it('returns everything sorted by updatedAt desc with default filter', () => {
    expect(filterEntries(entries, DEFAULT_FILTER).map((e) => e.id)).toEqual(['1', '2', '3']);
  });

  it('filters by category', () => {
    expect(filterEntries(entries, { ...DEFAULT_FILTER, category: '機械の保守・精度管理' }).map((e) => e.id)).toEqual(['3']);
  });

  it('filters by favorites', () => {
    expect(filterEntries(entries, { ...DEFAULT_FILTER, favoritesOnly: true }).map((e) => e.id)).toEqual(['2']);
  });

  it('requires all selected tags', () => {
    expect(filterEntries(entries, { ...DEFAULT_FILTER, tags: ['熱変位'] }).map((e) => e.id)).toEqual(['1', '3']);
    expect(filterEntries(entries, { ...DEFAULT_FILTER, tags: ['熱変位', '主軸'] }).map((e) => e.id)).toEqual(['3']);
  });

  it('matches every query token across all text fields, ignoring width', () => {
    expect(filterEntries(entries, { ...DEFAULT_FILTER, query: 'vb 0.3' }).map((e) => e.id)).toEqual(['3']);
    expect(filterEntries(entries, { ...DEFAULT_FILTER, query: '押湯 暖機' }).map((e) => e.id)).toEqual(['1']);
    expect(filterEntries(entries, { ...DEFAULT_FILTER, query: '押湯 主軸' })).toEqual([]);
  });

  it('combines filters', () => {
    const result = filterEntries(entries, { ...DEFAULT_FILTER, query: '熱変', category: '加工精度・寸法' });
    expect(result.map((e) => e.id)).toEqual(['1']);
  });
});

describe('collectTags / countByCategory', () => {
  it('counts tags sorted by frequency', () => {
    const tags = collectTags(entries);
    expect(tags[0]).toEqual({ tag: '熱変位', count: 2 });
    expect(tags).toHaveLength(5);
  });

  it('counts categories', () => {
    const counts = countByCategory(entries);
    expect(counts.get('機械の保守・精度管理')).toBe(1);
    expect(counts.get('安全')).toBeUndefined();
  });
});

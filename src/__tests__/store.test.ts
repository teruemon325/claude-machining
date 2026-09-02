import { describe, expect, it } from 'vitest';
import {
  STORAGE_KEY,
  createEntry,
  deleteEntry,
  exportJson,
  importJson,
  loadEntries,
  mergeEntries,
  parseTagText,
  saveEntries,
  toggleFavorite,
  updateEntry,
  validateInput,
  type StorageLike,
} from '../store';
import { SEED_ENTRIES } from '../data/seed';
import { CATEGORIES, EMPTY_INPUT, type KnowHowInput } from '../types';

class MemoryStorage implements StorageLike {
  private map = new Map<string, string>();
  getItem(key: string) {
    return this.map.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    this.map.set(key, value);
  }
  removeItem(key: string) {
    this.map.delete(key);
  }
}

const sample: KnowHowInput = {
  ...EMPTY_INPUT,
  title: '  押湯の配置  ',
  category: '工具・切削条件',
  tags: ['押湯', ' 押湯 ', '', '引け巣'],
  solution: '押湯モジュラスを 1.2 倍にする',
};

describe('createEntry / updateEntry', () => {
  it('trims fields, dedupes tags and stamps timestamps', () => {
    const now = new Date('2026-03-01T00:00:00Z');
    const entry = createEntry(sample, now);
    expect(entry.title).toBe('押湯の配置');
    expect(entry.tags).toEqual(['押湯', '引け巣']);
    expect(entry.favorite).toBe(false);
    expect(entry.createdAt).toBe(now.toISOString());
    expect(entry.updatedAt).toBe(now.toISOString());
    expect(entry.id).toBeTruthy();
  });

  it('updates only the target entry and refreshes updatedAt', () => {
    const a = createEntry(sample, new Date('2026-01-01T00:00:00Z'));
    const b = createEntry({ ...sample, title: 'B' }, new Date('2026-01-01T00:00:00Z'));
    const later = new Date('2026-02-01T00:00:00Z');
    const next = updateEntry([a, b], a.id, { ...sample, title: '改訂' }, later);
    expect(next[0].title).toBe('改訂');
    expect(next[0].updatedAt).toBe(later.toISOString());
    expect(next[0].createdAt).toBe(a.createdAt);
    expect(next[1]).toBe(b);
  });
});

describe('deleteEntry / toggleFavorite', () => {
  it('removes by id and toggles favorite', () => {
    const a = createEntry(sample);
    const b = createEntry({ ...sample, title: 'B' });
    expect(deleteEntry([a, b], a.id).map((e) => e.id)).toEqual([b.id]);
    const toggled = toggleFavorite([a, b], b.id);
    expect(toggled[1].favorite).toBe(true);
    expect(toggleFavorite(toggled, b.id)[1].favorite).toBe(false);
  });
});

describe('validateInput / parseTagText', () => {
  it('requires title and solution', () => {
    expect(validateInput(EMPTY_INPUT)).toHaveLength(2);
    expect(validateInput(sample)).toEqual([]);
  });
  it('splits tags by comma, Japanese comma and whitespace', () => {
    expect(parseTagText('押湯, 引け巣、冷やし金  砂型')).toEqual(['押湯', '引け巣', '冷やし金', '砂型']);
  });
});

describe('loadEntries / saveEntries', () => {
  it('returns seed when nothing is stored', () => {
    const storage = new MemoryStorage();
    const loaded = loadEntries(storage, SEED_ENTRIES);
    expect(loaded).toHaveLength(SEED_ENTRIES.length);
    expect(loaded).not.toBe(SEED_ENTRIES);
  });

  it('round-trips saved entries', () => {
    const storage = new MemoryStorage();
    const entry = createEntry(sample);
    saveEntries(storage, [entry]);
    expect(loadEntries(storage, SEED_ENTRIES)).toEqual([entry]);
  });

  it('falls back to seed on corrupted data and drops invalid records', () => {
    const storage = new MemoryStorage();
    storage.setItem(STORAGE_KEY, '{not json');
    expect(loadEntries(storage, SEED_ENTRIES)).toHaveLength(SEED_ENTRIES.length);

    storage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ title: 'ok', category: CATEGORIES[0] }, { title: '', category: CATEGORIES[0] }, { title: 'x', category: '存在しない' }]),
    );
    const loaded = loadEntries(storage, SEED_ENTRIES);
    expect(loaded).toHaveLength(1);
    expect(loaded[0].title).toBe('ok');
    expect(loaded[0].tags).toEqual([]);
  });
});

describe('exportJson / importJson / mergeEntries', () => {
  it('exports and re-imports the same entries', () => {
    const entries = [createEntry(sample), createEntry({ ...sample, title: 'B' })];
    const imported = importJson(exportJson(entries));
    expect(imported.entries).toEqual(entries);
    expect(imported.imageData).toEqual({});
  });

  it('accepts a bare array', () => {
    const entries = [createEntry(sample)];
    expect(importJson(JSON.stringify(entries)).entries).toEqual(entries);
  });

  it('throws on invalid input', () => {
    expect(() => importJson('nope')).toThrow();
    expect(() => importJson('{"entries": "x"}')).toThrow();
    expect(() => importJson('[]')).toThrow();
  });

  it('merges by id, overwriting existing and appending new', () => {
    const a = createEntry(sample);
    const b = createEntry({ ...sample, title: 'B' });
    const updatedA = { ...a, title: '更新済み' };
    const merged = mergeEntries([a], [updatedA, b]);
    expect(merged.map((e) => e.title)).toEqual(['更新済み', 'B']);
  });
});

describe('seed data', () => {
  it('has unique ids and valid categories', () => {
    const ids = new Set(SEED_ENTRIES.map((e) => e.id));
    expect(ids.size).toBe(SEED_ENTRIES.length);
    for (const entry of SEED_ENTRIES) {
      expect(CATEGORIES).toContain(entry.category);
      expect(validateInput(entry)).toEqual([]);
    }
  });
});

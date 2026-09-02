import { isCategory, type KnowHow, type KnowHowImage, type KnowHowInput } from './types';

export const STORAGE_KEY = 'machining-knowhow:v1';

/** localStorage 互換の最小インターフェース（テストで差し替えられるようにする） */
export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `kh-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeTags(tags: readonly string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const raw of tags) {
    const tag = raw.trim();
    if (!tag || seen.has(tag)) continue;
    seen.add(tag);
    result.push(tag);
  }
  return result;
}

/** 文字列を受け取って「,」「、」「空白」でタグに分割する */
export function parseTagText(text: string): string[] {
  return normalizeTags(text.split(/[,、\s]+/));
}

function normalizeImages(images: readonly KnowHowImage[]): KnowHowImage[] {
  const seen = new Set<string>();
  const result: KnowHowImage[] = [];
  for (const image of images) {
    if (!image.id || seen.has(image.id)) continue;
    seen.add(image.id);
    result.push({ id: image.id, name: image.name.trim(), caption: image.caption.trim() });
  }
  return result;
}

function sanitizeInput(input: KnowHowInput): KnowHowInput {
  return {
    title: input.title.trim(),
    category: input.category,
    tags: normalizeTags(input.tags),
    summary: input.summary.trim(),
    problem: input.problem.trim(),
    cause: input.cause.trim(),
    solution: input.solution.trim(),
    notes: input.notes.trim(),
    images: normalizeImages(input.images),
  };
}

export function validateInput(input: KnowHowInput): string[] {
  const errors: string[] = [];
  if (!input.title.trim()) errors.push('タイトルを入力してください。');
  if (!isCategory(input.category)) errors.push('カテゴリを選択してください。');
  if (!input.solution.trim()) errors.push('対策・ノウハウを入力してください。');
  return errors;
}

export function createEntry(input: KnowHowInput, now: Date = new Date()): KnowHow {
  const iso = now.toISOString();
  return {
    id: generateId(),
    ...sanitizeInput(input),
    favorite: false,
    createdAt: iso,
    updatedAt: iso,
  };
}

export function updateEntry(
  entries: readonly KnowHow[],
  id: string,
  input: KnowHowInput,
  now: Date = new Date(),
): KnowHow[] {
  return entries.map((entry) =>
    entry.id === id ? { ...entry, ...sanitizeInput(input), updatedAt: now.toISOString() } : entry,
  );
}

export function deleteEntry(entries: readonly KnowHow[], id: string): KnowHow[] {
  return entries.filter((entry) => entry.id !== id);
}

export function toggleFavorite(entries: readonly KnowHow[], id: string): KnowHow[] {
  return entries.map((entry) => (entry.id === id ? { ...entry, favorite: !entry.favorite } : entry));
}

/** すべてのノウハウが参照している画像 id の集合 */
export function referencedImageIds(entries: readonly KnowHow[]): Set<string> {
  const ids = new Set<string>();
  for (const entry of entries) for (const image of entry.images) ids.add(image.id);
  return ids;
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function coerceImages(raw: unknown): KnowHowImage[] {
  if (!Array.isArray(raw)) return [];
  const images: KnowHowImage[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const obj = item as Record<string, unknown>;
    const id = asString(obj.id);
    if (!id) continue;
    images.push({ id, name: asString(obj.name), caption: asString(obj.caption) });
  }
  return normalizeImages(images);
}

/** 外部から来た JSON を KnowHow に正規化する。必須項目が欠けていれば null */
export function coerceEntry(raw: unknown): KnowHow | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;
  const title = asString(obj.title).trim();
  if (!title || !isCategory(obj.category)) return null;
  const tags = Array.isArray(obj.tags) ? obj.tags.filter((t): t is string => typeof t === 'string') : [];
  const now = new Date().toISOString();
  return {
    id: asString(obj.id) || generateId(),
    title,
    category: obj.category,
    tags: normalizeTags(tags),
    summary: asString(obj.summary),
    problem: asString(obj.problem),
    cause: asString(obj.cause),
    solution: asString(obj.solution),
    notes: asString(obj.notes),
    images: coerceImages(obj.images),
    favorite: obj.favorite === true,
    createdAt: asString(obj.createdAt, now),
    updatedAt: asString(obj.updatedAt, now),
  };
}

export function loadEntries(storage: StorageLike, seed: readonly KnowHow[]): KnowHow[] {
  let text: string | null = null;
  try {
    text = storage.getItem(STORAGE_KEY);
  } catch {
    return [...seed];
  }
  if (!text) return [...seed];
  try {
    const parsed: unknown = JSON.parse(text);
    if (!Array.isArray(parsed)) return [...seed];
    return parsed.map(coerceEntry).filter((e): e is KnowHow => e !== null);
  } catch {
    return [...seed];
  }
}

export function saveEntries(storage: StorageLike, entries: readonly KnowHow[]): void {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // 容量超過やプライベートモードでは保存できないことがあるが、アプリの動作は継続させる
  }
}

/** 画像 id → data URL（base64）の対応表。エクスポート／インポートで画像本体を運ぶ */
export type ImageDataMap = Record<string, string>;

export interface ImportResult {
  entries: KnowHow[];
  imageData: ImageDataMap;
}

export function exportJson(entries: readonly KnowHow[], imageData: ImageDataMap = {}): string {
  return JSON.stringify({ app: 'machining-knowhow', version: 2, entries, imageData }, null, 2);
}

/** エクスポート形式または KnowHow の配列を読み込む。壊れていれば例外 */
export function importJson(text: string): ImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('JSON として読み込めませんでした。');
  }
  let list: unknown[] | null = null;
  let imageData: ImageDataMap = {};
  if (Array.isArray(parsed)) {
    list = parsed;
  } else if (parsed && typeof parsed === 'object') {
    const obj = parsed as { entries?: unknown; imageData?: unknown };
    if (Array.isArray(obj.entries)) list = obj.entries;
    if (obj.imageData && typeof obj.imageData === 'object') {
      for (const [id, value] of Object.entries(obj.imageData as Record<string, unknown>)) {
        if (typeof value === 'string' && value.startsWith('data:image/')) imageData[id] = value;
      }
    }
  }
  if (!list) throw new Error('ノウハウの配列が見つかりませんでした。');
  const entries = list.map(coerceEntry).filter((e): e is KnowHow => e !== null);
  if (entries.length === 0) throw new Error('有効なノウハウが1件もありませんでした。');
  // 画像本体が無い参照は落としておく（表示できないため）
  const cleaned = entries.map((entry) => ({
    ...entry,
    images: entry.images.filter((image) => image.id in imageData),
  }));
  const referenced = referencedImageIds(cleaned);
  imageData = Object.fromEntries(Object.entries(imageData).filter(([id]) => referenced.has(id)));
  return { entries: cleaned, imageData };
}

/** インポートしたデータを既存データに統合する。同じ id は上書き、新規は末尾に追加 */
export function mergeEntries(existing: readonly KnowHow[], incoming: readonly KnowHow[]): KnowHow[] {
  const byId = new Map(existing.map((e) => [e.id, e] as const));
  for (const entry of incoming) byId.set(entry.id, entry);
  return [...byId.values()];
}

export const SEED_IMAGES_FLAG_KEY = 'machining-knowhow:seed-images:v1';

/**
 * 旧バージョンで保存された初期データには画像が付いていない。
 * 初期データ由来（id が一致）で画像が空のノウハウに、初期データの画像を一度だけ補う。
 */
export function addMissingSeedImages(entries: readonly KnowHow[], seed: readonly KnowHow[]): KnowHow[] {
  const seedById = new Map(seed.map((e) => [e.id, e] as const));
  return entries.map((entry) => {
    const original = seedById.get(entry.id);
    if (!original || original.images.length === 0 || entry.images.length > 0) return entry;
    return { ...entry, images: original.images.map((img) => ({ ...img })) };
  });
}

export function applySeedImagesOnce(storage: StorageLike, entries: readonly KnowHow[], seed: readonly KnowHow[]): KnowHow[] {
  try {
    if (storage.getItem(SEED_IMAGES_FLAG_KEY)) return [...entries];
  } catch {
    return [...entries];
  }
  const next = addMissingSeedImages(entries, seed);
  try {
    storage.setItem(SEED_IMAGES_FLAG_KEY, new Date().toISOString());
  } catch {
    // 保存できなくても動作は続ける
  }
  return next;
}

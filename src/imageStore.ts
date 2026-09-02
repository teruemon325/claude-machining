/**
 * 画像本体の保存先。localStorage は容量が小さい（約 5MB）ため IndexedDB を使う。
 * テストやフォールバック用にメモリ実装も用意する。
 */
export interface ImageStore {
  get(id: string): Promise<Blob | undefined>;
  put(id: string, blob: Blob): Promise<void>;
  delete(id: string): Promise<void>;
  keys(): Promise<string[]>;
  clear(): Promise<void>;
}

export class MemoryImageStore implements ImageStore {
  private map = new Map<string, Blob>();
  async get(id: string) {
    return this.map.get(id);
  }
  async put(id: string, blob: Blob) {
    this.map.set(id, blob);
  }
  async delete(id: string) {
    this.map.delete(id);
  }
  async keys() {
    return [...this.map.keys()];
  }
  async clear() {
    this.map.clear();
  }
}

const DB_NAME = 'machining-knowhow';
const DB_VERSION = 1;
const STORE_NAME = 'images';

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed'));
  });
}

export class IndexedDbImageStore implements ImageStore {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private open(): Promise<IDBDatabase> {
    if (!this.dbPromise) {
      this.dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error ?? new Error('IndexedDB を開けませんでした'));
      });
    }
    return this.dbPromise;
  }

  private async run<T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
    const db = await this.open();
    const tx = db.transaction(STORE_NAME, mode);
    const result = await requestToPromise(fn(tx.objectStore(STORE_NAME)));
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error ?? new Error('IndexedDB transaction failed'));
      tx.onabort = () => reject(tx.error ?? new Error('IndexedDB transaction aborted'));
    });
    return result;
  }

  get(id: string) {
    return this.run<Blob | undefined>('readonly', (s) => s.get(id) as IDBRequest<Blob | undefined>);
  }
  async put(id: string, blob: Blob) {
    await this.run('readwrite', (s) => s.put(blob, id));
  }
  async delete(id: string) {
    await this.run('readwrite', (s) => s.delete(id));
  }
  async keys() {
    const keys = await this.run<IDBValidKey[]>('readonly', (s) => s.getAllKeys());
    return keys.map(String);
  }
  async clear() {
    await this.run('readwrite', (s) => s.clear());
  }
}

export function createImageStore(): ImageStore {
  if (typeof indexedDB !== 'undefined') return new IndexedDbImageStore();
  return new MemoryImageStore();
}

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error('画像の読み込みに失敗しました'));
    reader.readAsDataURL(blob);
  });
}

export function dataUrlToBlob(dataUrl: string): Blob {
  const match = /^data:([^;,]+)?(;base64)?,(.*)$/s.exec(dataUrl);
  if (!match) throw new Error('data URL の形式が不正です');
  const mime = match[1] || 'application/octet-stream';
  const payload = match[3];
  if (match[2]) {
    const binary = atob(payload);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return new Blob([bytes], { type: mime });
  }
  return new Blob([decodeURIComponent(payload)], { type: mime });
}

const MAX_EDGE = 1600;
const JPEG_QUALITY = 0.85;
const KEEP_AS_IS_BYTES = 400 * 1024;

function loadImage(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('画像として読み込めませんでした'));
    };
    img.src = url;
  });
}

/**
 * 添付前に画像を縮小・圧縮する。長辺 1600px、JPEG 品質 0.85 が目安。
 * SVG や小さな PNG（図・スケッチ）はそのまま保持する。
 */
export async function prepareImage(file: Blob): Promise<Blob> {
  if (!file.type.startsWith('image/')) throw new Error('画像ファイルを選択してください');
  if (file.type === 'image/svg+xml') return file;
  const img = await loadImage(file);
  const longEdge = Math.max(img.naturalWidth, img.naturalHeight);
  const needsResize = longEdge > MAX_EDGE;
  if (!needsResize && file.size <= KEEP_AS_IS_BYTES) return file;
  const scale = needsResize ? MAX_EDGE / longEdge : 1;
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.naturalWidth * scale);
  canvas.height = Math.round(img.naturalHeight * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;
  // 透過 PNG を JPEG にすると背景が黒くなるため白で塗る
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY));
  return blob && blob.size < file.size ? blob : file;
}

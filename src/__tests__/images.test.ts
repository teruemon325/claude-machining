import { describe, expect, it } from 'vitest';
import { MemoryImageStore, dataUrlToBlob } from '../imageStore';
import { createEntry, exportJson, importJson, referencedImageIds } from '../store';
import { EMPTY_INPUT, type KnowHowInput } from '../types';

const PNG_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

const base: KnowHowInput = { ...EMPTY_INPUT, title: '画像付き', category: '段取り・治具・クランプ', solution: '対策' };

describe('MemoryImageStore', () => {
  it('stores, lists, deletes and clears blobs', async () => {
    const store = new MemoryImageStore();
    const blob = new Blob(['x'], { type: 'image/png' });
    await store.put('a', blob);
    await store.put('b', blob);
    expect((await store.keys()).sort()).toEqual(['a', 'b']);
    expect(await store.get('a')).toBe(blob);
    await store.delete('a');
    expect(await store.get('a')).toBeUndefined();
    await store.clear();
    expect(await store.keys()).toEqual([]);
  });
});

describe('dataUrlToBlob', () => {
  it('decodes a base64 data URL with its mime type', async () => {
    const blob = dataUrlToBlob(PNG_DATA_URL);
    expect(blob.type).toBe('image/png');
    const bytes = new Uint8Array(await blob.arrayBuffer());
    expect([...bytes.slice(0, 4)]).toEqual([0x89, 0x50, 0x4e, 0x47]);
  });
  it('rejects malformed input', () => {
    expect(() => dataUrlToBlob('not a data url')).toThrow();
  });
});

describe('image metadata on entries', () => {
  it('keeps image order, trims captions and drops duplicate ids', () => {
    const entry = createEntry({
      ...base,
      images: [
        { id: 'img-1', name: 'a.jpg', caption: ' ゲート付近 ' },
        { id: 'img-2', name: 'b.jpg', caption: '' },
        { id: 'img-1', name: 'dup.jpg', caption: 'x' },
        { id: '', name: 'noid.jpg', caption: '' },
      ],
    });
    expect(entry.images).toEqual([
      { id: 'img-1', name: 'a.jpg', caption: 'ゲート付近' },
      { id: 'img-2', name: 'b.jpg', caption: '' },
    ]);
    expect([...referencedImageIds([entry])].sort()).toEqual(['img-1', 'img-2']);
  });

  it('round-trips images through export and import', () => {
    const entry = createEntry({ ...base, images: [{ id: 'img-1', name: 'a.png', caption: '断面' }] });
    const json = exportJson([entry], { 'img-1': PNG_DATA_URL });
    const result = importJson(json);
    expect(result.entries).toEqual([entry]);
    expect(result.imageData).toEqual({ 'img-1': PNG_DATA_URL });
  });

  it('drops image references whose data is missing, and data nobody references', () => {
    const entry = createEntry({
      ...base,
      images: [
        { id: 'img-1', name: 'a.png', caption: '' },
        { id: 'img-missing', name: 'b.png', caption: '' },
      ],
    });
    const json = exportJson([entry], { 'img-1': PNG_DATA_URL, 'img-orphan': PNG_DATA_URL, 'img-bad': 'nope' });
    const result = importJson(json);
    expect(result.entries[0].images.map((i) => i.id)).toEqual(['img-1']);
    expect(Object.keys(result.imageData)).toEqual(['img-1']);
  });

  it('reads version-1 exports that have no images', () => {
    const entry = createEntry(base);
    const { images: _images, ...legacy } = entry;
    const result = importJson(JSON.stringify({ app: 'casting-mold-knowhow', version: 1, entries: [legacy] }));
    expect(result.entries[0].images).toEqual([]);
    expect(result.imageData).toEqual({});
  });
});

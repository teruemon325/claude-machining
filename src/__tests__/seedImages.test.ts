import { describe, expect, it } from 'vitest';
import { SEED_ENTRIES } from '../data/seed';
import { SEED_IMAGES, seedImageBlob, seedImageRefs } from '../data/seedImages';
import { addMissingSeedImages, applySeedImagesOnce, referencedImageIds, SEED_IMAGES_FLAG_KEY, type StorageLike } from '../store';

class MemoryStorage implements StorageLike {
  map = new Map<string, string>();
  getItem(k: string) {
    return this.map.get(k) ?? null;
  }
  setItem(k: string, v: string) {
    this.map.set(k, v);
  }
  removeItem(k: string) {
    this.map.delete(k);
  }
}

describe('seed images', () => {
  it('every image referenced by the seed exists and every seed image is used', () => {
    const referenced = referencedImageIds(SEED_ENTRIES);
    for (const id of referenced) expect(SEED_IMAGES[id]).toBeDefined();
    for (const id of Object.keys(SEED_IMAGES)) expect(referenced.has(id)).toBe(true);
    expect(referenced.size).toBeGreaterThanOrEqual(9);
  });

  it('produces well-formed SVG blobs with captions', async () => {
    for (const [id, image] of Object.entries(SEED_IMAGES)) {
      expect(image.caption.length).toBeGreaterThan(10);
      expect(image.svg.startsWith('<svg')).toBe(true);
      expect(image.svg.trimEnd().endsWith('</svg>')).toBe(true);
      expect(image.svg).toContain('viewBox=');
      const blob = seedImageBlob(id);
      expect(blob?.type).toBe('image/svg+xml');
      expect(await blob!.text()).toBe(image.svg);
    }
    expect(seedImageBlob('nope')).toBeNull();
    expect(() => seedImageRefs('nope')).toThrow();
  });
});

describe('addMissingSeedImages / applySeedImagesOnce', () => {
  const withImages = SEED_ENTRIES.find((e) => e.images.length > 0)!;
  const stripped = { ...withImages, images: [] };
  const edited = { ...withImages, images: [{ id: 'user-img', name: 'u.jpg', caption: '' }] };
  const custom = { ...withImages, id: 'user-entry', images: [] };

  it('fills images only for seed entries that have none', () => {
    const result = addMissingSeedImages([stripped, edited, custom], SEED_ENTRIES);
    expect(result[0].images).toEqual(withImages.images);
    expect(result[1].images).toEqual(edited.images);
    expect(result[2].images).toEqual([]);
  });

  it('runs once per storage and records a flag', () => {
    const storage = new MemoryStorage();
    const first = applySeedImagesOnce(storage, [stripped], SEED_ENTRIES);
    expect(first[0].images.length).toBeGreaterThan(0);
    expect(storage.getItem(SEED_IMAGES_FLAG_KEY)).toBeTruthy();
    const second = applySeedImagesOnce(storage, [stripped], SEED_ENTRIES);
    expect(second[0].images).toEqual([]);
  });
});

import { createContext, useContext, useEffect, useState } from 'react';
import { MemoryImageStore, type ImageStore } from '../imageStore';
import { seedImageBlob } from '../data/seedImages';

export const ImageStoreContext = createContext<ImageStore>(new MemoryImageStore());

export function useImageStore(): ImageStore {
  return useContext(ImageStoreContext);
}

/**
 * 画像の表示用 URL を返す。blob が渡されればそれを、無ければストアから id で取り出す。
 * 初期データの解説図はストア投入前でも表示できるよう、無ければ組み込みの SVG にフォールバックする。
 * 生成した object URL はアンマウント時に解放する。
 */
export function useImageUrl(id: string, blob?: Blob): string | null {
  const store = useImageStore();
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;
    const assign = (b: Blob | undefined) => {
      if (!active || !b) return;
      objectUrl = URL.createObjectURL(b);
      setUrl(objectUrl);
    };
    if (blob) {
      assign(blob);
    } else {
      store.get(id).then(
        (b) => assign(b ?? seedImageBlob(id) ?? undefined),
        () => assign(seedImageBlob(id) ?? undefined),
      );
    }
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      setUrl(null);
    };
  }, [id, blob, store]);

  return url;
}

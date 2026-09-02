import { useEffect } from 'react';
import type { KnowHowImage } from '../types';
import { useImageUrl } from './ImageStoreContext';

interface Props {
  image: KnowHowImage;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

export function Lightbox({ image, onClose, onPrev, onNext }: Props) {
  const url = useImageUrl(image.id);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      } else if (e.key === 'ArrowLeft' && onPrev) onPrev();
      else if (e.key === 'ArrowRight' && onNext) onNext();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [onClose, onPrev, onNext]);

  return (
    <div className="lightbox" onMouseDown={onClose} role="dialog" aria-modal="true" aria-label={image.caption || image.name}>
      <button type="button" className="lightbox-close" onClick={onClose} aria-label="閉じる">
        ×
      </button>
      {onPrev && (
        <button type="button" className="lightbox-nav lightbox-prev" onMouseDown={(e) => e.stopPropagation()} onClick={onPrev} aria-label="前の画像">
          ‹
        </button>
      )}
      <figure onMouseDown={(e) => e.stopPropagation()}>
        {url ? <img src={url} alt={image.caption || image.name} /> : <div className="lightbox-loading">読み込み中…</div>}
        {(image.caption || image.name) && <figcaption>{image.caption || image.name}</figcaption>}
      </figure>
      {onNext && (
        <button type="button" className="lightbox-nav lightbox-next" onMouseDown={(e) => e.stopPropagation()} onClick={onNext} aria-label="次の画像">
          ›
        </button>
      )}
    </div>
  );
}

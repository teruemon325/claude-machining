import { useState } from 'react';
import type { KnowHowImage } from '../types';
import { ImageThumb } from './ImageThumb';
import { Lightbox } from './Lightbox';

export function ImageGallery({ images }: { images: readonly KnowHowImage[] }) {
  const [index, setIndex] = useState<number | null>(null);
  if (images.length === 0) return null;
  const current = index !== null ? images[index] : null;
  return (
    <section className="detail-section">
      <h3>画像（{images.length}）</h3>
      <ul className="gallery">
        {images.map((image, i) => (
          <li key={image.id}>
            <ImageThumb image={image} onClick={() => setIndex(i)} />
            {image.caption && <p className="gallery-caption">{image.caption}</p>}
          </li>
        ))}
      </ul>
      {current && (
        <Lightbox
          image={current}
          onClose={() => setIndex(null)}
          onPrev={index! > 0 ? () => setIndex(index! - 1) : undefined}
          onNext={index! < images.length - 1 ? () => setIndex(index! + 1) : undefined}
        />
      )}
    </section>
  );
}

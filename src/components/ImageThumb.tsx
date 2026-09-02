import type { KnowHowImage } from '../types';
import { useImageUrl } from './ImageStoreContext';

interface Props {
  image: KnowHowImage;
  blob?: Blob;
  size?: 'small' | 'medium';
  onClick?: () => void;
}

export function ImageThumb({ image, blob, size = 'medium', onClick }: Props) {
  const url = useImageUrl(image.id, blob);
  const alt = image.caption || image.name || '添付画像';
  const className = `thumb thumb-${size}`;
  if (!url) return <div className={`${className} thumb-loading`} aria-label="画像を読み込み中" />;
  if (onClick) {
    return (
      <button type="button" className={`${className} thumb-button`} onClick={onClick} aria-label={`${alt} を拡大`}>
        <img src={url} alt={alt} loading="lazy" />
      </button>
    );
  }
  return (
    <div className={className}>
      <img src={url} alt={alt} loading="lazy" />
    </div>
  );
}

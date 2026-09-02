import { useRef, useState, type ClipboardEvent, type DragEvent } from 'react';
import { prepareImage } from '../imageStore';
import { generateId } from '../store';
import type { KnowHowImage } from '../types';
import { ImageThumb } from './ImageThumb';

/** フォーム内で扱う画像。blob があれば今回新しく追加されたもの */
export interface FormImage extends KnowHowImage {
  blob?: Blob;
}

interface Props {
  images: FormImage[];
  onChange: (images: FormImage[]) => void;
}

export const MAX_IMAGES = 20;

export function ImagePicker({ images, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const addFiles = async (files: Iterable<File>) => {
    const list = [...files].filter((f) => f.type.startsWith('image/'));
    if (list.length === 0) {
      setError('画像ファイル（JPEG・PNG・GIF・SVG など）を選んでください。');
      return;
    }
    const room = MAX_IMAGES - images.length;
    if (room <= 0) {
      setError(`画像は 1 件あたり ${MAX_IMAGES} 枚までです。`);
      return;
    }
    setBusy(true);
    setError(null);
    const added: FormImage[] = [];
    for (const file of list.slice(0, room)) {
      try {
        const blob = await prepareImage(file);
        added.push({ id: generateId(), name: file.name || 'image', caption: '', blob });
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    }
    setBusy(false);
    if (added.length > 0) onChange([...images, ...added]);
    if (list.length > room) setError(`画像は ${MAX_IMAGES} 枚までのため、${list.length - room} 枚は追加しませんでした。`);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    void addFiles(e.dataTransfer.files);
  };

  const onPaste = (e: ClipboardEvent) => {
    const files = [...e.clipboardData.files].filter((f) => f.type.startsWith('image/'));
    if (files.length > 0) {
      e.preventDefault();
      void addFiles(files);
    }
  };

  const update = (id: string, patch: Partial<FormImage>) =>
    onChange(images.map((img) => (img.id === id ? { ...img, ...patch } : img)));
  const remove = (id: string) => onChange(images.filter((img) => img.id !== id));
  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="image-picker">
      <div
        className={`dropzone${dragging ? ' dropzone-active' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onPaste={onPaste}
        tabIndex={0}
        aria-label="画像を追加する領域"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            if (e.target.files) void addFiles(e.target.files);
            e.target.value = '';
          }}
        />
        <button type="button" className="btn" onClick={() => inputRef.current?.click()} disabled={busy}>
          {busy ? '画像を処理中…' : '📷 画像を追加'}
        </button>
        <p className="muted small">
          写真・スケッチ・図をドラッグ＆ドロップ、または貼り付け（Ctrl+V）でも追加できます。長辺 1600px に自動で縮小します。
        </p>
      </div>
      {error && (
        <p className="form-inline-error" role="alert">
          {error}
        </p>
      )}
      {images.length > 0 && (
        <ul className="image-list">
          {images.map((image, index) => (
            <li key={image.id} className="image-item">
              <ImageThumb image={image} blob={image.blob} size="small" />
              <div className="image-item-body">
                <input
                  type="text"
                  value={image.caption}
                  placeholder="説明（例：ゲート付近のヒートチェック）"
                  aria-label="画像の説明"
                  onChange={(e) => update(image.id, { caption: e.target.value })}
                />
                <div className="image-item-actions">
                  <button type="button" className="link" onClick={() => move(index, -1)} disabled={index === 0}>
                    ↑ 前へ
                  </button>
                  <button type="button" className="link" onClick={() => move(index, 1)} disabled={index === images.length - 1}>
                    ↓ 後へ
                  </button>
                  <button type="button" className="link link-danger" onClick={() => remove(image.id)}>
                    削除
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

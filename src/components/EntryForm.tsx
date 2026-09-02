import { useState, type FormEvent } from 'react';
import { CATEGORIES, type KnowHowInput } from '../types';
import { parseTagText, validateInput } from '../store';
import { Modal } from './Modal';
import { ImagePicker, type FormImage } from './ImagePicker';

/** 新規追加分の画像本体。id → Blob */
export type NewImageBlobs = Map<string, Blob>;

interface Props {
  title: string;
  initial: KnowHowInput;
  onCancel: () => void;
  onSubmit: (input: KnowHowInput, newBlobs: NewImageBlobs) => void;
}

export function EntryForm({ title, initial, onCancel, onSubmit }: Props) {
  const [values, setValues] = useState<KnowHowInput>(initial);
  const [images, setImages] = useState<FormImage[]>(initial.images);
  const [tagText, setTagText] = useState(initial.tags.join(', '));
  const [errors, setErrors] = useState<string[]>([]);

  const set = <K extends keyof KnowHowInput>(key: K, value: KnowHowInput[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newBlobs: NewImageBlobs = new Map();
    for (const image of images) if (image.blob) newBlobs.set(image.id, image.blob);
    const input: KnowHowInput = {
      ...values,
      tags: parseTagText(tagText),
      images: images.map(({ id, name, caption }) => ({ id, name, caption })),
    };
    const found = validateInput(input);
    if (found.length > 0) {
      setErrors(found);
      return;
    }
    onSubmit(input, newBlobs);
  };

  return (
    <Modal title={title} onClose={onCancel} wide>
      <form className="form" onSubmit={handleSubmit} noValidate>
        {errors.length > 0 && (
          <ul className="form-errors" role="alert">
            {errors.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        )}
        <label>
          タイトル <span className="required">必須</span>
          <input type="text" value={values.title} onChange={(e) => set('title', e.target.value)} autoFocus />
        </label>
        <div className="form-row">
          <label>
            カテゴリ
            <select value={values.category} onChange={(e) => set('category', e.target.value as KnowHowInput['category'])}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label>
            タグ（カンマ・空白区切り）
            <input type="text" value={tagText} onChange={(e) => setTagText(e.target.value)} placeholder="例：引け巣, 押湯" />
          </label>
        </div>
        <label>
          要約（一覧に表示）
          <textarea rows={2} value={values.summary} onChange={(e) => set('summary', e.target.value)} />
        </label>
        <label>
          現象・課題
          <textarea rows={3} value={values.problem} onChange={(e) => set('problem', e.target.value)} />
        </label>
        <label>
          原因
          <textarea rows={3} value={values.cause} onChange={(e) => set('cause', e.target.value)} />
        </label>
        <label>
          対策・ノウハウ <span className="required">必須</span>
          <textarea rows={6} value={values.solution} onChange={(e) => set('solution', e.target.value)} />
        </label>
        <label>
          備考
          <textarea rows={2} value={values.notes} onChange={(e) => set('notes', e.target.value)} />
        </label>
        <div className="form-field">
          <span className="form-field-label">画像（写真・スケッチ・図）</span>
          <ImagePicker images={images} onChange={setImages} />
        </div>
        <div className="form-actions">
          <button type="button" className="btn" onClick={onCancel}>
            キャンセル
          </button>
          <button type="submit" className="btn btn-primary">
            保存
          </button>
        </div>
      </form>
    </Modal>
  );
}

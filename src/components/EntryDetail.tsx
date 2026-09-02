import type { KnowHow } from '../types';
import { CategoryBadge } from './CategoryBadge';
import { Modal } from './Modal';
import { ImageGallery } from './ImageGallery';

interface Props {
  entry: KnowHow;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
}

function Section({ label, text }: { label: string; text: string }) {
  if (!text) return null;
  return (
    <section className="detail-section">
      <h3>{label}</h3>
      <p className="pre">{text}</p>
    </section>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('ja-JP');
}

export function EntryDetail({ entry, onClose, onEdit, onDelete, onToggleFavorite }: Props) {
  return (
    <Modal title={entry.title} onClose={onClose} wide>
      <div className="detail-meta">
        <CategoryBadge category={entry.category} />
        {entry.tags.map((tag) => (
          <span key={tag} className="chip chip-small chip-static">
            {tag}
          </span>
        ))}
      </div>
      {entry.summary && <p className="detail-summary">{entry.summary}</p>}
      <Section label="現象・課題" text={entry.problem} />
      <Section label="原因" text={entry.cause} />
      <Section label="対策・ノウハウ" text={entry.solution} />
      <ImageGallery images={entry.images} />
      <Section label="備考" text={entry.notes} />
      <p className="muted small">最終更新: {formatDate(entry.updatedAt)}</p>
      <div className="detail-actions">
        <button type="button" className="btn" onClick={onToggleFavorite}>
          {entry.favorite ? '★ お気に入り解除' : '☆ お気に入り'}
        </button>
        <button type="button" className="btn btn-primary" onClick={onEdit}>
          編集
        </button>
        <button type="button" className="btn btn-danger" onClick={onDelete}>
          削除
        </button>
      </div>
    </Modal>
  );
}

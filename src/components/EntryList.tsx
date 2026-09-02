import type { KnowHow } from '../types';
import { CategoryBadge } from './CategoryBadge';
import { ImageThumb } from './ImageThumb';

interface Props {
  entries: readonly KnowHow[];
  total: number;
  onSelect: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onTagClick: (tag: string) => void;
}

export function EntryList({ entries, total, onSelect, onToggleFavorite, onTagClick }: Props) {
  return (
    <main className="content">
      <p className="result-count">
        {entries.length} 件表示{total !== entries.length ? `（全 ${total} 件）` : ''}
      </p>
      {entries.length === 0 ? (
        <div className="empty">
          <p>条件に合うノウハウがありません。</p>
          <p className="muted">検索語や絞り込みを変えるか、「新規追加」から登録してください。</p>
        </div>
      ) : (
        <ul className="card-grid">
          {entries.map((entry) => (
            <li key={entry.id} className="card">
              <div className="card-top">
                <CategoryBadge category={entry.category} />
                <button
                  type="button"
                  className={`star${entry.favorite ? ' star-on' : ''}`}
                  onClick={() => onToggleFavorite(entry.id)}
                  aria-label={entry.favorite ? 'お気に入りから外す' : 'お気に入りに追加'}
                  aria-pressed={entry.favorite}
                >
                  {entry.favorite ? '★' : '☆'}
                </button>
              </div>
              <button type="button" className="card-title" onClick={() => onSelect(entry.id)}>
                {entry.title}
              </button>
              <p className="card-summary">{entry.summary}</p>
              {entry.images.length > 0 && (
                <div className="card-thumbs" aria-label={`画像 ${entry.images.length} 枚`}>
                  {entry.images.slice(0, 3).map((image) => (
                    <ImageThumb key={image.id} image={image} size="small" onClick={() => onSelect(entry.id)} />
                  ))}
                  {entry.images.length > 3 && <span className="card-thumbs-more">+{entry.images.length - 3}</span>}
                </div>
              )}
              {entry.tags.length > 0 && (
                <div className="card-tags">
                  {entry.tags.map((tag) => (
                    <button key={tag} type="button" className="chip chip-small" onClick={() => onTagClick(tag)}>
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

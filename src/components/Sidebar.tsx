import { CATEGORIES, type Category, type KnowHow } from '../types';
import { collectTags, countByCategory, type Filter } from '../search';

interface Props {
  entries: readonly KnowHow[];
  filter: Filter;
  onChange: (next: Filter) => void;
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ entries, filter, onChange, open, onClose }: Props) {
  const categoryCounts = countByCategory(entries);
  const tags = collectTags(entries);
  const favoriteCount = entries.filter((e) => e.favorite).length;

  const selectCategory = (category: Category | 'all') => {
    onChange({ ...filter, category });
    onClose();
  };
  const toggleTag = (tag: string) => {
    const next = filter.tags.includes(tag) ? filter.tags.filter((t) => t !== tag) : [...filter.tags, tag];
    onChange({ ...filter, tags: next });
  };

  return (
    <aside className={`sidebar${open ? ' sidebar-open' : ''}`}>
      <section>
        <h2 className="sidebar-heading">カテゴリ</h2>
        <ul className="category-list">
          <li>
            <button
              type="button"
              className={filter.category === 'all' ? 'active' : ''}
              onClick={() => selectCategory('all')}
            >
              <span>すべて</span>
              <span className="count">{entries.length}</span>
            </button>
          </li>
          {CATEGORIES.map((category) => (
            <li key={category}>
              <button
                type="button"
                className={filter.category === category ? 'active' : ''}
                onClick={() => selectCategory(category)}
              >
                <span>{category}</span>
                <span className="count">{categoryCounts.get(category) ?? 0}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={filter.favoritesOnly}
            onChange={(e) => onChange({ ...filter, favoritesOnly: e.target.checked })}
          />
          ★ お気に入りのみ（{favoriteCount}）
        </label>
      </section>

      <section>
        <div className="sidebar-heading-row">
          <h2 className="sidebar-heading">タグ</h2>
          {filter.tags.length > 0 && (
            <button type="button" className="link" onClick={() => onChange({ ...filter, tags: [] })}>
              解除
            </button>
          )}
        </div>
        <div className="tag-cloud">
          {tags.map(({ tag, count }) => (
            <button
              key={tag}
              type="button"
              className={`chip${filter.tags.includes(tag) ? ' chip-active' : ''}`}
              onClick={() => toggleTag(tag)}
            >
              {tag} <span className="count">{count}</span>
            </button>
          ))}
          {tags.length === 0 && <p className="muted">タグはまだありません</p>}
        </div>
      </section>
    </aside>
  );
}

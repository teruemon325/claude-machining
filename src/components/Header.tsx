interface Props {
  query: string;
  onQueryChange: (q: string) => void;
  onNew: () => void;
  onExport: () => void;
  onImport: () => void;
  onReset: () => void;
  onToggleSidebar: () => void;
}

export function Header({ query, onQueryChange, onNew, onExport, onImport, onReset, onToggleSidebar }: Props) {
  return (
    <header className="header">
      <div className="header-left">
        <button type="button" className="btn btn-icon sidebar-toggle" onClick={onToggleSidebar} aria-label="絞り込みを表示">
          ☰
        </button>
        <h1 className="app-title">
          <span className="app-title-icon" aria-hidden="true">⚙</span>
          <span className="app-title-text">ノウハウ集</span>
        </h1>
      </div>
      <div className="header-search">
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="キーワード検索（例：びびり 突き出し）"
          aria-label="ノウハウを検索"
        />
      </div>
      <div className="header-actions">
        <button type="button" className="btn btn-primary" onClick={onNew}>
          ＋ 新規追加
        </button>
        <details className="menu">
          <summary className="btn" aria-label="その他の操作">…</summary>
          <div className="menu-list">
            <button type="button" onClick={onExport}>JSON エクスポート</button>
            <button type="button" onClick={onImport}>JSON インポート</button>
            <button type="button" className="danger" onClick={onReset}>初期データに戻す</button>

          </div>
        </details>
      </div>
    </header>
  );
}

/** 4 つのページ（ドキュメント／ノウハウ集／切削シミュレータ／G コードトレーナー）を横断する共通ナビ */
const LINKS = [
  { key: 'docs', label: 'ドキュメント', href: 'docs/' },
  { key: 'app', label: 'ノウハウ集', href: './' },
  { key: 'sim', label: '切削シミュレータ', href: 'simulator/' },
  { key: 'gcode', label: 'Gコードトレーナー', href: 'gcode/' },
] as const;

export function StudyNav() {
  return (
    <nav className="study" aria-label="マシニング加工スタディ">
      <span className="study-brand">⚙ マシニング加工スタディ</span>
      {LINKS.map((l) => (
        <a key={l.key} href={l.href} aria-current={l.key === 'app' ? 'page' : undefined}>
          {l.label}
        </a>
      ))}
    </nav>
  );
}

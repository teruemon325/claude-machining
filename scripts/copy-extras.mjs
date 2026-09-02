// ビルド後に、解説ドキュメントの図版と切削シミュレータを dist/ に同梱する。
// 解説ドキュメント本体（MkDocs）は .github/workflows/deploy-pages.yml で dist/docs に生成する。
import { cpSync, mkdirSync, existsSync } from 'node:fs';

mkdirSync('dist/simulator', { recursive: true });
cpSync('docs/app/cutting-simulator.html', 'dist/simulator/index.html');
mkdirSync('dist/gcode', { recursive: true });
cpSync('docs/app/gcode-trainer.html', 'dist/gcode/index.html');
cpSync('docs/images', 'dist/images', { recursive: true });
if (!existsSync('dist/docs')) {
  // MkDocs が無い環境（ローカル build）でもリンク切れにならないよう、案内ページを置く
  mkdirSync('dist/docs', { recursive: true });
  cpSync('scripts/docs-placeholder.html', 'dist/docs/index.html');
}
console.log('copied: dist/simulator, dist/gcode, dist/images' + (existsSync('dist/docs/index.html') ? ', dist/docs' : ''));

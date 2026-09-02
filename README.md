# マシニングセンタ加工ノウハウ集

製造業の切削加工、特に **マシニングセンタ（MC）** による加工の現場ノウハウを、図版付きで体系的にまとめたドキュメントです。
工具・切削条件、段取り・治具・クランプ、加工精度、びびり、切りくず・切削油、工具摩耗・寿命、面粗さ、プログラム（CAM・G コード）、機械の保守、安全、機械・工具の選び方、材料、準備の進め方をカバーしています。

**→ [目次はこちら（docs/index.md）](docs/index.md)**

## 構成

```
docs/
├── index.md                    目次・使い方
├── 00-preparation.md           加工準備の進め方（図面 → 工程設計 → 初品）
├── 01-machine.md               マシニングセンタの基礎と選び方
├── 02-materials.md             材料と被削性
├── 03-tools.md                 工具の選び方（種類・材質・コーティング・ホルダ）
├── 04-cutting-conditions.md    切削条件（Vc・fz・ap・ae、材料別条件表）
├── 05-setup-fixture.md         段取り・治具・クランプ・原点出し
├── 06-accuracy.md              加工精度・寸法（熱変位・たわみ・測定）
├── 07-chatter.md               びびり・振動
├── 08-chips-coolant.md         切りくず・切削油
├── 09-tool-wear.md             工具摩耗・寿命
├── 10-surface-finish.md        面粗さ・仕上げ・バリ
├── 11-programming.md           プログラム（G コード・CAM）
├── 12-maintenance.md           機械の保守・精度管理
├── 13-safety.md                安全
├── appendix/
│   ├── a-formulas.md           計算式集
│   ├── b-troubleshooting.md    トラブルシューティング早見表
│   ├── c-checklists.md         チェックリスト
│   └── d-glossary.md           用語集
└── images/                     図版（SVG、27 点）
```

## 図版について

図版はすべて SVG（テキスト形式）で `docs/images/` に置いています。GitHub 上でそのまま表示でき、テキストエディタで数値や文言を編集できます。

## サイトとして閲覧する（任意）

[MkDocs](https://www.mkdocs.org/) の設定ファイル `mkdocs.yml` を同梱しています。

```bash
pip install mkdocs mkdocs-material
mkdocs serve      # http://127.0.0.1:8000 で閲覧
mkdocs build      # site/ に静的サイトを生成
```

## 使い方の注意

- 記載している切削条件・数値はすべて **目安** です。工具メーカーのカタログ推奨値と、自社の機械・治具・ワークの剛性を起点に必ず調整してください。
- 安全に関する記述は一般的な指針です。各事業所の安全規程・法令・機械メーカーの取扱説明書を優先してください。

## 貢献

現場で得られた知見（うまくいった条件、失敗事例、治具のアイデア）を追記していくことを想定しています。章ごとの Markdown を編集し、必要なら `docs/images/` に SVG を追加してください。

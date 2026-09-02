export const CATEGORIES = [
  '工具・切削条件',
  '段取り・治具・クランプ',
  '加工精度・寸法',
  'びびり・振動',
  '切りくず・切削油',
  '工具摩耗・寿命',
  '面粗さ・仕上げ',
  'プログラム（CAM・G コード）',
  '機械の保守・精度管理',
  '安全',
  '材料',
  '機械・工具の選定',
  '加工準備・工程設計',
] as const;

export type Category = (typeof CATEGORIES)[number];

export function isCategory(value: unknown): value is Category {
  return typeof value === 'string' && (CATEGORIES as readonly string[]).includes(value);
}

/** 添付画像のメタデータ。画像本体は imageStore（IndexedDB）に id で保存する */
export interface KnowHowImage {
  id: string;
  name: string;
  caption: string;
}

/** ノウハウ1件分のデータ */
export interface KnowHow {
  id: string;
  title: string;
  category: Category;
  tags: string[];
  /** 一覧に表示する要約 */
  summary: string;
  /** 現象・課題 */
  problem: string;
  /** 原因 */
  cause: string;
  /** 対策・ノウハウ */
  solution: string;
  /** 備考（参考値・注意点など） */
  notes: string;
  images: KnowHowImage[];
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
}

/** フォームから受け取る入力値 */
export type KnowHowInput = Pick<
  KnowHow,
  'title' | 'category' | 'tags' | 'summary' | 'problem' | 'cause' | 'solution' | 'notes' | 'images'
>;

export const EMPTY_INPUT: KnowHowInput = {
  title: '',
  category: CATEGORIES[0],
  tags: [],
  summary: '',
  problem: '',
  cause: '',
  solution: '',
  notes: '',
  images: [],
};

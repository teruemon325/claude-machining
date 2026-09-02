import type { Category } from '../types';

const COLOR_INDEX: Record<Category, number> = {
  '工具・切削条件': 0,
  '段取り・治具・クランプ': 1,
  '加工精度・寸法': 2,
  'びびり・振動': 3,
  '切りくず・切削油': 4,
  '工具摩耗・寿命': 5,
  '面粗さ・仕上げ': 6,
  'プログラム（CAM・G コード）': 7,
  安全: 8,
  '機械の保守・精度管理': 9,
  材料: 10,
  '機械・工具の選定': 11,
  '加工準備・工程設計': 12,
};

export function CategoryBadge({ category }: { category: Category }) {
  return <span className={`badge badge-c${COLOR_INDEX[category]}`}>{category}</span>;
}

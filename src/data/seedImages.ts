import type { KnowHowImage } from '../types';
import mcStructure from '../../docs/images/mc-structure.svg?raw';
import mcTypes from '../../docs/images/mc-types.svg?raw';
import cuttingParameters from '../../docs/images/cutting-parameters.svg?raw';
import endmillParts from '../../docs/images/endmill-parts.svg?raw';
import climbVsConventional from '../../docs/images/climb-vs-conventional.svg?raw';
import chipThinning from '../../docs/images/chip-thinning.svg?raw';
import clamping321 from '../../docs/images/clamping-321.svg?raw';
import viseSetup from '../../docs/images/vise-setup.svg?raw';
import workOffset from '../../docs/images/work-offset.svg?raw';
import thermalError from '../../docs/images/thermal-error.svg?raw';
import stabilityLobe from '../../docs/images/stability-lobe.svg?raw';
import chipForms from '../../docs/images/chip-forms.svg?raw';
import toolWearTypes from '../../docs/images/tool-wear-types.svg?raw';
import toolLifeCurve from '../../docs/images/tool-life-curve.svg?raw';
import surfaceRoughness from '../../docs/images/surface-roughness.svg?raw';
import cutterComp from '../../docs/images/cutter-comp.svg?raw';
import programStructure from '../../docs/images/program-structure.svg?raw';
import maintenanceCycle from '../../docs/images/maintenance-cycle.svg?raw';
import safetyHazards from '../../docs/images/safety-hazards.svg?raw';
import machinability from '../../docs/images/machinability.svg?raw';
import toolholders from '../../docs/images/toolholders.svg?raw';
import holeProcess from '../../docs/images/hole-process.svg?raw';
import preparationFlow from '../../docs/images/preparation-flow.svg?raw';
import overhangDeflection from '../../docs/images/overhang-deflection.svg?raw';
import insertGeometry from '../../docs/images/insert-geometry.svg?raw';
import datumAndTolerance from '../../docs/images/datum-and-tolerance.svg?raw';
import toolpathStrategies from '../../docs/images/toolpath-strategies.svg?raw';

/**
 * 初期データに添付する解説図（SVG）。docs/images/ の図版をそのまま使う。
 * 画像本体は起動時に imageStore へ投入される（App.tsx の ensureSeedImages）。
 */
export interface SeedImage {
  name: string;
  caption: string;
  svg: string;
}

function img(name: string, caption: string, svg: string): SeedImage {
  return { name, caption, svg: svg.trim() };
}

export const SEED_IMAGES: Record<string, SeedImage> = {
  'seed-img-mc-structure': img('mc-structure.svg', '立形マシニングセンタの基本構造。主軸が Z、テーブルが X・Y に動く 3 軸構成', mcStructure),
  'seed-img-mc-types': img('mc-types.svg', '立形・横形・5 軸の得意分野と注意点', mcTypes),
  'seed-img-cutting-parameters': img('cutting-parameters.svg', '切削条件の基本要素 Vc・n・fz・Vf・ap・ae と基本式', cuttingParameters),
  'seed-img-endmill-parts': img('endmill-parts.svg', 'エンドミル各部の名称と、刃数・心厚・先端形状の使い分け', endmillParts),
  'seed-img-climb': img('climb-vs-conventional.svg', 'ダウンカット（順削り）とアップカット（逆削り）の違い', climbVsConventional),
  'seed-img-chip-thinning': img('chip-thinning.svg', 'ae が小さいときの切りくず薄化と fz の補正式', chipThinning),
  'seed-img-clamping-321': img('clamping-321.svg', '3-2-1 原則による位置決めと、クランプ位置の良い例・悪い例', clamping321),
  'seed-img-vise': img('vise-setup.svg', 'マシンバイスの正しい使い方。パラレルの密着とくわえ代', viseSetup),
  'seed-img-work-offset': img('work-offset.svg', '機械座標系とワーク座標系（G54）、原点出しの手順と失敗例', workOffset),
  'seed-img-thermal': img('thermal-error.svg', '加工誤差の要因マップ。熱変位が最大要因', thermalError),
  'seed-img-stability': img('stability-lobe.svg', '安定限界線図（スタビリティローブ）と回転数の選び方', stabilityLobe),
  'seed-img-chip-forms': img('chip-forms.svg', '切りくずの形と色から加工状態を読む', chipForms),
  'seed-img-wear-types': img('tool-wear-types.svg', '工具損傷 6 種類の見た目・原因・対策', toolWearTypes),
  'seed-img-tool-life': img('tool-life-curve.svg', '摩耗の進行曲線と交換基準、テイラーの寿命方程式', toolLifeCurve),
  'seed-img-roughness': img('surface-roughness.svg', '送りマークとスカラップの理論粗さの式', surfaceRoughness),
  'seed-img-cutter-comp': img('cutter-comp.svg', '工具径補正 G41/G42 と工具長補正 G43 の考え方と事故の定番', cutterComp),
  'seed-img-program': img('program-structure.svg', 'NC プログラムの基本構造（初期設定〜終了）', programStructure),
  'seed-img-maintenance': img('maintenance-cycle.svg', '毎日・毎月・年次の保守点検サイクルと異常の兆候', maintenanceCycle),
  'seed-img-safety': img('safety-hazards.svg', 'マシニングセンタ作業の主な危険源と対策', safetyHazards),
  'seed-img-machinability': img('machinability.svg', '代表的な材料の被削性と超硬エンドミル切削速度の目安', machinability),
  'seed-img-toolholders': img('toolholders.svg', 'ツールホルダの種類と振れ精度・把持力・用途', toolholders),
  'seed-img-hole': img('hole-process.svg', '穴加工の工程設計（センタ→ドリル→面取り→仕上げ）', holeProcess),
  'seed-img-prep': img('preparation-flow.svg', '図面受領から初品確認までの準備フロー', preparationFlow),
  'seed-img-overhang': img('overhang-deflection.svg', '突き出し長と工具のたわみ。L の 3 乗、D の 4 乗で効く', overhangDeflection),
  'seed-img-insert': img('insert-geometry.svg', '刃先形状の要素：すくい角・逃げ角・ホーニング・ノーズ R', insertGeometry),
  'seed-img-datum': img('datum-and-tolerance.svg', '図面のデータムと加工基準を一致させる工程の組み方', datumAndTolerance),
  'seed-img-toolpath': img('toolpath-strategies.svg', 'CAM の代表的な加工パス戦略（輪郭・トロコイド・ヘリカル・3D）', toolpathStrategies),
};

export function seedImageRefs(...ids: string[]): KnowHowImage[] {
  return ids.map((id) => {
    const image = SEED_IMAGES[id];
    if (!image) throw new Error(`unknown seed image: ${id}`);
    return { id, name: image.name, caption: image.caption };
  });
}

export function seedImageBlob(id: string): Blob | null {
  const image = SEED_IMAGES[id];
  return image ? new Blob([image.svg], { type: 'image/svg+xml' }) : null;
}

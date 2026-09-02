# 付録 D 用語集

| 用語 | 英語 | 意味 |
|---|---|---|
| マシニングセンタ（MC） | Machining Center | ATC を備えた NC フライス盤。立形（VMC）、横形（HMC）、5 軸 |
| ATC | Automatic Tool Changer | 自動工具交換装置 |
| APC | Automatic Pallet Changer | 自動パレット交換装置 |
| NC / CNC | Numerical Control | 数値制御。CNC はコンピュータ数値制御 |
| CAM | Computer Aided Manufacturing | 3D モデルから工具経路（NC データ）を作るソフト |
| ポストプロセッサ | Post Processor | CAM の経路を特定の機械の G コードに変換する |
| G コード | G-code | 準備機能。G00, G01, G02 など |
| M コード | M-code | 補助機能。M03, M06, M08 など |
| ワーク座標系 | Work Coordinate System | G54〜G59。ワーク原点を基準にした座標 |
| 機械座標系 | Machine Coordinate System | 機械原点を基準にした座標。G53 |
| 工具長補正 | Tool Length Offset | G43 H。工具ごとの長さの違いを補正 |
| 工具径補正 | Cutter Radius Compensation | G41/G42 D。工具半径分のオフセット |
| 固定サイクル | Canned Cycle | G81〜G89 の穴加工サイクル |
| リジッドタップ | Rigid Tapping | 主軸回転と送りを同期させるタップ加工 |
| Vc（切削速度） | Cutting Speed | 刃先の周速 [m/min] |
| fz（1 刃送り） | Feed per Tooth | 1 枚の刃が 1 回で進む距離 [mm/刃] |
| Vf（送り速度） | Feed Rate | テーブルの送り速度 [mm/min] |
| ap（軸方向切込み） | Axial Depth of Cut | 深さ方向の切込み |
| ae（径方向切込み） | Radial Depth of Cut | 幅方向の切込み |
| 切りくず薄化 | Chip Thinning | ae が小さいときに実切りくず厚さが薄くなる現象 |
| ダウンカット／アップカット | Climb / Conventional Milling | 順削り／逆削り |
| トロコイド加工 | Trochoidal Milling | 小さな ae で円弧状に進む高能率荒加工 |
| 高能率加工（HEM） | High Efficiency Milling | 低 ae・大 ap・高送りの荒加工 |
| ヘリカル補間 | Helical Interpolation | らせん状に進む補間。穴・ねじ加工 |
| ランプ進入 | Ramping | 斜めに切込んで進入 |
| ピックフィード | Pick Feed / Stepover | 3D 仕上げの隣接パスの間隔 |
| スカラップ（カスプ） | Scallop / Cusp | ボールエンドミルの削り残しの山 |
| びびり | Chatter | 加工中の自励振動 |
| 安定限界線図 | Stability Lobe Diagram | 回転数と切込みの安定／不安定を示す図 |
| 構成刃先 | Built-Up Edge (BUE) | 刃先に被削材が溶着したもの |
| 逃げ面摩耗 | Flank Wear (VB) | 逃げ面の摩耗幅 |
| クレータ摩耗 | Crater Wear | すくい面のえぐれ |
| チッピング | Chipping | 刃先の微小欠け |
| 熱亀裂 | Thermal Crack | 急熱急冷によるひび |
| 境界摩耗（ノッチ） | Notch Wear | 切込み境界の V 字摩耗 |
| すくい角 | Rake Angle | すくい面の傾き。ポジ（＋）／ネガ（−） |
| 逃げ角 | Clearance Angle | 逃げ面の傾き |
| ホーニング | Edge Honing | 刃先の微小 R・面取り |
| ノーズ R | Nose Radius | 刃先コーナの丸み |
| ねじれ角 | Helix Angle | エンドミルの刃のねじれ |
| 心厚 | Core Diameter | エンドミルの芯の太さ |
| 不等分割 | Variable Pitch | 刃の間隔を不均等にした工具 |
| 超硬 | Cemented Carbide | WC-Co の焼結合金 |
| ハイス | High Speed Steel (HSS) | 高速度工具鋼 |
| サーメット | Cermet | TiC/TiCN 系の焼結材 |
| CBN | Cubic Boron Nitride | 立方晶窒化ほう素。焼入れ鋼用 |
| PCD | Polycrystalline Diamond | 多結晶ダイヤモンド。非鉄用 |
| TiAlN | | 窒化チタンアルミ。耐熱コーティングの主力 |
| DLC | Diamond-Like Carbon | 低摩擦コーティング。アルミ用 |
| BT / BBT / HSK | | 主軸テーパ規格。BBT・HSK は 2 面拘束 |
| 焼きばめホルダ | Shrink Fit Holder | 加熱して工具を挿入するホルダ |
| ハイドロチャック | Hydraulic Chuck | 油圧で把持するホルダ |
| コレット | Collet | 割りスリーブで工具を把持 |
| プリセッタ | Tool Presetter | 機外で工具長・径を測る装置 |
| ツールセッタ | Tool Setter | 機上で工具長・折損を測る装置 |
| タッチプローブ | Touch Probe | 機上でワークを計測するセンサ |
| 3-2-1 原則 | 3-2-1 Locating Principle | 6 自由度を 3+2+1 点で拘束する位置決め |
| データム | Datum | 図面上の基準 |
| 幾何公差 | Geometric Tolerance | 平面度・位置度・直角度など |
| 普通公差 | General Tolerance | 指示のない寸法に適用する公差（JIS B 0405） |
| H7 | | 穴の寸法公差等級（はめあい） |
| Ra / Rz | | 算術平均粗さ／最大高さ |
| バックラッシュ | Backlash | 送りねじの反転時のガタ |
| ロストモーション | Lost Motion | 反転時の実際の動き遅れ（バックラッシュ＋弾性） |
| 象限突起 | Quadrant Glitch | 円弧の軸反転点に出る段差 |
| 熱変位 | Thermal Displacement | 温度変化による機械・ワークの寸法変化 |
| 暖機運転 | Warm-up | 精度安定のための空運転 |
| ボールバー | Ballbar | 円弧精度を測る測定器 |
| 真直度／直角度／平面度 | Straightness / Squareness / Flatness | 機械・ワークの幾何精度 |
| 取り代 | Machining Allowance / Stock | 素材から削る量 |
| くわえ代 | Gripping Allowance | クランプに使う部分の量 |
| 捨て代（タブ） | Tab / Sacrificial Stock | 固定のために残し、最後に切り離す部分 |
| ゼロカット | Spring Pass | 同じ経路をもう一度通してたわみ分を除去 |
| 6 面出し | Squaring a Block | 直方体の 6 面を直角・平行に仕上げること |
| 段取り | Setup | 治具・工具・原点の準備 |
| 外段取り | External Setup | 機械停止中でなく稼働中に行う準備 |
| ゼロポイントシステム | Zero Point Clamping | 治具を数秒で高精度に交換する機構 |
| エマルション | Emulsion | 水溶性切削油（乳化タイプ） |
| MQL | Minimum Quantity Lubrication | 微量潤滑（セミドライ） |
| スルースピンドル | Through Spindle Coolant | 主軸中心からの給油 |
| 屈折計 | Refractometer | クーラント濃度計 |
| ミルシート | Mill Sheet / Certificate | 材料の成分・特性証明 |
| 調質 | Quenched and Tempered | 焼入れ焼戻し |
| プリハードン鋼 | Pre-hardened Steel | 調質済みで納入される金型鋼（NAK80 等） |
| 加工硬化 | Work Hardening | 塑性変形で硬くなる現象。SUS で顕著 |
| 被削性 | Machinability | 削りやすさ |
| 難削材 | Difficult-to-cut Material | SUS・Ti・Ni 合金・焼入れ鋼など |
| 5S | | 整理・整頓・清掃・清潔・躾 |
| ヒヤリハット | Near Miss | 災害に至らなかった危険事象 |
| インターロック | Interlock | ドア開放時に運転を止める安全装置 |

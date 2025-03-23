[![License: CC BY 4.0](https://img.shields.io/badge/License-CC--BY--4.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

# このデータセットについて
このリポジトリは、方言文法データセット **LAJaR (Linguistic Atlas of Japanese and Ryukyuan)** です。日琉諸語の文法情報を構造化データとして提供します。

基本的なデータ構造は、The World Atlas of Language Structures Online (WALS: https://wals.info/) のものを踏襲していますが、LAJaR独自の項目も含んでいます。

# ライセンス
- **データ（例: JSON, CSVファイル）**: [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/)
    - ご自由に使用・改変・再配布いただけますが、**出典の明記**をお願いします。
- **ソースコード（スクリプトなどが含まれる場合）**: [MIT License](LICENSE)
    - MIT ライセンスでは、**著作権表示を残す限り、自由に使用・改変・再配布が可能**ですが、利用による影響については作者は責任を負いません。
## 引用方法

このデータセットを利用する場合は、以下の情報を引用してください：

- 加藤幹治, 宮川創, 北本朝展, 中川奈津子, 田窪行則, 高田智和（2025-）LAJaR: Linguistic Atlas of Japanese and Ryukyuan. https://github.com/KATOKanji-0131/lajar-dataset.

```bibtex
@misc{lajar2025,
  author       = {加藤, 幹治 and 宮川, 創 and 北本, 朝展 and 中川, 奈津子 and 田窪, 行則 and 高田, 智和},
  title        = {LAJaR: Linguistic Atlas of Japanese and Ryukyuan},
  year         = {2025},
  howpublished = {\url{https://github.com/yourusername/lajar-dataset}},
  note         = {CC BY 4.0},
  URL          = {https://github.com/KATOKanji-0131/lajar-dataset}
}
```
- Kato, Kanji, So Miyagawa, Asanobu Kitamoto, Natsuko Nakagawa, Yukinori Takubo, Tomokazu Takada (2025-) LAJaR: Linguistic Atlas of Japanese and Ryukyuan. https://github.com/KATOKanji-0131/lajar-dataset.
```bibtex
@misc{lajar2025,
  author       = {Kato, Kanji and Miyagawa, So and Kitamoto, Asanobu and Nakagawa, Natsuko and Takubo, Yukinori and Takada, Tomokazu},
  title        = {LAJaR: Linguistic Atlas of Japanese and Ryukyuan},
  year         = {2025},
  howpublished = {\url{https://github.com/yourusername/lajar-dataset}},
  note         = {CC BY 4.0},
  URL          = {https://github.com/KATOKanji-0131/lajar-dataset}
}
```

# 各ファイルの説明
## `/lajar_demo`
LAJaRのデータをブラウザ上の地図で確認できます。
デモバージョンは、https://lajar.netlify.app/ で公開しています。

### `lajar_data.json`
Webアプリ（`lajar_demo`）で使用される地域言語データを含むJSON形式のデータセットです。  
各地点ごとに、文法特徴に関する情報をまとめています。

#### 構造概要
- `dropdownContents`: 表示可能なパラメータ（文法現象や言語特徴）の一覧です。`parameter.csv`のIDと対応しています。  
  Webアプリ上では、このリストがセレクトメニューに使用されます。

- `locations`: 各言語・方言のエントリ。以下の情報を含みます：
  - `name`: 方言の名称
  - `contributor`: 担当者名のリスト
  - `latitude`, `longitude`: 地点の緯度・経度
  - `info`: `dropdownContents` に対応する各項目の値と出典情報のリスト
    - `value`: 数値・分類名などのデータ
    - `source`: 情報の出典（文献名など）。未入力の場合は "no data" と記載されます。

#### 例

```json
{
  "name": "奄美語徳之島面縄方言",
  "contributor": ["加藤幹治"],
  "latitude": 27.67,
  "longitude": 128.96,
  "info": [
    { "value": 17, "source": "Kato(2022)" },
    { "value": "SOV", "source": "no data" },
    ...
  ]
}
```
## `/data`
### `value.csv`
#### データ構造
1行に全ての地点の1つの文法特徴が、1列に1地点の全ての文法特徴が収められています。1列目から4列目はラベルで、実際の値は5列目以降です。
- `pk`: 内部ID
- `parameter_id`: `parameter.csv`の`id`と対応。
- `description-en`: `parameter.csv`の`description-en`と対応。
- `description-jp`: `parameter.csv`の`description-jp`と対応。

### `parameter.csv`
`parameter.csv`は、文法特徴のパラメータ覧を示しています。
- `pk`: 内部ID
- `id`: パラメータID。WALSのものをそのまま使っていますが、"-J" とついている項目はLAJaR独自の項目です。
- `description-en`: 英語での説明
- `description-jp`: 日本語での説明

### `contributor.csv`
`contributor.csv`は、収録されているデータを提供または分析した担当者を示しています。
#### 各フィールドの記述
- `pk`: 内部ID
- `name-jp`: 名前（日本語）
- `name-en`: 名前（英語）
- `url`: Researchmap等の外部リンク
- `contact`: 連絡先

### `language.csv`
`language.csv`は、収録されている言語の概要を示しています。

⚠️**言語名ラベル、緯度、経度、エリア区分はデータ処理のために便宜的に入力したもので、当データセットが学術的な正確性を保証するものではありません。**
#### 各フィールドの記述
- `pk`: 内部ID
- `iso`: ISOコード
- `glottolog`: Glottologコード
- `name`: 言語名ラベル
- `latitude`: 緯度
- `longitude`: 経度
- `branch`: 語派（日本/琉球）
- `group`: 語群（例: 北琉球, 東日本）
- `complex`: 語群より小さい単位でのまとまり（例：肥筑方言）
- `language`: 言語
- `prefecture`: 都道府県
- `largearea`: 県の中の地方、群島、群島をなさない島のレベル（言語によって恣意的）
- `midarea`: 群島の中の島、合併前の町村程度のレベル（言語によって恣意的）
- `smallarea`: 字、集落のレベル

### `source.bib`
文法特徴を参照した文献の一覧です。BibTeX形式で書かれています。

# 連絡先
ご質問・バグ報告・共同研究のご相談などは以下までご連絡ください：
- 加藤幹治 [jiateng.ganzhi@gmail.com](mailto:jiateng.ganzhi@gmail.com)
- 宮川創 [runa.uei@gmail.com](mailto:runa.uei@gmail.com)

# 助成・資金
本データセットは以下の助成を受けて作成されました：

## データセット構築
- ROIS-DS JOINT 048RP2022「日琉諸語の言語類型アトラスLAJaRの開発と分析」
- ROIS-DS JOINT 035RP2023「日琉諸語の言語類型アトラスLAJaRの開発と分析」
- ROIS-DS JOINT 042RP2024「日琉諸語の言語類型アトラスLAJaRの開発と分析」

## フィールドデータ収集
- JSPS 科研費 [JP19J20370 北琉球徳之島伊仙方言の記述文法書作成](https://kaken.nii.ac.jp/grant/KAKENHI-PROJECT-19J20370/)（代表: 加藤幹治）
- JSPS 科研費 [JP22KJ2426 日本語諸方言における心情述語文の格標示に関する基礎的研究：述語の品詞に着目して](https://kaken.nii.ac.jp/grant/KAKENHI-PROJECT-22KJ2426)（代表: 松岡葵）
- JSPS 科研費 [JP23KJ1712「判断文・現象文」類型における特殊構文の再検討：方言バリエーションに着目して](https://kaken.nii.ac.jp/grant/KAKENHI-PROJECT-23KJ1712/)（代表: 廣澤尚之）
- JSPS 科研費 [JP23K18667「未記述の危機言語の地点集中的記録保存：沖縄語糸満方言の記述文法書作成」](https://kaken.nii.ac.jp/grant/KAKENHI-PROJECT-23K18667)（代表: 加藤幹治）
# CLAUDE.md — 爽籟公式サイト(sourai.net)リニューアル

このリポジトリは、物語音楽ボーカリスト「爽籟(Sourai)」の公式サイトです。
Claude.ai上で約30イテレーションかけてデザイン確定済み。**見た目の方向性は確定しているので、明示的な依頼がない限りデザインの再解釈はしないでください。** 文面調整・実データ反映・デプロイが残タスクです。

## プロジェクト概要

- ワンページ構成: Hero → About → Skills → Works(Latest / Pickup / Credits) → Recording → Commission(トグル) → Contact → Footer
- 世界観: **洋古書・アンティーク × 星空**。Sound Horizonのブックレットの文法(ローマン体・装飾罫・金の箔押し)がベース
- デザイントークン(style.css の `:root`):
  - 地: `--night #04060f` / 文字: `--ink` / 補助: `--sub` `--faint`
  - アクセント: `--gold #c9b37e`(装飾・見出し)、緑は廃止済み(AIっぽくなるため)
  - 書体: 見出しLatin = Cinzel **細字(400)・字間0.28em・金**(比較12案からユーザーが選んだ「B1」)、飾りイタリック = Cormorant Garamond、和文 = Shippori Mincho
- 禁止事項(過去に「AIっぽい・ダサい」と却下されたもの):
  - ガラスモーフィズムのカード、ピル型タグ、紫グロー多用、`✦ ✦ ✦` の飾り行
  - 緑のピル型ステータスバッジ(現在は金枠の角ラベル+金ダイヤ◆)
  - 完全中央揃えの等間隔ポスター構図(デスクトップHeroは左テキスト/右アバターの非対称)

## ホスティングとデプロイ(重要)

- **GitHub Pages + 独自ドメイン(sourai.net)で公開中。** リポジトリ: `souraiherbstwind/sourai-website`
- **`main` にマージ/pushすると自動デプロイされる。** 作業は必ずブランチを切って行い、公開してよい状態になってから main に入れる
- **リポジトリ直下の `CNAME` は独自ドメインの紐付けファイル。絶対に消さない**(消えるとサイトが落ちる)
- 同じく `robots.txt` / `sitemap.xml` / `favicon.svg` / `favicon-32x32.png` / `apple-touch-icon.png` はサイト一式に含まれないSEO・周辺資産。ファイル一括置き換えの際も必ず残すこと
- 旧サイトはgit履歴に残っている(`main` の 2025-12 時点のコミット)。旧文面が必要なら `git show b25b7de:index.html` で参照できる
- `feature/voice-samples` ブランチ(音声サンプル再生機能)は**著作権上の理由で破棄が決定済み**。マージしない

## ファイル構成

```
index.html            … 全マークアップ。文面編集はここ
CNAME                 … 独自ドメイン設定(触らない)
robots.txt            … クロール許可+sitemap参照
sitemap.xml           … URL1件のみ(ワンページサイトのため)
favicon.svg / favicon-32x32.png / apple-touch-icon.png … 旧サイトから継続使用
assets/css/style.css  … 全スタイル(約900行、セクションコメントあり)
assets/js/main.js     … 全スクリプト(vanilla JS、依存なし)
assets/images/bg-stars.jpg  … 背景星空(ユーザー提供写真)
assets/images/avatar.png    … アバター透過済(黒背景JPGから輝度≤22をフラッドフィル+囲まれ領域も除去して切り抜き。衣装の黒は輝度60+なので安全)
assets/video/glitter.mp4    … キラキラ素材(ユーザーのglitter04.mov ProResを1920/CRF23で圧縮。元素材は本人所有)
```

## 実装上の地雷(触る前に必読)

1. **キラキラ動画は `<video>` を直接表示していない。**
   Safariは`<video>`に`mix-blend-mode`が効かないため、非表示のvideoを毎フレーム`#glitter-canvas`へ`drawImage`し、canvas側でscreen合成している(main.js「キラキラ映像」ブロック)。videoを直接表示する形に「最適化」しないこと。
2. **canvasにCSS `filter` をかけない。** Safariで透明部分が白く濁るバグを踏む(過去に発生済み)。色調整は照明・素材側で。
3. **YouTube埋め込みは file:// で必ず「エラー153」になる。** リファラー無しをYouTubeが拒否する仕様。壊れていない。確認は `python3 -m http.server` 経由で行い、ユーザーにもそう案内すること。
4. **星座線(Credits)は `offsetLeft/offsetTop` 積み上げで座標計算している。** `getBoundingClientRect`に戻すと、`.reveal`のtransformアニメーション中の座標を拾って曲がり角が✦からズレる(過去に発生済み)。
5. **サムネ枠 `.thumb` は padding-top 方式のアスペクト比。** `aspect-ratio`に書き換えない(非対応WebViewで崩れた実績あり)。
6. **発光レイヤー(`.hero-figure img.glow`)にはマスクをかけない。** マスクはぼかしのにじみを要素境界で切り落とし、光が四角く見切れる(過去に発生済み)。
7. **`.plate` の枠線は疑似要素+radial-gradientマスクで上辺中央に「本物の切れ目」を開けている。** ✦の下に不透明の下地を敷く実装に戻さない(背景が写真なので四角く浮く)。
8. **`html`と`body`両方に `overflow-x:hidden`。** 光塵canvasが図の外まではみ出す設計のため、外すとiOSで横スクロールが発生する。
9. **`prefers-reduced-motion` 対応が全アニメーションに入っている。** 新しい動きを足すときも必ず対応すること。
10. モバイルHeroは `grid-template-rows: auto minmax(0,1fr)` +アバター`object-fit:contain / bottom center`で「残り高さを全部使う」設計。固定の高さ指定に戻すと機種によって隙間/はみ出しが出る。

## よく触る調整値

| 調整したいもの | 場所 |
|---|---|
| 発光の強さ | style.css `@keyframes glowWaveA / glowWaveB` の opacity |
| 光塵の量 | main.js `var COUNT = 44;` |
| 光塵の速さ・方向 | main.js `newMote()` の `rise` / `finalizeMote()` の drift 係数(右上流れ) |
| 星屑動画の速さ | main.js `glitter.playbackRate = 0.6;` |
| 受付ステータス | index.html の「ご依頼受付中」×2箇所 + style.css `.status .dot` の色 |

## 残タスク

- [ ] Credits年表のサンプル行(`サンプル`で検索、`▼サンプル`コメント区間)を実データに差し替え
- [ ] Commissionの料金・注記の文言確認(現状はClaude作の仮文言。¥5,000〜のみユーザー指定)
- [ ] `assets/images/ogp.jpg`(1200×630)を作成し、`og:image` / `twitter:image` を差し替え(現在は暫定で avatar.png を指定済み。壊れてはいない)
- [ ] (任意)favicon刷新: 現行の favicon.svg は旧デザインの青地「S」。新デザインに合わせるなら✦か金のSOURAIモノグラム
- [x] `<link rel="canonical">` … 追加済み
- [x] JSON-LD構造化データ(`Person`) … 旧サイトから移植済み(sameAs: YouTube/X)
- [x] meta description … 旧サイトの検索キーワード(VTuber・声優・物語音楽・多重コーラス・架空言語・ボイスドラマ)を統合済み

## 公開時の手順(デプロイはユーザー確認後)

1. 文面確定後、`feature/site-renewal` を main にマージ → GitHub Pagesが自動デプロイ
2. Search Consoleで「URL検査」→「インデックス登録をリクエスト」。sitemap.xml を再送信
3. X上で自分のURLをカード検証(OGP画像が出るか)、スマホ実機でLCP体感(avatar.pngが最大要素。重いと感じたら幅1090→800程度に再圧縮の余地あり)

## 開発メモ

- ローカル確認: `python3 -m http.server 8000`(必須。file://では動画・YouTube・fetch系が動かない)
- ビルド工程なし。素のHTML/CSS/JSのみ。フレームワーク・npm依存を導入しない方針
- VRM表示(three.js + @pixiv/three-vrm)のプロトタイプは過去に試作して**保留**にした経緯あり(動画の質感=ライティング+Final Cutグレーディング込みのため、VRM単体では届かないという結論)。再開する場合はClaude.aiの会話履歴参照

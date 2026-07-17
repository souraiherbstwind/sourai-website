# 爽籟 公式サイト リニューアル版

## 構成
```
index.html            … 本体(文面の編集はここ)
assets/
  css/style.css       … デザイン(色・余白・アニメーション)
  js/main.js          … 動き(星屑・光塵・星座線・メニューなど)
  images/bg-stars.jpg … 背景の星空写真
  images/avatar.png   … アバター(透過済み)
  video/glitter.mp4   … キラキラのオーバーレイ動画
```

## ローカルでの確認
file:// で直接開くと動画・YouTube埋め込みが動かないので、必ずローカルサーバー経由で:
```bash
cd sourai_site
python3 -m http.server 8000
# → http://localhost:8000
```

## 編集ポイント(index.html内を検索)
- 「サンプル」          … 実績年表のダミー行。実データに差し替え or 行ごと削除
- 「Commission」        … 料金・納品形式の文言(現状は仮文言)
- 「ご依頼受付中」      … 受付停止にする場合は文言を変更し、
                          style.css内の .status .dot の background を var(--faint) に
- OGP                   … assets/images/ogp.jpg (1200x630) を用意すると
                          X等でシェアされたときのカードが有効に

## よく触りそうな調整値
- 発光の強さ    … style.css の @keyframes glowWaveA / glowWaveB の opacity
- 光塵の量      … main.js の `var COUNT = 44;`
- 光塵の速さ    … main.js の newMote() 内 rise
- 星屑動画の速さ … main.js の `glitter.playbackRate = 0.6;`
- ステータス色  … style.css の .status まわり

## デプロイ
フォルダ構成を保ったまま、サーバーの公開ディレクトリにアップロードするだけです。
既存サイトの assets パスと重複しないよう、一度まっさらにしてから上げるのが安全です。

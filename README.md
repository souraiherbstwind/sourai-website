# 爽籟（そうらい） - Sourai

物語音楽系VTuberボーカリスト・声優「爽籟（そうらい）」の公式ポートフォリオサイト

## 🎵 概要

Sound Horizonなどの物語音楽のカバーを中心に活動するVTuberボーカリスト・声優のポートフォリオサイトです。

### 主な特徴
- レスポンシブデザイン（モバイル・タブレット・デスクトップ対応）
- SEO対策済み（OGPタグ、構造化データ）
- シンプルなHTML/CSS/JavaScript構成
- GitHub Pages でホスティング可能

## 🚀 デプロイ方法

### GitHub Pages へのデプロイ

1. GitHubでリポジトリを作成
2. ローカルリポジトリをプッシュ
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

3. GitHubリポジトリの Settings → Pages で以下を設定:
   - Source: Deploy from a branch
   - Branch: main / (root)
   - Save

4. 数分後、`https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/` でアクセス可能になります

### カスタムドメインの設定（オプション）

1. DNS設定でドメインをGitHub Pagesに向ける
2. GitHubリポジトリの Settings → Pages → Custom domain に独自ドメインを入力
3. `sitemap.xml` と `index.html` 内のURLを独自ドメインに更新

## 📁 ディレクトリ構成

```
sourai-website/
├── index.html              # メインHTMLファイル
├── assets/
│   ├── css/
│   │   └── style.css      # スタイルシート
│   ├── js/
│   │   └── main.js        # JavaScript
│   └── images/
│       └── avatar.png     # アバター画像
├── sitemap.xml            # サイトマップ
├── robots.txt             # robots.txt
├── favicon.ico            # ファビコン（要追加）
├── .gitignore
├── handoff-prompt.md      # プロジェクト引継ぎドキュメント
└── README.md
```

## ✏️ カスタマイズ

### 必須の変更項目

デプロイ前に以下を更新してください：

1. **メタタグのURL** ([index.html](index.html)):
   - `https://sourai.github.io/` を実際のURLに変更

2. **サイトマップのURL** ([sitemap.xml](sitemap.xml)):
   - すべてのURLを実際のドメインに変更

3. **連絡先メールアドレス** ([index.html](index.html)):
   - `contact@example.com` を実際のメールアドレスに変更

4. **SNSリンク** ([index.html](index.html)):
   - Twitter、Twitch、Spotifyのリンクを実際のURLに変更

5. **作品情報** ([index.html](index.html)):
   - Works セクションに実際の作品情報を追加

6. **機材情報** ([index.html](index.html)):
   - Recording セクションに実際の機材名を記載

### オプションの変更項目

- **カラーパレット**: [assets/css/style.css](assets/css/style.css) の `:root` セクション
- **フォント**: Google Fonts の設定を変更
- **アニメーション**: CSS の `@keyframes` セクション

## 🔧 今後の拡張

将来的に以下のフレームワークへの移行も可能です：

- **Astro**: 静的サイトジェネレーター（マークダウンでコンテンツ管理）
- **Gatsby**: React ベースの静的サイトジェネレーター

ブログや作品ページを頻繁に追加する場合は、これらのフレームワークへの移行を検討してください。

## 📝 TODO

- [ ] faviconの作成と追加
- [ ] 実際のメールアドレスに変更
- [ ] SNSリンクを実際のURLに変更
- [ ] 作品情報の追加
- [ ] 機材情報の記載
- [ ] OGP画像の最適化
- [ ] Google Analytics の設定（オプション）
- [ ] カスタムドメインの設定（オプション）

## 📄 ライセンス

© 2024 Sourai. All rights reserved.

## 🎨 デザインコンセプト

- **テーマ**: ファンタジー絵本・物語音楽の世界観
- **カラー**: アンバー/オレンジ、ダスティブルー、クリーム、チャコール
- **フォント**: Playfair Display（見出し）、Noto Sans JP（本文）、Cormorant Garamond（アクセント）

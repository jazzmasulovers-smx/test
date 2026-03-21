# English Learning App

日々の英語学習をサポートするNext.jsアプリケーション

## 機能

- **リスニングモード** - AIが生成した英文を音声で聴き、テキスト入力で回答
- **英作文モード** - 日本語の文を英語に翻訳。ヒント機能付き
- **日本語会話モード** - 日本語で会話し、終了時に全文を英語に翻訳＆音声再生

## シチュエーション

- ビジネス英会話（アパレル企業・会計/財務/IT部門）
- 恋愛
- 家族・友達
- 日常英会話

## セットアップ

```bash
npm install
cp .env.example .env.local
# .env.local にANTHROPIC_API_KEYを設定
npm run dev
```

## 技術スタック

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Claude API (Anthropic)
- Web Speech API (音声合成)

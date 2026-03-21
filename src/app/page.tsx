export default function Home() {
  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">English Learning</h1>
        <p style={{ color: "var(--text-secondary)" }} className="text-lg">
          日々の英語学習をサポートするアプリ
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a href="/listening" className="card hover:border-blue-500 transition-colors block">
          <div className="text-3xl mb-4">🎧</div>
          <h2 className="text-xl font-bold mb-2">リスニングモード</h2>
          <p style={{ color: "var(--text-secondary)" }} className="text-sm">
            AIが生成した英文を音声で聴き、テキストで入力。正確に聞き取れるか挑戦しよう。
          </p>
        </a>

        <a href="/composition" className="card hover:border-blue-500 transition-colors block">
          <div className="text-3xl mb-4">✍️</div>
          <h2 className="text-xl font-bold mb-2">英作文モード</h2>
          <p style={{ color: "var(--text-secondary)" }} className="text-sm">
            日本語の文を英語に翻訳。瞬間的な英作文力を鍛えよう。ヒント機能付き。
          </p>
        </a>

        <a href="/conversation" className="card hover:border-blue-500 transition-colors block">
          <div className="text-3xl mb-4">💬</div>
          <h2 className="text-xl font-bold mb-2">日本語会話モード</h2>
          <p style={{ color: "var(--text-secondary)" }} className="text-sm">
            日本語で会話し、終了時に全てを英語テキスト＆音声で確認。
          </p>
        </a>
      </div>

      <div className="mt-12 card">
        <h3 className="font-bold mb-3">シチュエーション</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center p-3 rounded-lg" style={{ background: "var(--bg-primary)" }}>
            <div className="text-2xl mb-1">💼</div>
            <div className="text-sm">ビジネス</div>
          </div>
          <div className="text-center p-3 rounded-lg" style={{ background: "var(--bg-primary)" }}>
            <div className="text-2xl mb-1">❤️</div>
            <div className="text-sm">恋愛</div>
          </div>
          <div className="text-center p-3 rounded-lg" style={{ background: "var(--bg-primary)" }}>
            <div className="text-2xl mb-1">👨‍👩‍👧‍👦</div>
            <div className="text-sm">家族・友達</div>
          </div>
          <div className="text-center p-3 rounded-lg" style={{ background: "var(--bg-primary)" }}>
            <div className="text-2xl mb-1">☀️</div>
            <div className="text-sm">日常英会話</div>
          </div>
        </div>
      </div>
    </div>
  );
}

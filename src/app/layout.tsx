import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "English Learning App",
  description: "日々の英語学習をサポートするアプリ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <div className="min-h-screen">
          <header
            style={{
              borderBottom: "1px solid var(--border)",
              padding: "16px 24px",
            }}
          >
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <a href="/" className="text-xl font-bold" style={{ color: "var(--accent)" }}>
                English Learning
              </a>
              <nav className="flex gap-4">
                <a href="/listening" className="text-sm hover:underline" style={{ color: "var(--text-secondary)" }}>
                  Listening
                </a>
                <a href="/composition" className="text-sm hover:underline" style={{ color: "var(--text-secondary)" }}>
                  英作文
                </a>
                <a href="/conversation" className="text-sm hover:underline" style={{ color: "var(--text-secondary)" }}>
                  会話
                </a>
              </nav>
            </div>
          </header>
          <main className="max-w-4xl mx-auto p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}

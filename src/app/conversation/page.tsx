"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import SituationSelector from "@/components/SituationSelector";
import SpeakButton from "@/components/SpeakButton";
import { speakEnglish } from "@/lib/speech";
import {
  conversationSystemPrompt,
  conversationTranslatePrompt,
} from "@/lib/prompts";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Translation = {
  role: string;
  japanese: string;
  english: string;
};

export default function ConversationPage() {
  const [situation, setSituation] = useState("business");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [started, setStarted] = useState(false);
  const [translations, setTranslations] = useState<Translation[] | null>(null);
  const [translating, setTranslating] = useState(false);
  const [speakingAll, setSpeakingAll] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startConversation = useCallback(async () => {
    setMessages([]);
    setTranslations(null);
    setSending(true);
    setStarted(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "conversation",
          systemPrompt: conversationSystemPrompt(situation),
          messages: [{ role: "user", content: "会話を始めてください。" }],
        }),
      });
      const data = await res.json();
      const text = data.text || data.content || JSON.stringify(data);
      setMessages([{ role: "assistant", content: typeof text === "string" ? text : JSON.stringify(text) }]);
    } catch (err) {
      console.error("Failed to start conversation:", err);
    } finally {
      setSending(false);
    }
  }, [situation]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "conversation",
          systemPrompt: conversationSystemPrompt(situation),
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });
      const data = await res.json();
      const text = data.text || data.content || JSON.stringify(data);
      setMessages([
        ...newMessages,
        { role: "assistant", content: typeof text === "string" ? text : JSON.stringify(text) },
      ]);
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
    }
  };

  const handleEnd = async () => {
    if (messages.length === 0) return;
    setTranslating(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "translate",
          prompt: conversationTranslatePrompt(
            messages.map((m) => ({ role: m.role, content: m.content }))
          ),
        }),
      });
      const data = await res.json();
      if (data.translations) {
        setTranslations(data.translations);
      }
    } catch (err) {
      console.error("Failed to translate:", err);
    } finally {
      setTranslating(false);
    }
  };

  const speakAllTranslations = () => {
    if (!translations) return;
    setSpeakingAll(true);

    const allEnglish = translations.map((t) => t.english).join(". . . ");
    speakEnglish(allEnglish, () => setSpeakingAll(false));
  };

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-2">💬 日本語会話モード</h1>
      <p style={{ color: "var(--text-secondary)" }} className="mb-6">
        日本語で会話し、終了時に英語で確認
      </p>

      <SituationSelector
        selected={situation}
        onSelect={(id) => {
          setSituation(id);
          setStarted(false);
          setMessages([]);
          setTranslations(null);
        }}
      />

      {!started ? (
        <div className="card text-center py-12">
          <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
            選択したシチュエーションでAIと日本語で会話します。
            <br />
            終了すると、会話全体が英語に翻訳されます。
          </p>
          <button className="btn-primary" onClick={startConversation}>
            会話を開始する
          </button>
        </div>
      ) : !translations ? (
        <>
          <div
            className="card mb-4"
            style={{ minHeight: "400px", maxHeight: "500px", overflowY: "auto" }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex mb-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`message-bubble ${
                    msg.role === "user" ? "message-user" : "message-ai"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start mb-3">
                <div className="message-bubble message-ai loading-dots">入力中</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} className="flex gap-3 mb-4">
            <input
              type="text"
              className="input-field flex-1"
              placeholder="日本語で入力..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={sending}
              autoFocus
            />
            <button type="submit" className="btn-primary" disabled={sending || !input.trim()}>
              送信
            </button>
          </form>

          <button
            className="btn-secondary"
            onClick={handleEnd}
            disabled={translating || messages.length === 0}
            style={{ borderColor: "var(--error)", color: "var(--error)" }}
          >
            {translating ? "翻訳中..." : "会話を終了して英語に翻訳"}
          </button>
        </>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">英語翻訳結果</h2>
            <button
              className="btn-primary"
              onClick={speakAllTranslations}
              disabled={speakingAll}
            >
              {speakingAll ? "再生中..." : "🔊 全文を再生"}
            </button>
          </div>

          <div className="space-y-4 mb-6">
            {translations.map((t, i) => (
              <div key={i} className="card">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{
                      background:
                        t.role === "user" ? "var(--accent)" : "var(--bg-primary)",
                      color: "white",
                    }}
                  >
                    {t.role === "user" ? "あなた" : "AI"}
                  </span>
                </div>
                <p className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                  {t.japanese}
                </p>
                <p className="text-lg flex items-center gap-2">
                  {t.english}
                  <SpeakButton text={t.english} />
                </p>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button className="btn-primary" onClick={startConversation}>
              もう一度会話する
            </button>
            <button
              className="btn-secondary"
              onClick={() => {
                setStarted(false);
                setMessages([]);
                setTranslations(null);
              }}
            >
              トップに戻る
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import SituationSelector from "@/components/SituationSelector";
import SpeakButton from "@/components/SpeakButton";
import {
  compositionPrompt,
  compositionJudgePrompt,
  compositionHintPrompt,
} from "@/lib/prompts";

type Question = {
  japanese: string;
  english: string;
  key_vocabulary: string[];
};

type Feedback = {
  correct: boolean;
  feedback: string;
  correction: string;
  score: number;
};

type Hint = {
  hint: string;
  vocabulary: { word: string; meaning: string }[];
};

export default function CompositionPage() {
  const [situation, setSituation] = useState("business");
  const [question, setQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [hint, setHint] = useState<Hint | null>(null);
  const [loading, setLoading] = useState(false);
  const [judging, setJudging] = useState(false);
  const [hintLoading, setHintLoading] = useState(false);

  const generateQuestion = useCallback(async () => {
    setLoading(true);
    setFeedback(null);
    setHint(null);
    setUserAnswer("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate",
          prompt: compositionPrompt(situation),
        }),
      });
      const data = await res.json();
      if (data.japanese) {
        setQuestion(data);
      }
    } catch (err) {
      console.error("Failed to generate question:", err);
    } finally {
      setLoading(false);
    }
  }, [situation]);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || !userAnswer.trim()) return;

    setJudging(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "judge",
          prompt: compositionJudgePrompt(
            question.japanese,
            question.english,
            userAnswer
          ),
        }),
      });
      const data = await res.json();
      setFeedback(data);
    } catch (err) {
      console.error("Failed to judge:", err);
    } finally {
      setJudging(false);
    }
  };

  const handleHint = async () => {
    if (!question) return;
    setHintLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "hint",
          prompt: compositionHintPrompt(question.japanese, question.english),
        }),
      });
      const data = await res.json();
      setHint(data);
    } catch (err) {
      console.error("Failed to get hint:", err);
    } finally {
      setHintLoading(false);
    }
  };

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-2">✍️ 英作文モード</h1>
      <p style={{ color: "var(--text-secondary)" }} className="mb-6">
        日本語の文を英語に翻訳してください
      </p>

      <SituationSelector selected={situation} onSelect={setSituation} />

      <div className="card mb-6">
        {loading ? (
          <div className="text-center py-8">
            <p style={{ color: "var(--text-secondary)" }} className="loading-dots">
              問題を生成中
            </p>
          </div>
        ) : question ? (
          <>
            <div className="mb-4">
              <p className="text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
                以下の日本語を英語にしてください:
              </p>
              <p className="text-xl font-bold">{question.japanese}</p>
            </div>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                className="input-field mb-4"
                placeholder="英語で入力..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                disabled={judging || !!feedback}
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={judging || !userAnswer.trim() || !!feedback}
                >
                  {judging ? "判定中..." : "回答する"}
                </button>
                {!feedback && !hint && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleHint}
                    disabled={hintLoading}
                  >
                    {hintLoading ? "ヒント取得中..." : "💡 ヒント"}
                  </button>
                )}
              </div>
            </form>
          </>
        ) : null}
      </div>

      {hint && (
        <div
          className="card mb-6"
          style={{ borderColor: "var(--warning)", background: "rgba(245, 158, 11, 0.05)" }}
        >
          <p className="font-bold mb-2" style={{ color: "var(--warning)" }}>
            💡 ヒント
          </p>
          <p className="mb-3">{hint.hint}</p>
          {hint.vocabulary && hint.vocabulary.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                キーワード:
              </p>
              <div className="flex flex-wrap gap-2">
                {hint.vocabulary.map((v, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-sm"
                    style={{ background: "var(--bg-primary)", border: "1px solid var(--border)" }}
                  >
                    <strong>{v.word}</strong> - {v.meaning}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {feedback && (
        <div className={feedback.correct ? "feedback-correct mb-6" : "feedback-incorrect mb-6"}>
          <div className="flex items-center justify-between mb-2">
            <p
              className="font-bold"
              style={{ color: feedback.correct ? "var(--success)" : "var(--error)" }}
            >
              {feedback.correct ? "✅ 正解！" : "❌ 不正解"}
            </p>
            {feedback.score !== undefined && (
              <span
                className="text-sm px-2 py-1 rounded"
                style={{ background: "var(--bg-primary)" }}
              >
                スコア: {feedback.score}/100
              </span>
            )}
          </div>
          <p className="mb-3">{feedback.feedback}</p>
          {feedback.correction && (
            <div className="mt-2">
              <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                正解:
              </p>
              <p className="text-lg flex items-center gap-2">
                {feedback.correction}
                <SpeakButton text={feedback.correction} />
              </p>
            </div>
          )}
          {question && (
            <div className="mt-3">
              <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                模範解答:
              </p>
              <p className="text-lg flex items-center gap-2">
                {question.english}
                <SpeakButton text={question.english} />
              </p>
            </div>
          )}
        </div>
      )}

      <button className="btn-primary" onClick={generateQuestion} disabled={loading}>
        次の問題へ
      </button>
    </div>
  );
}

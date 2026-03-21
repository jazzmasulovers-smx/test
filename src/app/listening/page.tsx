"use client";

import { useState, useEffect, useCallback } from "react";
import SituationSelector from "@/components/SituationSelector";
import SpeakButton from "@/components/SpeakButton";
import { speakEnglish } from "@/lib/speech";
import { listeningPrompt, listeningJudgePrompt } from "@/lib/prompts";

type Question = {
  english: string;
  japanese: string;
};

type Feedback = {
  correct: boolean;
  feedback: string;
  correction: string;
};

export default function ListeningPage() {
  const [situation, setSituation] = useState("business");
  const [question, setQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [judging, setJudging] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const generateQuestion = useCallback(async () => {
    setLoading(true);
    setFeedback(null);
    setUserAnswer("");
    setShowAnswer(false);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate",
          prompt: listeningPrompt(situation),
        }),
      });
      const data = await res.json();
      if (data.english) {
        setQuestion(data);
        setTimeout(() => {
          speakEnglish(data.english);
        }, 500);
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
          prompt: listeningJudgePrompt(question.english, userAnswer),
        }),
      });
      const data = await res.json();
      setFeedback(data);
      setShowAnswer(true);
    } catch (err) {
      console.error("Failed to judge:", err);
    } finally {
      setJudging(false);
    }
  };

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-2">🎧 リスニングモード</h1>
      <p style={{ color: "var(--text-secondary)" }} className="mb-6">
        英語の音声を聴いて、テキストで入力してください
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
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                音声を聴く:
              </span>
              <SpeakButton text={question.english} />
              <button
                className="speaker-btn"
                onClick={() => speakEnglish(question.english)}
                title="もう一度再生"
              >
                🔄
              </button>
            </div>

            <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
              💡 日本語訳: {question.japanese}
            </p>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                className="input-field mb-4"
                placeholder="聴こえた英文を入力..."
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
                {!feedback && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowAnswer(true)}
                  >
                    答えを見る
                  </button>
                )}
              </div>
            </form>
          </>
        ) : null}
      </div>

      {showAnswer && question && !feedback && (
        <div className="card mb-6" style={{ borderColor: "var(--warning)" }}>
          <p className="font-bold mb-2" style={{ color: "var(--warning)" }}>
            正解:
          </p>
          <p className="text-lg flex items-center gap-2">
            {question.english}
            <SpeakButton text={question.english} />
          </p>
        </div>
      )}

      {feedback && (
        <div className={feedback.correct ? "feedback-correct mb-6" : "feedback-incorrect mb-6"}>
          <p className="font-bold mb-2" style={{ color: feedback.correct ? "var(--success)" : "var(--error)" }}>
            {feedback.correct ? "✅ 正解！" : "❌ 不正解"}
          </p>
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
          {feedback.correct && question && (
            <div className="mt-2">
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

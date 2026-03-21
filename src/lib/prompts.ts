import { Situation, situations } from "./situations";

function getSituationContext(situationId: string): string {
  const sit = situations.find((s) => s.id === situationId);
  if (!sit) return "";
  return sit.description;
}

function getStyleGuide(situationId: string): string {
  if (situationId === "business") {
    return "Use relatively formal, professional English appropriate for a corporate environment. Include industry-specific terminology (apparel, accounting, IT).";
  }
  return "Use natural, broken/casual American English that native speakers actually use in everyday conversation. Include contractions, slang, and colloquial expressions.";
}

export function listeningPrompt(situationId: string): string {
  const context = getSituationContext(situationId);
  const style = getStyleGuide(situationId);
  return `You are an English learning assistant. Generate a natural English sentence for a listening exercise.

Situation: ${context}
Style: ${style}
Language: American English.

Generate exactly ONE natural English sentence (not too long, 8-20 words). Also provide the Japanese translation.

Respond in JSON format:
{"english": "the english sentence", "japanese": "日本語訳"}`;
}

export function listeningJudgePrompt(
  original: string,
  userAnswer: string
): string {
  return `You are an English learning assistant. Judge the user's answer for a listening exercise.

The original English sentence was: "${original}"
The user typed: "${userAnswer}"

Compare them. Minor typos or punctuation differences are acceptable. The meaning and key words must match.

Respond in JSON format:
{
  "correct": true/false,
  "feedback": "Detailed feedback in Japanese explaining what was correct or incorrect",
  "correction": "The correct sentence if the user was wrong, or empty string if correct"
}`;
}

export function compositionPrompt(situationId: string): string {
  const context = getSituationContext(situationId);
  const style = getStyleGuide(situationId);
  return `You are an English learning assistant. Generate a Japanese sentence for the user to translate into English.

Situation: ${context}
Style: ${style}
Language: The target English should be American English.

Generate exactly ONE Japanese sentence that the user should translate to English. Also provide the ideal English translation.

Respond in JSON format:
{"japanese": "日本語の文", "english": "ideal English translation", "key_vocabulary": ["important word 1", "important word 2"]}`;
}

export function compositionJudgePrompt(
  japanese: string,
  idealEnglish: string,
  userAnswer: string
): string {
  return `You are an English learning assistant. Judge the user's English translation.

Original Japanese: "${japanese}"
Ideal English: "${idealEnglish}"
User's answer: "${userAnswer}"

The user's answer doesn't need to be identical to the ideal translation, but it must convey the same meaning correctly in natural English.

Respond in JSON format:
{
  "correct": true/false,
  "feedback": "Detailed feedback in Japanese. If incorrect, explain specifically what was wrong and why. If correct but could be improved, suggest alternatives.",
  "correction": "A correct translation if the user was wrong, or empty string if correct",
  "score": 0-100
}`;
}

export function compositionHintPrompt(
  japanese: string,
  idealEnglish: string
): string {
  return `You are an English learning assistant. Provide a hint for translating this Japanese sentence to English.

Japanese: "${japanese}"
(The answer is: "${idealEnglish}" - but do NOT reveal the full answer)

Give a helpful hint in Japanese. Include some key vocabulary words and their meanings, grammar structure hints, but do not give away the complete answer.

Respond in JSON format:
{"hint": "ヒントの内容", "vocabulary": [{"word": "english word", "meaning": "日本語の意味"}]}`;
}

export function conversationSystemPrompt(situationId: string): string {
  const context = getSituationContext(situationId);
  return `あなたは日本語での会話練習パートナーです。以下のシチュエーションで自然な日本語で会話してください。

シチュエーション: ${context}

ルール:
- 日本語のみで会話してください
- シチュエーションに合った自然な会話をしてください
- 1回のレスポンスは1〜3文程度にしてください
- 会話が自然に続くようにしてください

最初の一言を言ってください。`;
}

export function conversationTranslatePrompt(
  messages: { role: string; content: string }[]
): string {
  const conversation = messages
    .map((m) => `${m.role === "user" ? "ユーザー" : "AI"}: ${m.content}`)
    .join("\n");

  return `以下の日本語の会話を全て自然なアメリカ英語に翻訳してください。カジュアルでネイティブらしい表現を使ってください。

会話:
${conversation}

Respond in JSON format:
{
  "translations": [
    {"role": "user" or "ai", "japanese": "元の日本語", "english": "English translation"}
  ]
}`;
}

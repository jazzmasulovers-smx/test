"use client";

let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speakEnglish(
  text: string,
  onEnd?: () => void
): SpeechSynthesisUtterance | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.9;
  utterance.pitch = 1;

  const voices = window.speechSynthesis.getVoices();
  const usVoice = voices.find(
    (v) =>
      v.lang === "en-US" &&
      (v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Alex"))
  );
  if (usVoice) {
    utterance.voice = usVoice;
  }

  if (onEnd) {
    utterance.onend = onEnd;
  }

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
  return utterance;
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  currentUtterance = null;
}

export function isSpeaking(): boolean {
  if (typeof window === "undefined") return false;
  return window.speechSynthesis.speaking;
}

"use client";

import { useState } from "react";
import { speakEnglish, stopSpeaking } from "@/lib/speech";

type Props = {
  text: string;
};

export default function SpeakButton({ text }: Props) {
  const [speaking, setSpeaking] = useState(false);

  const handleClick = () => {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
    } else {
      setSpeaking(true);
      speakEnglish(text, () => setSpeaking(false));
    }
  };

  return (
    <button
      className={`speaker-btn ${speaking ? "speaking" : ""}`}
      onClick={handleClick}
      title={speaking ? "停止" : "再生"}
    >
      {speaking ? "⏸" : "🔊"}
    </button>
  );
}

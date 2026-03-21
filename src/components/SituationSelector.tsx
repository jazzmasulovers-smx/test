"use client";

import { situations } from "@/lib/situations";

type Props = {
  selected: string;
  onSelect: (id: string) => void;
};

export default function SituationSelector({ selected, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {situations.map((sit) => (
        <button
          key={sit.id}
          className={`situation-chip ${selected === sit.id ? "active" : ""}`}
          onClick={() => onSelect(sit.id)}
        >
          {sit.label}
        </button>
      ))}
    </div>
  );
}

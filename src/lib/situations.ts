export type Situation = {
  id: string;
  label: string;
  description: string;
};

export const situations: Situation[] = [
  {
    id: "business",
    label: "ビジネス",
    description:
      "グローバルアパレル企業での会計・財務・IT部門の業務会話。自部署、他部署（営業・総務等）、外部（監査法人・開発ベンダー等）との会話。アパレル用語・会計用語・専門用語を含む比較的フォーマルな表現。",
  },
  {
    id: "romance",
    label: "恋愛",
    description:
      "マッチングアプリで初対面の女性との会話、恋人との会話、女性を口説く会話。ネイティブが使うブロークンで自然な表現。",
  },
  {
    id: "family_friends",
    label: "家族・友達",
    description:
      "家族や友達との他愛もない日常会話。ネイティブが使うブロークンで自然な表現。",
  },
  {
    id: "daily",
    label: "日常英会話",
    description:
      "おはようからおやすみまでよく使われる日常表現。ネイティブが使うブロークンで自然な表現。",
  },
];

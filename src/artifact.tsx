import { useState, useRef, useEffect, useCallback } from "react";

// ===== データ =====
const sentences = {
  business: {
    listening: [
      { english: "We need to reconcile the accounts before the quarterly close.", japanese: "四半期決算前に勘定を照合する必要があります。" },
      { english: "The auditors flagged a discrepancy in our inventory valuation.", japanese: "監査法人が棚卸資産の評価に差異を指摘しました。" },
      { english: "Can you walk me through the variance analysis for this quarter?", japanese: "今四半期の差異分析を説明していただけますか？" },
      { english: "We're rolling out a new ERP system across all departments next month.", japanese: "来月全部署に新しいERPシステムを導入します。" },
      { english: "The vendor proposed a phased migration to the cloud infrastructure.", japanese: "ベンダーがクラウドインフラへの段階的移行を提案しました。" },
      { english: "Let's schedule a meeting with the general affairs team about the budget allocation.", japanese: "予算配分について総務チームとの会議を設定しましょう。" },
      { english: "Our gross margin improved by two percentage points this season.", japanese: "今シーズンの粗利率が2ポイント改善しました。" },
      { english: "The sales team requested an extension on the payment terms for the wholesale order.", japanese: "営業チームが卸売注文の支払条件延長を要請しました。" },
      { english: "We need to consolidate the financial statements from all subsidiaries.", japanese: "全子会社の財務諸表を連結する必要があります。" },
      { english: "The IT team is conducting a security audit on our payment processing system.", japanese: "IT部門が決済処理システムのセキュリティ監査を実施中です。" },
    ],
    composition: [
      { japanese: "来期の売上予測を更新してください。", english: "Please update the sales forecast for the next fiscal period.", hints: ["売上予測=sales forecast", "来期=next fiscal period"] },
      { japanese: "この取引の仕訳を確認していただけますか？", english: "Could you review the journal entry for this transaction?", hints: ["仕訳=journal entry", "取引=transaction"] },
      { japanese: "在庫回転率が前年比で低下しています。", english: "The inventory turnover rate has declined compared to last year.", hints: ["在庫回転率=inventory turnover rate", "前年比=compared to last year"] },
      { japanese: "開発ベンダーとの契約更新について相談があります。", english: "I'd like to discuss the contract renewal with our development vendor.", hints: ["契約更新=contract renewal", "開発ベンダー=development vendor"] },
      { japanese: "今月の買掛金の残高を教えてください。", english: "Could you tell me the accounts payable balance for this month?", hints: ["買掛金=accounts payable", "残高=balance"] },
      { japanese: "新しいコレクションの原価率が目標を超えています。", english: "The cost ratio of the new collection exceeds the target.", hints: ["原価率=cost ratio", "コレクション=collection"] },
      { japanese: "内部統制の評価レポートを来週までに提出してください。", english: "Please submit the internal control assessment report by next week.", hints: ["内部統制=internal control", "評価=assessment"] },
      { japanese: "システム移行のダウンタイムを最小限に抑える計画を立てましょう。", english: "Let's plan to minimize downtime during the system migration.", hints: ["ダウンタイム=downtime", "システム移行=system migration"] },
    ],
  },
  romance: {
    listening: [
      { english: "So what kinda stuff are you into?", japanese: "で、どんなことに興味あるの？" },
      { english: "You've got such a great smile, it's honestly contagious.", japanese: "すごくいい笑顔だね、ほんと伝染するよ。" },
      { english: "Wanna grab coffee sometime? I know this cute little spot.", japanese: "今度コーヒーでもどう？いい感じの場所知ってるんだ。" },
      { english: "I had such a good time tonight, I don't want it to end.", japanese: "今夜すごく楽しかった、終わってほしくないな。" },
      { english: "I can't stop thinking about you, it's kinda crazy.", japanese: "君のこと考えるのが止まらないんだ、ちょっとヤバいよね。" },
      { english: "You're so easy to talk to, I feel like I've known you forever.", japanese: "すごく話しやすいよね、ずっと前から知ってた気がする。" },
      { english: "I'm not really looking for anything serious, just seeing where things go.", japanese: "真剣なのは求めてなくて、成り行きに任せたいかな。" },
      { english: "That dress looks amazing on you, just saying.", japanese: "そのドレスすごく似合ってるよ、ただ言いたかっただけ。" },
    ],
    composition: [
      { japanese: "週末何してたの？", english: "What were you up to this weekend?", hints: ["up to=～してた", "weekend"] },
      { japanese: "次いつ会える？すごく楽しみ。", english: "When can I see you next? I'm really looking forward to it.", hints: ["see you next", "looking forward to"] },
      { japanese: "君といると時間があっという間だね。", english: "Time just flies when I'm with you.", hints: ["time flies=時間が経つのが早い", "with you"] },
      { japanese: "趣味とか何かある？", english: "Do you have any hobbies or anything?", hints: ["hobbies=趣味", "or anything"] },
      { japanese: "もっと君のことを知りたいな。", english: "I wanna get to know you better.", hints: ["wanna=want to", "get to know"] },
      { japanese: "今度一緒に映画でも観ない？", english: "Wanna catch a movie together sometime?", hints: ["catch a movie=映画を観る", "sometime"] },
    ],
  },
  family_friends: {
    listening: [
      { english: "Mom, what's for dinner? I'm starving.", japanese: "ママ、夕飯なに？お腹ペコペコ。" },
      { english: "Dude, you gotta check out this new ramen place.", japanese: "おい、この新しいラーメン屋マジで行ってみろって。" },
      { english: "Can you pick up some milk on your way home?", japanese: "帰りに牛乳買ってきてくれない？" },
      { english: "I'm so beat, I just wanna crash on the couch.", japanese: "めっちゃ疲れた、ソファでゴロゴロしたい。" },
      { english: "Hey, are you free this Saturday? Let's hang out.", japanese: "ねぇ、今週の土曜空いてる？遊ぼうよ。" },
      { english: "My kid's got a soccer game this weekend, you should come watch.", japanese: "今週末うちの子のサッカーの試合あるんだけど、観に来なよ。" },
      { english: "No way! That's hilarious, tell me more.", japanese: "マジで！ウケる、もっと教えて。" },
      { english: "I totally forgot about that, my bad.", japanese: "完全に忘れてた、ごめんごめん。" },
    ],
    composition: [
      { japanese: "昨日の夜何してた？電話したんだけど。", english: "What were you doing last night? I tried calling you.", hints: ["tried calling=電話した", "last night"] },
      { japanese: "来週バーベキューやるんだけど来ない？", english: "We're having a barbecue next week, wanna come?", hints: ["having a barbecue", "wanna come=来ない？"] },
      { japanese: "最近仕事忙しすぎてマジでしんどい。", english: "Work's been crazy busy lately, I'm so done.", hints: ["crazy busy=忙しすぎ", "I'm so done=しんどい"] },
      { japanese: "あの映画観た？めっちゃ面白かったよ。", english: "Did you watch that movie? It was so good.", hints: ["that movie", "so good=めっちゃ面白い"] },
      { japanese: "今日早く帰れるから夕飯作るよ。", english: "I can get home early today so I'll make dinner.", hints: ["get home early", "make dinner"] },
      { japanese: "久しぶり！元気だった？", english: "Long time no see! How've you been?", hints: ["Long time no see=久しぶり", "How've you been=元気だった？"] },
    ],
  },
  daily: {
    listening: [
      { english: "I'm gonna grab a quick shower before we head out.", japanese: "出かける前にサッとシャワー浴びるね。" },
      { english: "Could you pass me the remote? I wanna change the channel.", japanese: "リモコン取ってくれる？チャンネル変えたい。" },
      { english: "I'm running a bit late, go ahead without me.", japanese: "ちょっと遅れそう、先に行ってて。" },
      { english: "Do you want me to set an alarm for tomorrow morning?", japanese: "明日の朝アラームセットしようか？" },
      { english: "I think I'm coming down with something, my throat's killing me.", japanese: "風邪ひきそう、喉がめっちゃ痛い。" },
      { english: "Let me sleep in just five more minutes, please.", japanese: "あと5分だけ寝かせて、お願い。" },
      { english: "I'm just gonna swing by the store real quick.", japanese: "ちょっとだけお店に寄ってくるね。" },
      { english: "Man, the weather's so nice today, we should go for a walk.", japanese: "いい天気だね、散歩行こうよ。" },
    ],
    composition: [
      { japanese: "今日はもう寝るね、おやすみ。", english: "I'm gonna hit the sack, good night.", hints: ["hit the sack=寝る", "good night"] },
      { japanese: "朝ごはん何食べたい？", english: "What do you want for breakfast?", hints: ["want for breakfast"] },
      { japanese: "鍵どこに置いたか覚えてる？", english: "Do you remember where you put the keys?", hints: ["remember where", "put the keys"] },
      { japanese: "エアコンつけてもいい？暑すぎる。", english: "Mind if I turn on the AC? It's way too hot.", hints: ["Mind if I=～してもいい？", "AC=エアコン", "way too=～すぎる"] },
      { japanese: "ゴミ出すの忘れないでね。", english: "Don't forget to take out the trash.", hints: ["take out the trash=ゴミを出す", "Don't forget"] },
      { japanese: "充電器貸してくれない？バッテリー切れそう。", english: "Can I borrow your charger? My battery's about to die.", hints: ["borrow=借りる", "about to die=切れそう"] },
    ],
  },
};

const conversationStarters = {
  business: [
    { userStart: "来期の予算について相談したいのですが。", aiResponses: ["はい、もちろんです。来期の予算について、何か具体的な懸念点はありますか？前期比でどの程度の変動を見込んでいますか？"] },
    { userStart: "新しいシステムの導入スケジュールを確認させてください。", aiResponses: ["承知しました。現在の計画では、第一フェーズのテスト環境構築が来月から始まる予定です。何か変更点がありましたか？"] },
    { userStart: "監査法人から指摘事項が届きました。", aiResponses: ["そうですか。どのような指摘がありましたか？早急に対応が必要な項目はありますか？"] },
  ],
  romance: [
    { userStart: "プロフィール見て気になったんだけど、よかったら話しませんか？", aiResponses: ["ありがとう！嬉しい。何が気になったの？私もあなたのプロフィール見てたんだよね。"] },
    { userStart: "今度の週末、もし良かったら会わない？", aiResponses: ["いいね！どこか行きたいところとかある？カフェとか好きだけど。"] },
    { userStart: "昨日のデート楽しかったね！", aiResponses: ["うん、すごく楽しかった！特にあのレストラン最高だったね。また行きたいな。"] },
  ],
  family_friends: [
    { userStart: "今週末暇？どっか遊び行かない？", aiResponses: ["おー、いいね！何する？最近新しくできたショッピングモール気になってたんだよね。"] },
    { userStart: "聞いてよ、今日すごいことあったんだけど。", aiResponses: ["え、何何？めっちゃ気になる！教えて！"] },
    { userStart: "最近どう？全然連絡してなかったね。", aiResponses: ["ほんとだよね！まあぼちぼちかな。仕事がバタバタしてたんだよね。そっちは？"] },
  ],
  daily: [
    { userStart: "おはよう、今日の予定どうする？", aiResponses: ["おはよう。午前中は買い物行きたいんだけど、午後は特に予定ないよ。何かしたいことある？"] },
    { userStart: "ただいま〜、疲れた。", aiResponses: ["おかえり。お疲れ様。今日大変だったの？ご飯もうすぐできるよ。"] },
    { userStart: "ねぇ、今日の晩ご飯何がいい？", aiResponses: ["うーん、今日寒いからお鍋とかどう？冷蔵庫に白菜あったよね？"] },
  ],
};

// 会話の追加応答パターン
const followUpResponses: Record<string, string[]> = {
  business: [
    "なるほど、その点については確認が必要ですね。関連する資料を準備しましょうか？",
    "承知しました。では、関係部署にも共有しておきますね。",
    "それは重要なポイントですね。次の会議で議題に上げましょう。",
    "了解です。スケジュールを調整して、改めてご連絡します。",
    "その件については、まず現状の数値を確認してからお話しした方がいいかもしれません。",
  ],
  romance: [
    "へぇ、そうなんだ！もっと聞きたいな。",
    "わかるわかる、私もそう思う！",
    "えー、それめっちゃいいじゃん！",
    "ふふ、面白いね。あなたって話してて楽しいね。",
    "そっか。なんかすごく素敵だと思う。",
  ],
  family_friends: [
    "マジで？やばいじゃん！",
    "あー、わかるわかる、それあるよね。",
    "え、それでどうなったの？",
    "いいね！じゃあそうしよう！",
    "うんうん、まあそういうこともあるよね。",
  ],
  daily: [
    "あ、そうだ、それ思い出した。ありがとう。",
    "うん、それでいいんじゃない？",
    "了解、じゃあそうしよう。",
    "あー、そうだよね。じゃあ準備しようか。",
    "OK、わかった！",
  ],
};

// 会話翻訳データ
const translationMap: Record<string, string> = {
  "来期の予算について相談したいのですが。": "I'd like to discuss the budget for the next fiscal year.",
  "はい、もちろんです。来期の予算について、何か具体的な懸念点はありますか？前期比でどの程度の変動を見込んでいますか？": "Yes, of course. Do you have any specific concerns about the next fiscal year's budget? How much variance are you expecting compared to last period?",
  "新しいシステムの導入スケジュールを確認させてください。": "Let me confirm the implementation schedule for the new system.",
  "承知しました。現在の計画では、第一フェーズのテスト環境構築が来月から始まる予定です。何か変更点がありましたか？": "Understood. According to the current plan, the first phase of building the test environment is scheduled to start next month. Have there been any changes?",
  "監査法人から指摘事項が届きました。": "We've received audit findings from the accounting firm.",
  "そうですか。どのような指摘がありましたか？早急に対応が必要な項目はありますか？": "I see. What kind of findings were there? Are there any items that require immediate attention?",
  "プロフィール見て気になったんだけど、よかったら話しませんか？": "I checked out your profile and thought you were interesting. Wanna chat?",
  "ありがとう！嬉しい。何が気になったの？私もあなたのプロフィール見てたんだよね。": "Thanks! That makes me happy. What caught your eye? I was actually looking at your profile too.",
  "今度の週末、もし良かったら会わない？": "Hey, if you're free this weekend, wanna meet up?",
  "いいね！どこか行きたいところとかある？カフェとか好きだけど。": "Sounds great! Anywhere you wanna go? I'm into cafes and stuff.",
  "昨日のデート楽しかったね！": "Last night's date was so much fun!",
  "うん、すごく楽しかった！特にあのレストラン最高だったね。また行きたいな。": "Yeah, it was amazing! That restaurant was the best. We should totally go again.",
  "今週末暇？どっか遊び行かない？": "You free this weekend? Wanna go hang out somewhere?",
  "おー、いいね！何する？最近新しくできたショッピングモール気になってたんだよね。": "Oh nice! What should we do? I've been meaning to check out that new shopping mall.",
  "聞いてよ、今日すごいことあったんだけど。": "Dude, listen to this. Something crazy happened today.",
  "え、何何？めっちゃ気になる！教えて！": "What?! Tell me! I'm dying to know!",
  "最近どう？全然連絡してなかったね。": "How's it going? We haven't talked in forever.",
  "ほんとだよね！まあぼちぼちかな。仕事がバタバタしてたんだよね。そっちは？": "I know right! I've been okay I guess. Work's been super hectic. How about you?",
  "おはよう、今日の予定どうする？": "Morning! What's the plan for today?",
  "おはよう。午前中は買い物行きたいんだけど、午後は特に予定ないよ。何かしたいことある？": "Morning. I wanna go shopping in the morning, but I'm free in the afternoon. Anything you wanna do?",
  "ただいま〜、疲れた。": "I'm home. So tired.",
  "おかえり。お疲れ様。今日大変だったの？ご飯もうすぐできるよ。": "Welcome back. You look beat. Rough day? Dinner's almost ready.",
  "ねぇ、今日の晩ご飯何がいい？": "Hey, what do you want for dinner tonight?",
  "うーん、今日寒いからお鍋とかどう？冷蔵庫に白菜あったよね？": "Hmm, it's cold today so how about hot pot? We've got napa cabbage in the fridge, right?",
  "なるほど、その点については確認が必要ですね。関連する資料を準備しましょうか？": "I see, we'll need to verify that point. Shall I prepare the relevant documents?",
  "承知しました。では、関係部署にも共有しておきますね。": "Understood. I'll share this with the relevant departments as well.",
  "それは重要なポイントですね。次の会議で議題に上げましょう。": "That's an important point. Let's put it on the agenda for the next meeting.",
  "了解です。スケジュールを調整して、改めてご連絡します。": "Got it. I'll adjust the schedule and get back to you.",
  "その件については、まず現状の数値を確認してからお話しした方がいいかもしれません。": "For that matter, it might be better to review the current figures before we discuss further.",
  "へぇ、そうなんだ！もっと聞きたいな。": "Oh really? Tell me more, I wanna hear about it.",
  "わかるわかる、私もそう思う！": "I totally get that, I feel the same way!",
  "えー、それめっちゃいいじゃん！": "Oh wow, that's awesome!",
  "ふふ、面白いね。あなたって話してて楽しいね。": "Haha, that's funny. You're so fun to talk to.",
  "そっか。なんかすごく素敵だと思う。": "I see. I think that's really wonderful.",
  "マジで？やばいじゃん！": "For real? That's insane!",
  "あー、わかるわかる、それあるよね。": "Oh yeah, totally, that happens all the time.",
  "え、それでどうなったの？": "Wait, so what happened next?",
  "いいね！じゃあそうしよう！": "Sounds good! Let's do that!",
  "うんうん、まあそういうこともあるよね。": "Yeah yeah, I mean, that kinda stuff happens.",
  "あ、そうだ、それ思い出した。ありがとう。": "Oh right, that reminds me. Thanks.",
  "うん、それでいいんじゃない？": "Yeah, that sounds fine to me.",
  "了解、じゃあそうしよう。": "Got it, let's go with that then.",
  "あー、そうだよね。じゃあ準備しようか。": "Oh right. Shall we get ready then?",
  "OK、わかった！": "OK, got it!",
};

// ===== 音声ユーティリティ（女性ボイス） =====
function speakFemale(text: string, onEnd?: () => void) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = 0.9;
  u.pitch = 1.1;
  const voices = window.speechSynthesis.getVoices();
  const femaleVoice = voices.find(
    (v) =>
      v.lang.startsWith("en") &&
      (v.name.includes("Female") ||
        v.name.includes("Samantha") ||
        v.name.includes("Victoria") ||
        v.name.includes("Karen") ||
        v.name.includes("Moira") ||
        v.name.includes("Fiona") ||
        v.name.includes("Google US English"))
  ) || voices.find((v) => v.lang.startsWith("en-US"));
  if (femaleVoice) u.voice = femaleVoice;
  if (onEnd) u.onend = onEnd;
  window.speechSynthesis.speak(u);
}

// ===== 判定ロジック =====
function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
}

function judge(correct: string, answer: string): { pass: boolean; score: number } {
  const a = normalize(correct);
  const b = normalize(answer);
  if (a === b) return { pass: true, score: 100 };
  const aWords = a.split(" ");
  const bWords = b.split(" ");
  const matched = aWords.filter((w) => bWords.includes(w)).length;
  const score = Math.round((matched / Math.max(aWords.length, 1)) * 100);
  return { pass: score >= 75, score };
}

// ===== ランダムピック =====
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ===== タイプ =====
type Mode = "home" | "listening" | "composition" | "conversation";
type Sit = "business" | "romance" | "family_friends" | "daily";
type ConvMsg = { role: "user" | "ai"; content: string };

// ===== メインコンポーネント =====
export default function EnglishLearningApp() {
  const [mode, setMode] = useState<Mode>("home");
  const [sit, setSit] = useState<Sit>("business");

  // Listening state
  const [lQ, setLQ] = useState<{ english: string; japanese: string } | null>(null);
  const [lAns, setLAns] = useState("");
  const [lResult, setLResult] = useState<{ pass: boolean; score: number } | null>(null);
  const [lShowAnswer, setLShowAnswer] = useState(false);

  // Composition state
  const [cQ, setCQ] = useState<{ japanese: string; english: string; hints: string[] } | null>(null);
  const [cAns, setCAns] = useState("");
  const [cResult, setCResult] = useState<{ pass: boolean; score: number } | null>(null);
  const [cShowHint, setCShowHint] = useState(false);

  // Conversation state
  const [convMsgs, setConvMsgs] = useState<ConvMsg[]>([]);
  const [convInput, setConvInput] = useState("");
  const [convDone, setConvDone] = useState(false);
  const [convResponseIdx, setConvResponseIdx] = useState(0);
  const convEndRef = useRef<HTMLDivElement>(null);

  // 音声初期化
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => { window.speechSynthesis.getVoices(); };
    }
  }, []);

  useEffect(() => {
    convEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [convMsgs]);

  // リスニング新問題
  const newListening = useCallback(() => {
    const pool = sentences[sit]?.listening;
    if (!pool) return;
    setLQ(pick(pool));
    setLAns("");
    setLResult(null);
    setLShowAnswer(false);
  }, [sit]);

  // 英作文新問題
  const newComposition = useCallback(() => {
    const pool = sentences[sit]?.composition;
    if (!pool) return;
    setCQ(pick(pool));
    setCAns("");
    setCResult(null);
    setCShowHint(false);
  }, [sit]);

  // 会話リセット
  const resetConv = useCallback(() => {
    setConvMsgs([]);
    setConvInput("");
    setConvDone(false);
    setConvResponseIdx(0);
  }, []);

  useEffect(() => { if (mode === "listening") newListening(); }, [mode, sit, newListening]);
  useEffect(() => { if (mode === "composition") newComposition(); }, [mode, sit, newComposition]);
  useEffect(() => { if (mode === "conversation") resetConv(); }, [mode, sit, resetConv]);

  const sitLabel: Record<Sit, string> = { business: "ビジネス", romance: "恋愛", family_friends: "家族・友達", daily: "日常英会話" };

  // ===== 共通UI部品 =====
  const SitPicker = () => (
    <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
      {(Object.keys(sitLabel) as Sit[]).map((s) => (
        <button key={s} onClick={() => setSit(s)} style={{
          padding: "8px 18px", borderRadius: 20, border: `1px solid ${sit === s ? "#3b82f6" : "#334155"}`,
          background: sit === s ? "rgba(59,130,246,0.15)" : "transparent",
          color: sit === s ? "#3b82f6" : "#94a3b8", cursor: "pointer", fontSize: 14,
        }}>{sitLabel[s]}</button>
      ))}
    </div>
  );

  const SpeakBtn = ({ text, label }: { text: string; label?: string }) => (
    <button onClick={() => speakFemale(text)} style={{
      background: "none", border: "none", cursor: "pointer", color: "#3b82f6", fontSize: 18, padding: "2px 6px",
    }} title="再生">{label || "🔊"}</button>
  );

  const Nav = () => (
    <div style={{
      borderBottom: "1px solid #334155", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <span onClick={() => setMode("home")} style={{ fontSize: 20, fontWeight: 700, color: "#3b82f6", cursor: "pointer" }}>English Learning</span>
      <div style={{ display: "flex", gap: 16 }}>
        <span onClick={() => setMode("listening")} style={{ cursor: "pointer", color: mode === "listening" ? "#3b82f6" : "#94a3b8", fontSize: 14 }}>Listening</span>
        <span onClick={() => setMode("composition")} style={{ cursor: "pointer", color: mode === "composition" ? "#3b82f6" : "#94a3b8", fontSize: 14 }}>英作文</span>
        <span onClick={() => setMode("conversation")} style={{ cursor: "pointer", color: mode === "conversation" ? "#3b82f6" : "#94a3b8", fontSize: 14 }}>会話</span>
      </div>
    </div>
  );

  const cardStyle: React.CSSProperties = { background: "#1e293b", border: "1px solid #334155", borderRadius: 12, padding: 24, marginBottom: 20 };
  const btnStyle: React.CSSProperties = { background: "#3b82f6", color: "#fff", padding: "10px 24px", borderRadius: 8, fontWeight: 600, border: "none", cursor: "pointer", fontSize: 15 };
  const btnSecStyle: React.CSSProperties = { ...btnStyle, background: "transparent", border: "1px solid #334155", color: "#f1f5f9" };
  const inputStyle: React.CSSProperties = { background: "#0f172a", border: "1px solid #334155", borderRadius: 8, padding: "12px 16px", color: "#f1f5f9", width: "100%", fontSize: 16, outline: "none", boxSizing: "border-box" };

  // ===== ページレンダリング =====

  // ホーム
  if (mode === "home") return (
    <div style={{ background: "#0f172a", color: "#f1f5f9", minHeight: "100vh", fontFamily: "system-ui, sans-serif" }}>
      <Nav />
      <div style={{ maxWidth: 700, margin: "0 auto", padding: 24 }}>
        <div style={{ textAlign: "center", margin: "40px 0" }}>
          <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 12 }}>English Learning</h1>
          <p style={{ color: "#94a3b8", fontSize: 18 }}>日々の英語学習をサポートするアプリ</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {([["listening", "🎧", "リスニングモード", "英語を聴いてテキストで入力"], ["composition", "✍️", "英作文モード", "日本語を英語に翻訳"], ["conversation", "💬", "日本語会話モード", "日本語で会話→英語に翻訳"]] as const).map(([m, icon, title, desc]) => (
            <div key={m} onClick={() => setMode(m)} style={{ ...cardStyle, cursor: "pointer", textAlign: "center" }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>{icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>{title}</h3>
              <p style={{ color: "#94a3b8", fontSize: 13 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // リスニング
  if (mode === "listening") return (
    <div style={{ background: "#0f172a", color: "#f1f5f9", minHeight: "100vh", fontFamily: "system-ui, sans-serif" }}>
      <Nav />
      <div style={{ maxWidth: 700, margin: "0 auto", padding: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>🎧 リスニングモード</h1>
        <p style={{ color: "#94a3b8", marginBottom: 20 }}>英語の音声を聴いて、テキストで入力してください</p>
        <SitPicker />
        {lQ && (
          <div style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ color: "#94a3b8", fontSize: 14 }}>音声を聴く:</span>
              <SpeakBtn text={lQ.english} />
              <button onClick={() => speakFemale(lQ.english)} style={{ background: "none", border: "none", cursor: "pointer", color: "#3b82f6", fontSize: 16 }}>🔄</button>
            </div>
            <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 16 }}>💡 日本語訳: {lQ.japanese}</p>
            <form onSubmit={(e) => { e.preventDefault(); if (!lAns.trim() || lResult) return; setLResult(judge(lQ.english, lAns)); setLShowAnswer(true); }}>
              <input style={inputStyle} placeholder="聴こえた英文を入力..." value={lAns} onChange={(e) => setLAns(e.target.value)} disabled={!!lResult} autoFocus />
              <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                <button type="submit" style={{ ...btnStyle, opacity: (!lAns.trim() || lResult) ? 0.5 : 1 }} disabled={!lAns.trim() || !!lResult}>回答する</button>
                {!lResult && <button type="button" style={btnSecStyle} onClick={() => setLShowAnswer(true)}>答えを見る</button>}
              </div>
            </form>
          </div>
        )}
        {lShowAnswer && !lResult && lQ && (
          <div style={{ ...cardStyle, borderColor: "#f59e0b" }}>
            <p style={{ color: "#f59e0b", fontWeight: 700, marginBottom: 8 }}>正解:</p>
            <p style={{ fontSize: 18, display: "flex", alignItems: "center", gap: 8 }}>{lQ.english} <SpeakBtn text={lQ.english} /></p>
          </div>
        )}
        {lResult && lQ && (
          <div style={{ ...cardStyle, borderColor: lResult.pass ? "#22c55e" : "#ef4444", background: lResult.pass ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)" }}>
            <p style={{ fontWeight: 700, color: lResult.pass ? "#22c55e" : "#ef4444", marginBottom: 8 }}>
              {lResult.pass ? "✅ 正解！" : "❌ 不正解"} (スコア: {lResult.score}/100)
            </p>
            <p style={{ marginBottom: 8 }}>あなたの回答: {lAns}</p>
            <p style={{ fontSize: 18, display: "flex", alignItems: "center", gap: 8 }}>正解: {lQ.english} <SpeakBtn text={lQ.english} /></p>
          </div>
        )}
        <button style={btnStyle} onClick={newListening}>次の問題へ</button>
      </div>
    </div>
  );

  // 英作文
  if (mode === "composition") return (
    <div style={{ background: "#0f172a", color: "#f1f5f9", minHeight: "100vh", fontFamily: "system-ui, sans-serif" }}>
      <Nav />
      <div style={{ maxWidth: 700, margin: "0 auto", padding: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>✍️ 英作文モード</h1>
        <p style={{ color: "#94a3b8", marginBottom: 20 }}>日本語の文を英語に翻訳してください</p>
        <SitPicker />
        {cQ && (
          <div style={cardStyle}>
            <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 4 }}>以下の日本語を英語にしてください:</p>
            <p style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>{cQ.japanese}</p>
            <form onSubmit={(e) => { e.preventDefault(); if (!cAns.trim() || cResult) return; setCResult(judge(cQ.english, cAns)); }}>
              <input style={inputStyle} placeholder="英語で入力..." value={cAns} onChange={(e) => setCAns(e.target.value)} disabled={!!cResult} autoFocus />
              <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                <button type="submit" style={{ ...btnStyle, opacity: (!cAns.trim() || cResult) ? 0.5 : 1 }} disabled={!cAns.trim() || !!cResult}>回答する</button>
                {!cResult && !cShowHint && <button type="button" style={btnSecStyle} onClick={() => setCShowHint(true)}>💡 ヒント</button>}
              </div>
            </form>
          </div>
        )}
        {cShowHint && cQ && !cResult && (
          <div style={{ ...cardStyle, borderColor: "#f59e0b", background: "rgba(245,158,11,0.05)" }}>
            <p style={{ color: "#f59e0b", fontWeight: 700, marginBottom: 8 }}>💡 ヒント</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {cQ.hints.map((h, i) => (
                <span key={i} style={{ padding: "4px 12px", borderRadius: 16, background: "#0f172a", border: "1px solid #334155", fontSize: 14 }}>{h}</span>
              ))}
            </div>
          </div>
        )}
        {cResult && cQ && (
          <div style={{ ...cardStyle, borderColor: cResult.pass ? "#22c55e" : "#ef4444", background: cResult.pass ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)" }}>
            <p style={{ fontWeight: 700, color: cResult.pass ? "#22c55e" : "#ef4444", marginBottom: 8 }}>
              {cResult.pass ? "✅ 正解！" : "❌ 不正解"} (スコア: {cResult.score}/100)
            </p>
            <p style={{ marginBottom: 8 }}>あなたの回答: {cAns}</p>
            <p style={{ fontSize: 18, display: "flex", alignItems: "center", gap: 8 }}>模範解答: {cQ.english} <SpeakBtn text={cQ.english} /></p>
          </div>
        )}
        <button style={btnStyle} onClick={newComposition}>次の問題へ</button>
      </div>
    </div>
  );

  // 会話モード
  if (mode === "conversation") {
    const translateMsg = (jp: string): string => translationMap[jp] || "I said: " + jp;

    const sendConvMsg = () => {
      if (!convInput.trim() || convDone) return;
      const userMsg: ConvMsg = { role: "user", content: convInput.trim() };
      const newMsgs = [...convMsgs, userMsg];

      // AI応答を決定
      let aiReply: string;
      if (newMsgs.length === 1) {
        // 最初のユーザーメッセージ → starterから応答を探す
        const starters = conversationStarters[sit];
        const matched = starters.find((s) => convInput.includes(s.userStart.slice(0, 5)));
        aiReply = matched ? pick(matched.aiResponses) : pick(starters).aiResponses[0];
      } else {
        const pool = followUpResponses[sit];
        aiReply = pool[convResponseIdx % pool.length];
        setConvResponseIdx((prev) => prev + 1);
      }

      setConvMsgs([...newMsgs, { role: "ai", content: aiReply }]);
      setConvInput("");
    };

    const speakAllTranslations = () => {
      const allEng = convMsgs.map((m) => translateMsg(m.content)).join(". ");
      speakFemale(allEng);
    };

    return (
      <div style={{ background: "#0f172a", color: "#f1f5f9", minHeight: "100vh", fontFamily: "system-ui, sans-serif" }}>
        <Nav />
        <div style={{ maxWidth: 700, margin: "0 auto", padding: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>💬 日本語会話モード</h1>
          <p style={{ color: "#94a3b8", marginBottom: 20 }}>日本語で会話し、終了時に英語で確認</p>
          <SitPicker />

          {!convDone ? (
            <>
              <div style={{ ...cardStyle, minHeight: 350, maxHeight: 450, overflowY: "auto" }}>
                {convMsgs.length === 0 && (
                  <p style={{ color: "#94a3b8", textAlign: "center", marginTop: 60 }}>
                    日本語で話しかけてください。<br />シチュエーション: {sitLabel[sit]}
                  </p>
                )}
                {convMsgs.map((m, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 10 }}>
                    <div style={{
                      padding: "10px 16px", borderRadius: 12, maxWidth: "80%", lineHeight: 1.6,
                      ...(m.role === "user"
                        ? { background: "#3b82f6", color: "#fff", borderBottomRightRadius: 4 }
                        : { background: "#1e293b", border: "1px solid #334155", borderBottomLeftRadius: 4 }),
                    }}>{m.content}</div>
                  </div>
                ))}
                <div ref={convEndRef} />
              </div>
              <form onSubmit={(e) => { e.preventDefault(); sendConvMsg(); }} style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                <input style={{ ...inputStyle, flex: 1 }} placeholder="日本語で入力..." value={convInput} onChange={(e) => setConvInput(e.target.value)} autoFocus />
                <button type="submit" style={{ ...btnStyle, opacity: !convInput.trim() ? 0.5 : 1 }} disabled={!convInput.trim()}>送信</button>
              </form>
              {convMsgs.length > 0 && (
                <button onClick={() => setConvDone(true)} style={{ ...btnSecStyle, borderColor: "#ef4444", color: "#ef4444" }}>
                  会話を終了して英語に翻訳
                </button>
              )}
            </>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700 }}>英語翻訳結果</h2>
                <button style={btnStyle} onClick={speakAllTranslations}>🔊 全文を再生</button>
              </div>
              {convMsgs.map((m, i) => (
                <div key={i} style={cardStyle}>
                  <span style={{
                    fontSize: 12, padding: "2px 10px", borderRadius: 8,
                    background: m.role === "user" ? "#3b82f6" : "#0f172a", color: "#fff",
                  }}>{m.role === "user" ? "あなた" : "AI"}</span>
                  <p style={{ color: "#94a3b8", fontSize: 14, margin: "8px 0 4px" }}>{m.content}</p>
                  <p style={{ fontSize: 18, display: "flex", alignItems: "center", gap: 8 }}>
                    {translateMsg(m.content)} <SpeakBtn text={translateMsg(m.content)} />
                  </p>
                </div>
              ))}
              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button style={btnStyle} onClick={resetConv}>もう一度会話する</button>
                <button style={btnSecStyle} onClick={() => setMode("home")}>トップに戻る</button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return null;
}

import { NextRequest, NextResponse } from "next/server";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

async function callClaude(
  systemPrompt: string | undefined,
  userMessage: string
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }

  const body: Record<string, unknown> = {
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [{ role: "user", content: userMessage }],
  };

  if (systemPrompt) {
    body.system = systemPrompt;
  }

  const response = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Claude API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

async function callClaudeWithMessages(
  systemPrompt: string,
  messages: { role: string; content: string }[]
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }

  const response = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Claude API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    let result: string;

    switch (action) {
      case "generate":
        result = await callClaude(undefined, params.prompt);
        break;
      case "judge":
        result = await callClaude(undefined, params.prompt);
        break;
      case "hint":
        result = await callClaude(undefined, params.prompt);
        break;
      case "conversation":
        result = await callClaudeWithMessages(
          params.systemPrompt,
          params.messages
        );
        break;
      case "translate":
        result = await callClaude(undefined, params.prompt);
        break;
      default:
        return NextResponse.json(
          { error: "Unknown action" },
          { status: 400 }
        );
    }

    // Try to parse as JSON if it looks like JSON
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return NextResponse.json(parsed);
      }
    } catch {
      // Not JSON, return as text
    }

    return NextResponse.json({ text: result });
  } catch (error) {
    console.error("AI API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

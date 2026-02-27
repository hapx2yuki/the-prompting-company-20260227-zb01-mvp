"use client";

import { Badge } from "@/components/ui/badge";
import type { AIModelName } from "@/types/models";

const modelColors: Record<AIModelName, string> = {
  chatgpt: "bg-[var(--chart-chatgpt)] text-white",
  gemini: "bg-[var(--chart-gemini)] text-white",
  claude: "bg-[var(--chart-claude)] text-white",
  perplexity: "bg-[var(--chart-perplexity)] text-white",
  copilot: "bg-[var(--chart-copilot)] text-white",
};

const modelDisplayNames: Record<AIModelName, string> = {
  chatgpt: "ChatGPT",
  gemini: "Gemini",
  claude: "Claude",
  perplexity: "Perplexity",
  copilot: "Copilot",
};

export function AIModelBadge({ model }: { model: AIModelName }) {
  return (
    <Badge className={`${modelColors[model]} border-0`}>
      {modelDisplayNames[model]}
    </Badge>
  );
}

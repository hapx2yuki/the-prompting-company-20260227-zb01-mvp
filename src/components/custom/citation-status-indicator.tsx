"use client";

import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { CitationStatus } from "@/types/models";

const statusConfig: Record<CitationStatus, { label: string; className: string; description: string }> = {
  cited: {
    label: "引用済み",
    className: "bg-green-500/15 text-green-700 border-green-500/30",
    description: "AIモデルに引用されています",
  },
  not_cited: {
    label: "未引用",
    className: "bg-red-500/15 text-red-700 border-red-500/30",
    description: "AIモデルにまだ引用されていません",
  },
  partial: {
    label: "部分引用",
    className: "bg-yellow-500/15 text-yellow-700 border-yellow-500/30",
    description: "一部のAIモデルのみで引用されています",
  },
};

export function CitationStatusIndicator({ status }: { status: CitationStatus }) {
  const config = statusConfig[status];
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant="outline" className={config.className}>
          {config.label}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p>{config.description}</p>
      </TooltipContent>
    </Tooltip>
  );
}

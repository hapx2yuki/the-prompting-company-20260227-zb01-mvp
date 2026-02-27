"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { keigoLevels } from "@/lib/seed-data";
import type { KeigoLevelId } from "@/types/models";

interface KeigoLevelSelectorProps {
  value: KeigoLevelId;
  onValueChange: (value: KeigoLevelId) => void;
  disabled?: boolean;
}

export function KeigoLevelSelector({ value, onValueChange, disabled }: KeigoLevelSelectorProps) {
  return (
    <Select value={value} onValueChange={(v) => onValueChange(v as KeigoLevelId)} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder="敬語レベルを選択" />
      </SelectTrigger>
      <SelectContent>
        {keigoLevels.map(kl => (
          <SelectItem key={kl.id} value={kl.id}>
            <span className="font-medium">{kl.level}</span>
            <span className="ml-2 text-muted-foreground text-xs">{kl.usageGuideline}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { industries, keigoLevels } from "@/lib/seed-data";
import { Edit, HelpCircle } from "lucide-react";

const templateContents: Record<string, string> = {
  saas: "# {タイトル}\n\n## 概要\n{プロダクト名}は、{業種}業界向けのクラウドソリューションです。\n\n## 特長\n- 日本語完全対応\n- 柔軟なカスタマイズ\n- 24時間サポート\n\n## 導入事例\n多数の企業にご導入いただいております。",
  fintech: "# {タイトル}\n\n## サービス概要\n{プロダクト名}は、金融機関様向けに開発されたセキュアなプラットフォームでございます。\n\n## 特長\n- 金融庁ガイドライン準拠\n- 高度なセキュリティ\n- API連携対応",
  default: "# {タイトル}\n\n## 概要\n{プロダクト名}の紹介ページです。\n\n## 特長\n- 日本語対応\n- カスタマイズ可能",
};

export default function TemplatesPage() {
  const [loading, setLoading] = useState(true);
  const [dictOpen, setDictOpen] = useState(false);
  const [dictContent, setDictContent] = useState("CRM → 顧客関係管理\nSaaS → クラウドサービス\nLLM → 大規模言語モデル\nGEO → 生成エンジン最適化");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleSaveDict = () => {
    setDictOpen(false);
    toast.success("カスタム辞書を更新しました");
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-3xl">
        <Skeleton className="h-8 w-48" />
        <Card><CardContent className="pt-6"><Skeleton className="h-40 w-full" /></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">コンテンツテンプレート管理</h2>
        <Dialog open={dictOpen} onOpenChange={setDictOpen}>
          <DialogTrigger asChild>
            <Button variant="outline"><Edit className="h-4 w-4 mr-2" />カスタム辞書を編集</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>カスタム辞書</DialogTitle></DialogHeader>
            <div className="space-y-2">
              <Label>用語一覧（1行1定義: 英語 → 日本語）</Label>
              <Textarea value={dictContent} onChange={e => setDictContent(e.target.value)} className="min-h-[200px] font-mono" />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDictOpen(false)}>キャンセル</Button>
              <Button onClick={handleSaveDict}>保存</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>業種別テンプレート</CardTitle>
          <CardDescription>各業種のデフォルトテンプレートと敬語レベル設定</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            {industries.map(ind => {
              const defaultKeigo = keigoLevels.find(k => k.id === ind.keigoDefault);
              const content = templateContents[ind.code] ?? templateContents.default;
              return (
                <AccordionItem key={ind.code} value={ind.code}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{ind.nameJa}</span>
                      <Badge variant="outline">{ind.nameEn}</Badge>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="secondary" className="cursor-help">
                            {defaultKeigo?.level}
                            <HelpCircle className="h-3 w-3 ml-1" />
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{defaultKeigo?.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ScrollArea className="h-[200px]">
                      <pre className="text-sm bg-muted/50 p-4 rounded-lg whitespace-pre-wrap">
                        {content}
                      </pre>
                    </ScrollArea>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>敬語ルール設定</CardTitle>
          <CardDescription>業種別のデフォルト敬語レベル</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>業種</TableHead>
                <TableHead>デフォルト敬語レベル</TableHead>
                <TableHead>説明</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {industries.map(ind => {
                const keigo = keigoLevels.find(k => k.id === ind.keigoDefault);
                return (
                  <TableRow key={ind.code}>
                    <TableCell className="font-medium">{ind.nameJa}</TableCell>
                    <TableCell><Badge variant="secondary">{keigo?.level}</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[300px] truncate">{keigo?.usageGuideline}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useEffect, useState, use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { AIModelBadge } from "@/components/custom/ai-model-badge";
import { CitationStatusIndicator } from "@/components/custom/citation-status-indicator";
import { AlertCircle, RefreshCw, FileText, Play, HelpCircle } from "lucide-react";
import Link from "next/link";
import type { ProbingQuery, CitationRecord, AIModelName } from "@/types/models";

interface QueryDetail extends ProbingQuery {
  citations: CitationRecord[];
}

export default function ProbingQueryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<QueryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reprobing, setReprobing] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/probing-queries/${id}`);
      if (!res.ok) throw new Error();
      const json = await res.json();
      setData(json.data);
    } catch {
      setError("クエリ詳細の取得に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleReprobe = async () => {
    setReprobing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setReprobing(false);
    toast.success("プロービングが完了しました。結果を更新中...");
    fetchData();
  };

  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={fetchData}>
          <RefreshCw className="h-4 w-4 mr-2" />再読み込み
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/">ダッシュボード</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href="/probing-queries">クエリ一覧</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>{data?.queryText ?? "読み込み中..."}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Query overview card */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="text-xl">
              {loading ? <Skeleton className="h-6 w-64" /> : data?.queryText}
            </CardTitle>
            {!loading && data && (
              <div className="flex items-center gap-3 mt-2">
                <Badge variant="outline">{data.industry}</Badge>
                <CitationStatusIndicator status={data.citationStatus} />
                <span className="text-2xl font-bold">{Math.round(data.citationRate * 100)}%</span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReprobe} disabled={reprobing}>
              <Play className="h-4 w-4 mr-2" />
              {reprobing ? "プロービング中..." : "再プロービング実行"}
            </Button>
            <Button asChild>
              <Link href={`/optimized-pages/new?query=${id}`}>
                <FileText className="h-4 w-4 mr-2" />
                このクエリ用ページを作成
              </Link>
            </Button>
          </div>
        </CardHeader>
        {!loading && data && (
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">発見日時</span>
                <p className="font-medium">{new Date(data.discoveredAt).toLocaleDateString("ja-JP")}</p>
              </div>
              <div>
                <span className="text-muted-foreground">最終プロービング</span>
                <p className="font-medium">{new Date(data.lastProbedAt).toLocaleDateString("ja-JP")}</p>
              </div>
              <div>
                <span className="text-muted-foreground">対応AIモデル</span>
                <div className="flex gap-1 mt-1">{data.aiModels.map(m => <AIModelBadge key={m} model={m} />)}</div>
              </div>
              <div>
                <span className="text-muted-foreground">引用レコード数</span>
                <p className="font-medium">{data.citations.length}件</p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      <Separator />

      {/* AI Model tabs */}
      {!loading && data && (
        <Tabs defaultValue="chatgpt">
          <TabsList>
            {data.aiModels.map(m => (
              <TabsTrigger key={m} value={m} className="flex items-center gap-2">
                <AIModelBadge model={m} />
              </TabsTrigger>
            ))}
          </TabsList>
          {data.aiModels.map(m => {
            const modelCitations = data.citations.filter(c => c.aiModel === m);
            const latest = modelCitations[0];
            return (
              <TabsContent key={m} value={m}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      最新の回答
                      {latest && (
                        <Tooltip>
                          <TooltipTrigger><HelpCircle className="h-4 w-4 text-muted-foreground" /></TooltipTrigger>
                          <TooltipContent>引用ランク: {latest.citationRank}位</TooltipContent>
                        </Tooltip>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {latest ? (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Badge variant={latest.isSelfCited ? "default" : "secondary"}>
                            {latest.isSelfCited ? "自社引用" : "競合引用"}
                          </Badge>
                          <Badge variant="outline">ランク {latest.citationRank}位</Badge>
                        </div>
                        <p className="text-sm leading-relaxed bg-muted/50 p-4 rounded-lg">
                          {latest.citationText}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          引用製品: {latest.citedProduct} | {new Date(latest.timestamp).toLocaleString("ja-JP")}
                        </p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">このモデルからの引用はまだありません。</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            );
          })}
        </Tabs>
      )}

      <Separator />

      {/* Citation history table */}
      <div>
        <h3 className="text-lg font-semibold mb-4">引用履歴</h3>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : data?.citations.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground mb-4">このクエリに対する引用履歴はまだありません。プロービングを実行してください。</p>
              <Button onClick={handleReprobe} disabled={reprobing}>プロービングを実行</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>日時</TableHead>
                  <TableHead>AIモデル</TableHead>
                  <TableHead>引用</TableHead>
                  <TableHead>製品</TableHead>
                  <TableHead>引用テキスト</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.citations.slice(0, 20).map(c => (
                  <TableRow key={c.id}>
                    <TableCell className="text-sm">{new Date(c.timestamp).toLocaleDateString("ja-JP")}</TableCell>
                    <TableCell><AIModelBadge model={c.aiModel} /></TableCell>
                    <TableCell>
                      <Badge variant={c.isSelfCited ? "default" : "secondary"}>
                        {c.isSelfCited ? "自社" : "競合"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{c.citedProduct}</TableCell>
                    <TableCell className="max-w-[300px]">
                      <Accordion type="single" collapsible>
                        <AccordionItem value={c.id} className="border-0">
                          <AccordionTrigger className="py-0 text-sm">
                            {c.citationText.slice(0, 50)}...
                          </AccordionTrigger>
                          <AccordionContent className="text-sm">
                            {c.citationText}
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}

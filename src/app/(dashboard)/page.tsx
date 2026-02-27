"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Tooltip as RechartsTooltip, Legend,
} from "recharts";
import { TrendingUp, TrendingDown, ArrowRight, AlertCircle, RefreshCw, HelpCircle } from "lucide-react";
import { AIModelBadge } from "@/components/custom/ai-model-badge";
import { CitationStatusIndicator } from "@/components/custom/citation-status-indicator";
import Link from "next/link";
import type { ProbingQuery, ActivityEvent } from "@/types/models";

interface DashboardData {
  kpis: {
    citationRate: number;
    citationRateDelta: number;
    aiTrafficCount: number;
    aiTrafficDelta: number;
    coverageRate: number;
    estimatedROI: number;
    estimatedROIDelta: number;
  };
  citationTrend: Array<{ date: string; chatgpt: number; gemini: number; claude: number; perplexity: number }>;
  aiModelCitations: Array<{ name: string; value: number }>;
  trafficTrend: Array<{ date: string; chatgpt: number; gemini: number; claude: number; perplexity: number }>;
  activities: ActivityEvent[];
  topQueries: ProbingQuery[];
}

const chartColors = {
  chatgpt: "var(--chart-chatgpt)",
  gemini: "var(--chart-gemini)",
  claude: "var(--chart-claude)",
  perplexity: "var(--chart-perplexity)",
};

function DeltaIndicator({ value }: { value: number }) {
  const isPositive = value >= 0;
  return (
    <span className={`flex items-center text-xs ${isPositive ? "text-green-600" : "text-red-600"}`}>
      {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
      {isPositive ? "+" : ""}{value}%
    </span>
  );
}

function KPISkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-24" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-20 mb-2" />
        <Skeleton className="h-3 w-16" />
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState("30");

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/dashboard?project_id=proj-001&period=${period}`);
      if (!res.ok) throw new Error("データの取得に失敗しました。");
      const json = await res.json();
      setData(json.data);
      toast.success("ダッシュボードデータを更新しました");
    } catch {
      setError("データの取得に失敗しました。ネットワーク接続を確認してください。");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [period]);

  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={fetchData}>
          <RefreshCw className="h-4 w-4 mr-2" />
          再読み込み
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Period filter */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">ダッシュボード</h2>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">過去7日</SelectItem>
            <SelectItem value="30">過去30日</SelectItem>
            <SelectItem value="90">過去90日</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <>
            <KPISkeleton />
            <KPISkeleton />
            <KPISkeleton />
            <KPISkeleton />
          </>
        ) : data ? (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  引用率スコア
                  <Tooltip>
                    <TooltipTrigger><HelpCircle className="h-3 w-3" /></TooltipTrigger>
                    <TooltipContent>AIモデルにおける平均引用率</TooltipContent>
                  </Tooltip>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{data.kpis.citationRate}%</div>
                <DeltaIndicator value={data.kpis.citationRateDelta} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">AIトラフィック数</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{data.kpis.aiTrafficCount.toLocaleString()}</div>
                <DeltaIndicator value={data.kpis.aiTrafficDelta} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">クエリカバレッジ率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{data.kpis.coverageRate}%</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">推定ROI</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">¥{data.kpis.estimatedROI.toLocaleString()}</div>
                <DeltaIndicator value={data.kpis.estimatedROIDelta} />
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="trend" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trend">引用率トレンド</TabsTrigger>
          <TabsTrigger value="models">AIモデル比較</TabsTrigger>
          <TabsTrigger value="traffic">トラフィック</TabsTrigger>
        </TabsList>

        <TabsContent value="trend">
          <Card>
            <CardHeader>
              <CardTitle>引用率トレンド</CardTitle>
              <CardDescription>AIモデル別の引用率推移</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : data ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data.citationTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} unit="%" />
                    <RechartsTooltip />
                    <Legend />
                    <Area type="monotone" dataKey="chatgpt" name="ChatGPT" stroke={chartColors.chatgpt} fill={chartColors.chatgpt} fillOpacity={0.2} />
                    <Area type="monotone" dataKey="gemini" name="Gemini" stroke={chartColors.gemini} fill={chartColors.gemini} fillOpacity={0.2} />
                    <Area type="monotone" dataKey="claude" name="Claude" stroke={chartColors.claude} fill={chartColors.claude} fillOpacity={0.2} />
                    <Area type="monotone" dataKey="perplexity" name="Perplexity" stroke={chartColors.perplexity} fill={chartColors.perplexity} fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models">
          <Card>
            <CardHeader>
              <CardTitle>AIモデル別引用数</CardTitle>
              <CardDescription>各AIモデルからの引用数比較</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : data ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.aiModelCitations} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={100} />
                    <RechartsTooltip />
                    <Bar dataKey="value" name="引用数" fill="var(--primary)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traffic">
          <Card>
            <CardHeader>
              <CardTitle>AIトラフィック推移</CardTitle>
              <CardDescription>AIモデル経由のトラフィック推移</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : data ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data.trafficTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <RechartsTooltip />
                    <Legend />
                    <Area type="monotone" dataKey="chatgpt" name="ChatGPT" stroke={chartColors.chatgpt} fill={chartColors.chatgpt} fillOpacity={0.3} stackId="1" />
                    <Area type="monotone" dataKey="gemini" name="Gemini" stroke={chartColors.gemini} fill={chartColors.gemini} fillOpacity={0.3} stackId="1" />
                    <Area type="monotone" dataKey="claude" name="Claude" stroke={chartColors.claude} fill={chartColors.claude} fillOpacity={0.3} stackId="1" />
                    <Area type="monotone" dataKey="perplexity" name="Perplexity" stroke={chartColors.perplexity} fill={chartColors.perplexity} fillOpacity={0.3} stackId="1" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bottom section: Top queries + Activity feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>トップ引用クエリ</CardTitle>
              <CardDescription>引用率上位のクエリ</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/probing-queries">
                すべて表示
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : data?.topQueries.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">プロービングクエリがありません</p>
                <Button asChild>
                  <Link href="/settings">プロービングを開始</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {data?.topQueries.map(q => (
                  <Link key={q.id} href={`/probing-queries/${q.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex-1 min-w-0 mr-3">
                      <p className="text-sm font-medium truncate">{q.queryText}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <CitationStatusIndicator status={q.citationStatus} />
                        {q.aiModels.slice(0, 3).map(m => (
                          <AIModelBadge key={m} model={m} />
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold">{Math.round(q.citationRate * 100)}%</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>最新アクティビティ</CardTitle>
            <CardDescription>最近のシステムイベント</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <ScrollArea className="h-[300px]">
                <div className="space-y-3">
                  {data?.activities.map(a => (
                    <div key={a.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <Badge variant="outline" className="mt-1 shrink-0">
                        {a.type === "citation_detected" ? "引用" : a.type === "page_published" ? "公開" : a.type === "probing_completed" ? "完了" : "通知"}
                      </Badge>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{a.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(a.timestamp).toLocaleString("ja-JP")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

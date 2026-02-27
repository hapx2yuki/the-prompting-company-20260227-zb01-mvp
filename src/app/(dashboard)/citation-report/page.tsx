"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Tooltip as RechartsTooltip, Legend,
} from "recharts";
import { TrendingUp, TrendingDown, AlertCircle, RefreshCw, Download, FileText } from "lucide-react";
import { generateCitationTrendData, generateAIModelCitationData, citationRecords } from "@/lib/seed-data";

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

export default function CitationReportPage() {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30");
  const [aiModelFilter, setAiModelFilter] = useState("all");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [period]);

  const trendData = generateCitationTrendData("proj-001", parseInt(period));
  const modelData = generateAIModelCitationData("proj-001");
  const projectCitations = citationRecords.filter(r => r.projectId === "proj-001");
  const selfCitations = projectCitations.filter(r => r.isSelfCited);

  const handleExportCSV = () => toast.success("CSVファイルをダウンロードしました");
  const handleExportPDF = () => toast.success("PDFレポートを生成しました");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">引用分析レポート</h2>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7">過去7日</SelectItem>
              <SelectItem value="30">過去30日</SelectItem>
              <SelectItem value="90">過去90日</SelectItem>
            </SelectContent>
          </Select>
          <Select value={aiModelFilter} onValueChange={setAiModelFilter}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全モデル</SelectItem>
              <SelectItem value="chatgpt">ChatGPT</SelectItem>
              <SelectItem value="gemini">Gemini</SelectItem>
              <SelectItem value="claude">Claude</SelectItem>
              <SelectItem value="perplexity">Perplexity</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleExportCSV}><Download className="h-4 w-4 mr-1" />CSV</Button>
          <Button variant="outline" size="sm" onClick={handleExportPDF}><FileText className="h-4 w-4 mr-1" />PDF</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}><CardContent className="pt-6"><Skeleton className="h-8 w-20 mb-2" /><Skeleton className="h-3 w-16" /></CardContent></Card>
        )) : (
          <>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">総引用数</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{selfCitations.length}</div>
                <DeltaIndicator value={7.3} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">平均引用率</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">48%</div>
                <DeltaIndicator value={3.2} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">トップ引用AIモデル</CardTitle></CardHeader>
              <CardContent>
                <div className="text-xl font-bold">ChatGPT</div>
                <p className="text-xs text-muted-foreground">{modelData.find(m => m.name === "ChatGPT")?.value ?? 0}件</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">引用率変動</CardTitle></CardHeader>
              <CardContent>
                <div className="text-sm font-medium text-green-600">最大改善: +12.5%</div>
                <div className="text-sm font-medium text-red-600">最大低下: -5.3%</div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Tabs defaultValue="trend">
        <TabsList>
          <TabsTrigger value="trend">トレンド</TabsTrigger>
          <TabsTrigger value="models">AIモデル比較</TabsTrigger>
        </TabsList>
        <TabsContent value="trend">
          <Card>
            <CardHeader>
              <CardTitle>引用率トレンド</CardTitle>
              <CardDescription>AIモデル別の引用率推移</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-[300px] w-full" /> : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} unit="%" />
                    <RechartsTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="chatgpt" name="ChatGPT" stroke={chartColors.chatgpt} strokeWidth={2} />
                    <Line type="monotone" dataKey="gemini" name="Gemini" stroke={chartColors.gemini} strokeWidth={2} />
                    <Line type="monotone" dataKey="claude" name="Claude" stroke={chartColors.claude} strokeWidth={2} />
                    <Line type="monotone" dataKey="perplexity" name="Perplexity" stroke={chartColors.perplexity} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="models">
          <Card>
            <CardHeader>
              <CardTitle>AIモデル別引用数比較</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-[300px] w-full" /> : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={modelData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={100} />
                    <RechartsTooltip />
                    <Bar dataKey="value" name="引用数" fill="var(--primary)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

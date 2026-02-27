"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Tooltip as RechartsTooltip, Legend,
} from "recharts";
import { TrendingUp, TrendingDown, AlertCircle, RefreshCw, HelpCircle } from "lucide-react";
import { AIModelBadge } from "@/components/custom/ai-model-badge";
import { generateTrafficTrendData, generateTrafficModelShareData, trafficEvents } from "@/lib/seed-data";
import type { AIModelName } from "@/types/models";

const chartColors: Record<string, string> = {
  ChatGPT: "var(--chart-chatgpt)",
  Gemini: "var(--chart-gemini)",
  Claude: "var(--chart-claude)",
  Perplexity: "var(--chart-perplexity)",
  Copilot: "var(--chart-copilot)",
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

export default function TrafficPage() {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [period]);

  const trendData = generateTrafficTrendData("proj-001", parseInt(period));
  const modelShare = generateTrafficModelShareData("proj-001");
  const projectEvents = trafficEvents.filter(t => t.projectId === "proj-001");
  const converted = projectEvents.filter(t => t.conversionStatus === "converted");
  const totalRevenue = converted.reduce((s, t) => s + t.revenueJPY, 0);
  const cvr = projectEvents.length > 0 ? Math.round((converted.length / projectEvents.length) * 1000) / 10 : 0;

  // Traffic by model for table
  const modelStats = modelShare.map(m => {
    const modelEvents = projectEvents.filter(t => {
      const displayMap: Record<AIModelName, string> = { chatgpt: "ChatGPT", gemini: "Gemini", claude: "Claude", perplexity: "Perplexity", copilot: "Copilot" };
      return Object.entries(displayMap).find(([, v]) => v === m.name)?.[0] === t.sourceAIModel;
    });
    const modelConverted = modelEvents.filter(t => t.conversionStatus === "converted");
    return {
      name: m.name,
      visits: m.value,
      conversions: modelConverted.length,
      cvr: m.value > 0 ? Math.round((modelConverted.length / m.value) * 1000) / 10 : 0,
      revenue: modelConverted.reduce((s, t) => s + t.revenueJPY, 0),
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">トラフィック分析</h2>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="7">過去7日</SelectItem>
            <SelectItem value="30">過去30日</SelectItem>
            <SelectItem value="90">過去90日</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}><CardContent className="pt-6"><Skeleton className="h-8 w-20 mb-2" /><Skeleton className="h-3 w-16" /></CardContent></Card>
        )) : (
          <>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">AI経由トラフィック総数</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{projectEvents.length.toLocaleString()}</div>
                <DeltaIndicator value={12.3} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">コンバージョン数</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{converted.length}</div>
                <DeltaIndicator value={8.7} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">コンバージョン率</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{cvr}%</div>
                <DeltaIndicator value={1.2} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground flex items-center gap-1">
                  推定ROI
                  <Popover>
                    <PopoverTrigger><HelpCircle className="h-3 w-3 cursor-pointer" /></PopoverTrigger>
                    <PopoverContent className="text-sm">
                      <p>AI経由トラフィックのコンバージョンから算出した推定売上です。</p>
                    </PopoverContent>
                  </Popover>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">¥{totalRevenue.toLocaleString()}</div>
                <DeltaIndicator value={15.4} />
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Tabs defaultValue="trend">
        <TabsList>
          <TabsTrigger value="trend">トラフィック推移</TabsTrigger>
          <TabsTrigger value="share">AIモデル内訳</TabsTrigger>
          <TabsTrigger value="details">詳細</TabsTrigger>
        </TabsList>

        <TabsContent value="trend">
          <Card>
            <CardHeader>
              <CardTitle>AIトラフィック推移</CardTitle>
              <CardDescription>AIモデル別の日次トラフィック</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-[300px] w-full" /> : (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <RechartsTooltip />
                    <Legend />
                    <Area type="monotone" dataKey="chatgpt" name="ChatGPT" stroke="var(--chart-chatgpt)" fill="var(--chart-chatgpt)" fillOpacity={0.3} stackId="1" />
                    <Area type="monotone" dataKey="gemini" name="Gemini" stroke="var(--chart-gemini)" fill="var(--chart-gemini)" fillOpacity={0.3} stackId="1" />
                    <Area type="monotone" dataKey="claude" name="Claude" stroke="var(--chart-claude)" fill="var(--chart-claude)" fillOpacity={0.3} stackId="1" />
                    <Area type="monotone" dataKey="perplexity" name="Perplexity" stroke="var(--chart-perplexity)" fill="var(--chart-perplexity)" fillOpacity={0.3} stackId="1" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="share">
          <Card>
            <CardHeader>
              <CardTitle>AIモデル別トラフィック構成比</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              {loading ? <Skeleton className="h-[300px] w-[300px]" /> : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={modelShare} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {modelShare.map((entry, i) => (
                        <Cell key={i} fill={chartColors[entry.name] ?? "var(--muted-foreground)"} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value: number, name: string) => [`${value}件`, name]} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          <Card>
            <CardHeader><CardTitle>AIモデル別トラフィック詳細</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>AIモデル</TableHead>
                    <TableHead>訪問数</TableHead>
                    <TableHead>コンバージョン数</TableHead>
                    <TableHead>CVR</TableHead>
                    <TableHead>推定ROI（円）</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modelStats.map(m => (
                    <TableRow key={m.name}>
                      <TableCell><Badge variant="outline">{m.name}</Badge></TableCell>
                      <TableCell className="font-medium">{m.visits.toLocaleString()}</TableCell>
                      <TableCell>{m.conversions}</TableCell>
                      <TableCell>{m.cvr}%</TableCell>
                      <TableCell className="font-medium">¥{m.revenue.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

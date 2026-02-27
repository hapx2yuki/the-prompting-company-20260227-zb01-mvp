"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { Plus, AlertCircle, RefreshCw, Info } from "lucide-react";
import { competitors as seedCompetitors, probingQueries, citationRecords } from "@/lib/seed-data";

export default function CompetitorsPage() {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newCompName, setNewCompName] = useState("");
  const [newCompDomain, setNewCompDomain] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const selfCitations = citationRecords.filter(r => r.projectId === "proj-001" && r.isSelfCited);
  const selfQueries = probingQueries.filter(q => q.projectId === "proj-001");
  const selfRate = selfQueries.length > 0 ? Math.round((selfQueries.reduce((s, q) => s + q.citationRate, 0) / selfQueries.length) * 100) : 0;

  const comparisonData = [
    { name: "自社", citationCount: selfCitations.length, citationRate: selfRate, fill: "var(--primary)" },
    ...seedCompetitors.map(c => ({
      name: c.productName,
      citationCount: c.citationCount,
      citationRate: Math.round(c.citationRate * 100),
      fill: "var(--muted-foreground)",
    })),
  ];

  const handleAddCompetitor = () => {
    if (!newCompName || !newCompDomain) return;
    setAddDialogOpen(false);
    setNewCompName("");
    setNewCompDomain("");
    toast.success("競合プロダクトを追加しました。分析を開始します...");
  };

  const handleDeleteCompetitor = (name: string) => {
    toast.success(`${name}を削除しました`);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[300px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">競合分析</h2>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7">過去7日</SelectItem>
              <SelectItem value="30">過去30日</SelectItem>
              <SelectItem value="90">過去90日</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline"><Plus className="h-4 w-4 mr-2" />競合を追加</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>競合プロダクトを追加</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>プロダクト名</Label>
                  <Input value={newCompName} onChange={e => setNewCompName(e.target.value)} placeholder="競合プロダクト名" />
                </div>
                <div className="space-y-2">
                  <Label>ドメイン</Label>
                  <Input value={newCompDomain} onChange={e => setNewCompDomain(e.target.value)} placeholder="example.co.jp" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddDialogOpen(false)}>キャンセル</Button>
                <Button onClick={handleAddCompetitor}>追加</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {seedCompetitors.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-lg font-medium mb-2">競合が未登録です</p>
            <p className="text-muted-foreground mb-4">競合プロダクトを追加して、AI引用状況を比較しましょう。</p>
            <Button onClick={() => setAddDialogOpen(true)}>最初の競合を追加</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>引用数比較</CardTitle>
              <CardDescription>自社と競合のAI引用数を比較</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparisonData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={120} />
                  <RechartsTooltip formatter={(value: number) => [`${value}件`, "引用数"]} />
                  <Bar dataKey="citationCount" name="引用数" radius={[0, 4, 4, 0]}>
                    {comparisonData.map((entry, i) => (
                      <rect key={i} fill={i === 0 ? "var(--primary)" : "var(--muted-foreground)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>競合一覧</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>プロダクト名</TableHead>
                    <TableHead>ドメイン</TableHead>
                    <TableHead>引用数</TableHead>
                    <TableHead>引用率</TableHead>
                    <TableHead>最終分析</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {seedCompetitors.map(c => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">
                        <Popover>
                          <PopoverTrigger className="flex items-center gap-1 cursor-pointer hover:underline">
                            {c.productName}
                            <Info className="h-3 w-3 text-muted-foreground" />
                          </PopoverTrigger>
                          <PopoverContent>
                            <div className="space-y-2 text-sm">
                              <p><span className="text-muted-foreground">ドメイン:</span> {c.domain}</p>
                              <p><span className="text-muted-foreground">追加日:</span> {new Date(c.addedAt).toLocaleDateString("ja-JP")}</p>
                              <p><span className="text-muted-foreground">最終分析:</span> {new Date(c.lastAnalyzedAt).toLocaleString("ja-JP")}</p>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{c.domain}</TableCell>
                      <TableCell className="font-medium">{c.citationCount}</TableCell>
                      <TableCell><Badge variant="outline">{Math.round(c.citationRate * 100)}%</Badge></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{new Date(c.lastAnalyzedAt).toLocaleDateString("ja-JP")}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDeleteCompetitor(c.productName)}>削除</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

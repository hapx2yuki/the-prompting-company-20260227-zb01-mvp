"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AIModelBadge } from "@/components/custom/ai-model-badge";
import { CitationStatusIndicator } from "@/components/custom/citation-status-indicator";
import { ArrowUpDown, AlertCircle, RefreshCw, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import type { ProbingQuery, ApiListResponse } from "@/types/models";

export default function ProbingQueriesPage() {
  const [data, setData] = useState<ProbingQuery[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, perPage: 20, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("all");
  const [aiModel, setAiModel] = useState("all");
  const [citationStatus, setCitationStatus] = useState("all");
  const [sortBy, setSortBy] = useState("lastProbedAt");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        per_page: "20",
        sort_by: sortBy,
        order,
      });
      if (search) params.set("q", search);
      if (industry !== "all") params.set("industry", industry);
      if (aiModel !== "all") params.set("aiModels", aiModel);
      if (citationStatus !== "all") params.set("citationStatus", citationStatus);

      const res = await fetch(`/api/probing-queries?${params}`);
      if (!res.ok) throw new Error();
      const json: ApiListResponse<ProbingQuery> = await res.json();
      setData(json.data);
      setMeta(json.meta);
    } catch {
      setError("クエリデータの取得に失敗しました。");
    } finally {
      setLoading(false);
    }
  }, [page, search, industry, aiModel, citationStatus, sortBy, order]);

  useEffect(() => {
    const timer = setTimeout(fetchData, 300);
    return () => clearTimeout(timer);
  }, [fetchData]);

  const toggleSort = (column: string) => {
    if (sortBy === column) {
      setOrder(order === "desc" ? "asc" : "desc");
    } else {
      setSortBy(column);
      setOrder("desc");
    }
  };

  return (
    <div className="space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/">ダッシュボード</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>プロービングクエリ一覧</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h2 className="text-2xl font-bold">プロービングクエリ一覧</h2>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="クエリを検索..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="w-full sm:w-[300px]"
        />
        <Select value={industry} onValueChange={v => { setIndustry(v); setPage(1); }}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全業種</SelectItem>
            <SelectItem value="saas">SaaS</SelectItem>
            <SelectItem value="fintech">フィンテック</SelectItem>
            <SelectItem value="ec">EC</SelectItem>
            <SelectItem value="manufacturing">製造業</SelectItem>
            <SelectItem value="real_estate">不動産</SelectItem>
            <SelectItem value="education">教育</SelectItem>
            <SelectItem value="healthcare">医療</SelectItem>
            <SelectItem value="logistics">物流</SelectItem>
            <SelectItem value="hr">HR</SelectItem>
            <SelectItem value="legal">法務</SelectItem>
            <SelectItem value="accounting">会計</SelectItem>
            <SelectItem value="marketing">マーケティング</SelectItem>
          </SelectContent>
        </Select>
        <Select value={aiModel} onValueChange={v => { setAiModel(v); setPage(1); }}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全モデル</SelectItem>
            <SelectItem value="chatgpt">ChatGPT</SelectItem>
            <SelectItem value="gemini">Gemini</SelectItem>
            <SelectItem value="claude">Claude</SelectItem>
            <SelectItem value="perplexity">Perplexity</SelectItem>
            <SelectItem value="copilot">Copilot</SelectItem>
          </SelectContent>
        </Select>
        <Select value={citationStatus} onValueChange={v => { setCitationStatus(v); setPage(1); }}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            <SelectItem value="cited">引用済み</SelectItem>
            <SelectItem value="not_cited">未引用</SelectItem>
            <SelectItem value="partial">部分引用</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error ? (
        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button variant="outline" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />再読み込み
          </Button>
        </div>
      ) : data.length === 0 && !loading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-lg font-medium mb-2">プロービングクエリがありません</p>
            <p className="text-muted-foreground mb-4">プロジェクト設定からドメインを登録し、プロービングを開始してください。</p>
            <Button asChild><Link href="/settings">プロジェクト設定へ</Link></Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[300px]">クエリテキスト</TableHead>
                  <TableHead>業種</TableHead>
                  <TableHead>引用状態</TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" className="h-8 -ml-3" onClick={() => toggleSort("citationRate")}>
                      引用率
                      <ArrowUpDown className="h-3 w-3 ml-1" />
                    </Button>
                  </TableHead>
                  <TableHead>AIモデル</TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" className="h-8 -ml-3" onClick={() => toggleSort("lastProbedAt")}>
                      最終プロービング
                      <ArrowUpDown className="h-3 w-3 ml-1" />
                    </Button>
                  </TableHead>
                  <TableHead className="w-[40px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-6" /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  data.map(q => (
                    <TableRow key={q.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <Link href={`/probing-queries/${q.id}`} className="font-medium hover:underline">
                          {q.queryText}
                        </Link>
                      </TableCell>
                      <TableCell className="text-sm">{q.industry}</TableCell>
                      <TableCell><CitationStatusIndicator status={q.citationStatus} /></TableCell>
                      <TableCell className="font-medium">{Math.round(q.citationRate * 100)}%</TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {q.aiModels.slice(0, 3).map(m => <AIModelBadge key={m} model={m} />)}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(q.lastProbedAt).toLocaleDateString("ja-JP")}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild><Link href={`/probing-queries/${q.id}`}>詳細を表示</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild><Link href={`/optimized-pages/new?query=${q.id}`}>ページを作成</Link></DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              全{meta.total}件中 {(meta.page - 1) * meta.perPage + 1}-{Math.min(meta.page * meta.perPage, meta.total)}件
            </p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                <PaginationItem>
                  <span className="px-3 text-sm">{meta.page} / {meta.totalPages}</span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                    className={page >= meta.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}
    </div>
  );
}

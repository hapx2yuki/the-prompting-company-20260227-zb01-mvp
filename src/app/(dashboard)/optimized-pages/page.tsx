"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Plus, ArrowUpDown, AlertCircle, RefreshCw, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import type { OptimizedPage, ApiListResponse } from "@/types/models";

const statusBadge: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  published: { label: "公開中", variant: "default" },
  draft: { label: "下書き", variant: "secondary" },
  archived: { label: "アーカイブ", variant: "outline" },
};

const keigoLabels: Record<string, string> = {
  teinei: "丁寧語",
  sonkei: "尊敬語",
  kenjou: "謙譲語",
};

export default function OptimizedPagesPage() {
  const [data, setData] = useState<OptimizedPage[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, perPage: 20, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [keigoLevel, setKeigoLevel] = useState("all");
  const [sortBy, setSortBy] = useState("updatedAt");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), per_page: "20", sort_by: sortBy, order });
      if (search) params.set("q", search);
      if (status !== "all") params.set("status", status);
      if (keigoLevel !== "all") params.set("keigoLevel", keigoLevel);
      const res = await fetch(`/api/optimized-pages?${params}`);
      if (!res.ok) throw new Error();
      const json: ApiListResponse<OptimizedPage> = await res.json();
      setData(json.data);
      setMeta(json.meta);
    } catch {
      setError("ページデータの取得に失敗しました。");
    } finally {
      setLoading(false);
    }
  }, [page, search, status, keigoLevel, sortBy, order]);

  useEffect(() => {
    const timer = setTimeout(fetchData, 300);
    return () => clearTimeout(timer);
  }, [fetchData]);

  const toggleSort = (column: string) => {
    if (sortBy === column) setOrder(order === "desc" ? "asc" : "desc");
    else { setSortBy(column); setOrder("desc"); }
  };

  const handleTogglePublish = (pageItem: OptimizedPage) => {
    toast.success(pageItem.status === "published" ? "ページを非公開にしました" : "ページを公開しました");
  };

  const handleDelete = (pageItem: OptimizedPage) => {
    toast.success(`「${pageItem.title}」を削除しました`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">AI最適化ページ一覧</h2>
        <Button asChild>
          <Link href="/optimized-pages/new">
            <Plus className="h-4 w-4 mr-2" />新規ページ作成
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input placeholder="ページを検索..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="w-full sm:w-[300px]" />
        <Select value={status} onValueChange={v => { setStatus(v); setPage(1); }}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            <SelectItem value="draft">下書き</SelectItem>
            <SelectItem value="published">公開中</SelectItem>
            <SelectItem value="archived">アーカイブ済み</SelectItem>
          </SelectContent>
        </Select>
        <Select value={keigoLevel} onValueChange={v => { setKeigoLevel(v); setPage(1); }}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            <SelectItem value="teinei">丁寧語</SelectItem>
            <SelectItem value="sonkei">尊敬語</SelectItem>
            <SelectItem value="kenjou">謙譲語</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error ? (
        <div className="space-y-4">
          <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>
          <Button variant="outline" onClick={fetchData}><RefreshCw className="h-4 w-4 mr-2" />再読み込み</Button>
        </div>
      ) : data.length === 0 && !loading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-lg font-medium mb-2">AI最適化ページがありません</p>
            <p className="text-muted-foreground mb-4">最初のページを作成して、AIからの引用を獲得しましょう。</p>
            <Button asChild><Link href="/optimized-pages/new">最初のページを作成</Link></Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[250px]">タイトル</TableHead>
                  <TableHead>ステータス</TableHead>
                  <TableHead>敬語</TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" className="h-8 -ml-3" onClick={() => toggleSort("citationCount")}>
                      引用数<ArrowUpDown className="h-3 w-3 ml-1" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" className="h-8 -ml-3" onClick={() => toggleSort("trafficCount")}>
                      トラフィック<ArrowUpDown className="h-3 w-3 ml-1" />
                    </Button>
                  </TableHead>
                  <TableHead>公開</TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" className="h-8 -ml-3" onClick={() => toggleSort("updatedAt")}>
                      更新日<ArrowUpDown className="h-3 w-3 ml-1" />
                    </Button>
                  </TableHead>
                  <TableHead className="w-[40px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 8 }).map((_, j) => (
                        <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  data.map(p => {
                    const sb = statusBadge[p.status];
                    return (
                      <TableRow key={p.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell>
                          <Link href={`/optimized-pages/${p.id}`} className="font-medium hover:underline">{p.title}</Link>
                        </TableCell>
                        <TableCell><Badge variant={sb.variant}>{sb.label}</Badge></TableCell>
                        <TableCell><Badge variant="outline">{keigoLabels[p.keigoLevel]}</Badge></TableCell>
                        <TableCell className="font-medium">{p.citationCount}</TableCell>
                        <TableCell className="font-medium">{p.trafficCount}</TableCell>
                        <TableCell>
                          <Switch checked={p.status === "published"} onCheckedChange={() => handleTogglePublish(p)} />
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{new Date(p.updatedAt).toLocaleDateString("ja-JP")}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild><Link href={`/optimized-pages/${p.id}`}>編集</Link></DropdownMenuItem>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem onSelect={e => e.preventDefault()} className="text-destructive">削除</DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>ページを削除しますか？</AlertDialogTitle>
                                    <AlertDialogDescription>この操作は元に戻せません。「{p.title}」を完全に削除します。</AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>キャンセル</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(p)} className="bg-destructive text-destructive-foreground">削除</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">全{meta.total}件</p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={() => setPage(p => Math.max(1, p - 1))} className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} />
                </PaginationItem>
                <PaginationItem><span className="px-3 text-sm">{meta.page} / {meta.totalPages}</span></PaginationItem>
                <PaginationItem>
                  <PaginationNext onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))} className={page >= meta.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}
    </div>
  );
}

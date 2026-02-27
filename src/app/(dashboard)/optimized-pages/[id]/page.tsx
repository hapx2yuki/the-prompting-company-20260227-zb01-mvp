"use client";

import { useEffect, useState, use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { KeigoLevelSelector } from "@/components/custom/keigo-level-selector";
import { toast } from "sonner";
import { industries } from "@/lib/seed-data";
import { AlertCircle, RefreshCw, Save, Globe, Loader2 } from "lucide-react";
import type { OptimizedPage, KeigoLevelId } from "@/types/models";

export default function OptimizedPageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const isNew = id === "new";
  const [data, setData] = useState<OptimizedPage | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [keigoLevel, setKeigoLevel] = useState<KeigoLevelId>("teinei");
  const [industry, setIndustry] = useState("");
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const fetchData = async () => {
    if (isNew) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/optimized-pages/${id}`);
      if (!res.ok) throw new Error();
      const json = await res.json();
      const page: OptimizedPage = json.data;
      setData(page);
      setTitle(page.title);
      setContent(page.markdownContent);
      setKeigoLevel(page.keigoLevel);
      setIndustry(page.industry);
    } catch {
      setError("ページデータの取得に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!title || title.length < 1) errors.title = "タイトルは必須です";
    if (title.length > 200) errors.title = "タイトルは200文字以内で入力してください";
    if (!content || content.length < 100) errors.content = "コンテンツは100文字以上入力してください";
    if (!keigoLevel) errors.keigoLevel = "敬語レベルを選択してください";
    if (!industry) errors.industry = "業種を選択してください";
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) {
      const firstField = document.querySelector(`[name="${Object.keys(errors)[0]}"]`);
      if (firstField instanceof HTMLElement) firstField.focus();
    }
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (publish: boolean) => {
    if (!validate()) return;
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    setIsDirty(false);
    if (publish) {
      toast.success("ページを公開しました。LLM向けURLが有効になりました。");
    } else {
      toast.success("ページを保存しました");
    }
  };

  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>
        <Button variant="outline" onClick={fetchData}><RefreshCw className="h-4 w-4 mr-2" />再読み込み</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/">ダッシュボード</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href="/optimized-pages">ページ一覧</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>{isNew ? "新規作成" : (data?.title ?? "読み込み中...")}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{isNew ? "新規ページ作成" : "ページ編集"}</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleSave(false)} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            下書き保存
          </Button>
          <Button onClick={() => handleSave(true)} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Globe className="h-4 w-4 mr-2" />}
            公開
          </Button>
        </div>
      </div>

      {validationErrors.title || validationErrors.content ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>入力内容を確認してください。</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div className="space-y-6">
          <Tabs defaultValue="edit">
            <TabsList>
              <TabsTrigger value="edit">編集</TabsTrigger>
              <TabsTrigger value="preview">プレビュー</TabsTrigger>
              <TabsTrigger value="performance">パフォーマンス</TabsTrigger>
            </TabsList>

            <TabsContent value="edit" className="space-y-4">
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-[400px] w-full" />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="title" className={validationErrors.title ? "text-destructive" : ""}>
                      ページタイトル
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={title}
                      onChange={e => { setTitle(e.target.value); setIsDirty(true); }}
                      placeholder="AI最適化ページのタイトルを入力..."
                      className={validationErrors.title ? "border-destructive" : ""}
                    />
                    {validationErrors.title && <p className="text-sm text-destructive">{validationErrors.title}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content" className={validationErrors.content ? "text-destructive" : ""}>
                      マークダウンコンテンツ
                    </Label>
                    <Textarea
                      id="content"
                      name="content"
                      value={content}
                      onChange={e => { setContent(e.target.value); setIsDirty(true); }}
                      placeholder="ここにLLM向けマークダウンコンテンツを入力してください..."
                      className={`min-h-[400px] font-mono ${validationErrors.content ? "border-destructive" : ""}`}
                    />
                    {validationErrors.content && <p className="text-sm text-destructive">{validationErrors.content}</p>}
                    <p className="text-xs text-muted-foreground">{content.length}文字</p>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="preview">
              <Card>
                <CardContent className="p-6">
                  <ScrollArea className="h-[500px]">
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap text-sm">{content || "コンテンツを入力するとプレビューが表示されます。"}</pre>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance">
              {data ? (
                <Card>
                  <CardHeader><CardTitle>パフォーマンスデータ</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">引用数</p>
                        <p className="text-2xl font-bold">{data.citationCount}</p>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">トラフィック数</p>
                        <p className="text-2xl font-bold">{data.trafficCount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">保存後にパフォーマンスデータが表示されます。</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right sidebar - metadata */}
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">メタデータ設定</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label className={validationErrors.keigoLevel ? "text-destructive" : ""}>敬語レベル</Label>
                    <KeigoLevelSelector value={keigoLevel} onValueChange={v => { setKeigoLevel(v); setIsDirty(true); }} />
                    {validationErrors.keigoLevel && <p className="text-sm text-destructive">{validationErrors.keigoLevel}</p>}
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label className={validationErrors.industry ? "text-destructive" : ""}>業種</Label>
                    <Select value={industry} onValueChange={v => { setIndustry(v); setIsDirty(true); }}>
                      <SelectTrigger><SelectValue placeholder="業種を選択" /></SelectTrigger>
                      <SelectContent>
                        {industries.map(ind => (
                          <SelectItem key={ind.code} value={ind.code}>{ind.nameJa}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {validationErrors.industry && <p className="text-sm text-destructive">{validationErrors.industry}</p>}
                  </div>
                  {data && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <Label>ステータス</Label>
                        <div>
                          <Badge variant={data.status === "published" ? "default" : "secondary"}>
                            {data.status === "published" ? "公開中" : data.status === "draft" ? "下書き" : "アーカイブ"}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>URL</Label>
                        <p className="text-xs text-muted-foreground break-all">{data.url}</p>
                      </div>
                    </>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>変更を破棄しますか？</AlertDialogTitle>
            <AlertDialogDescription>保存されていない変更があります。このページを離れますか？</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>戻る</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground">離れる</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

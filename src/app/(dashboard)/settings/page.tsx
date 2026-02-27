"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { industries } from "@/lib/seed-data";
import { Save, Loader2, AlertCircle, Trash2 } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [projectName, setProjectName] = useState("テックナビ CRM");
  const [domain, setDomain] = useState("crm.technavi.co.jp");
  const [industry, setIndustry] = useState("saas");
  const [autoProbing, setAutoProbing] = useState(true);
  const [probingFrequency, setProbingFrequency] = useState("daily");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = async () => {
    const errors: Record<string, string> = {};
    if (!projectName) errors.projectName = "プロジェクト名は必須です";
    if (!domain) errors.domain = "ドメインは必須です";
    if (!industry) errors.industry = "業種は必須です";
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    toast.success("プロジェクト設定を保存しました");
  };

  const handleDelete = () => {
    toast.success("プロジェクトを削除しました");
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-2xl">
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}><CardContent className="pt-6"><Skeleton className="h-10 w-full mb-4" /><Skeleton className="h-10 w-full" /></CardContent></Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold">プロジェクト設定</h2>

      {Object.keys(validationErrors).length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>入力内容を確認してください。</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>基本情報</CardTitle>
          <CardDescription>プロジェクトの基本設定</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="projectName" className={validationErrors.projectName ? "text-destructive" : ""}>プロジェクト名</Label>
            <Input id="projectName" name="projectName" value={projectName} onChange={e => setProjectName(e.target.value)} className={validationErrors.projectName ? "border-destructive" : ""} />
            {validationErrors.projectName && <p className="text-sm text-destructive">{validationErrors.projectName}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="domain" className={validationErrors.domain ? "text-destructive" : ""}>ドメイン</Label>
            <Input id="domain" name="domain" value={domain} onChange={e => setDomain(e.target.value)} placeholder="example.co.jp" className={validationErrors.domain ? "border-destructive" : ""} />
            {validationErrors.domain && <p className="text-sm text-destructive">{validationErrors.domain}</p>}
          </div>
          <div className="space-y-2">
            <Label className={validationErrors.industry ? "text-destructive" : ""}>業種</Label>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {industries.map(ind => (
                  <SelectItem key={ind.code} value={ind.code}>{ind.nameJa}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {validationErrors.industry && <p className="text-sm text-destructive">{validationErrors.industry}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>プロービング設定</CardTitle>
          <CardDescription>自動プロービングの設定</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>自動プロービング</Label>
            <Switch checked={autoProbing} onCheckedChange={setAutoProbing} />
          </div>
          <div className="space-y-2">
            <Label>プロービング頻度</Label>
            <Select value={probingFrequency} onValueChange={setProbingFrequency} disabled={!autoProbing}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">毎日</SelectItem>
                <SelectItem value="weekly">週1回</SelectItem>
                <SelectItem value="monthly">月1回</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>通知設定</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label>メール通知</Label>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving} className="w-full">
        {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
        保存
      </Button>

      <Separator />

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">危険エリア</CardTitle>
          <CardDescription>この操作は取り消せません。</CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive"><Trash2 className="h-4 w-4 mr-2" />プロジェクト削除</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>プロジェクトを削除しますか？</AlertDialogTitle>
                <AlertDialogDescription>このプロジェクトとすべてのデータを削除しますか？この操作は元に戻せません。</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>キャンセル</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">削除</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}

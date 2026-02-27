"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { users, organizations } from "@/lib/seed-data";
import { Plus, AlertCircle } from "lucide-react";

const roleBadges: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  admin: { label: "管理者", variant: "default" },
  editor: { label: "編集者", variant: "secondary" },
  viewer: { label: "閲覧者", variant: "outline" },
};

export default function OrganizationPage() {
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("editor");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const org = organizations[0];
  const orgUsers = users.filter(u => u.organizationId === org.id);

  const handleInvite = () => {
    if (!inviteEmail) return;
    setInviteOpen(false);
    setInviteEmail("");
    toast.success("招待メールを送信しました");
  };

  const handleRemoveMember = (name: string) => {
    toast.success(`${name}を削除しました`);
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-3xl">
        <Skeleton className="h-8 w-48" />
        <Card><CardContent className="pt-6"><Skeleton className="h-20 w-full" /></CardContent></Card>
        <Card><CardContent className="pt-6"><Skeleton className="h-40 w-full" /></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-2xl font-bold">組織管理</h2>

      <Card>
        <CardHeader>
          <CardTitle>{org.name}</CardTitle>
          <CardDescription>組織の基本情報</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div><span className="text-muted-foreground">プラン</span><p className="font-medium capitalize">{org.plan}</p></div>
            <div><span className="text-muted-foreground">ドメイン</span><p className="font-medium">{org.domain}</p></div>
            <div><span className="text-muted-foreground">作成日</span><p className="font-medium">{new Date(org.createdAt).toLocaleDateString("ja-JP")}</p></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>メンバー</CardTitle>
            <CardDescription>{orgUsers.length}名のメンバー</CardDescription>
          </div>
          <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />メンバーを招待</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>メンバーを招待</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>メールアドレス</Label>
                  <Input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="user@example.co.jp" />
                </div>
                <div className="space-y-2">
                  <Label>権限</Label>
                  <Select value={inviteRole} onValueChange={setInviteRole}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">管理者</SelectItem>
                      <SelectItem value="editor">編集者</SelectItem>
                      <SelectItem value="viewer">閲覧者</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setInviteOpen(false)}>キャンセル</Button>
                <Button onClick={handleInvite}>招待</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>メンバー</TableHead>
                <TableHead>メールアドレス</TableHead>
                <TableHead>権限</TableHead>
                <TableHead>最終ログイン</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {orgUsers.map(u => {
                const rb = roleBadges[u.role];
                const initials = u.name.split(" ").map(n => n[0]).join("");
                return (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{u.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                    <TableCell><Badge variant={rb.variant}>{rb.label}</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{new Date(u.lastLoginAt).toLocaleDateString("ja-JP")}</TableCell>
                    <TableCell>
                      {u.role !== "admin" && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-destructive">削除</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>メンバーを削除しますか？</AlertDialogTitle>
                              <AlertDialogDescription>{u.name}をこの組織から削除します。</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>キャンセル</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleRemoveMember(u.name)} className="bg-destructive text-destructive-foreground">削除</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>プラン・請求情報</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div><span className="text-muted-foreground">プラン</span><p className="font-medium capitalize">{org.plan}</p></div>
            <div><span className="text-muted-foreground">月額料金</span><p className="font-medium">¥49,800</p></div>
            <div><span className="text-muted-foreground">次回更新日</span><p className="font-medium">2026年3月10日</p></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!email) errors.email = "メールアドレスは必須です";
    if (!password) errors.password = "パスワードは必須です";
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    setError(null);
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email === "tanaka@technavi.co.jp" && password === "password") {
      router.push("/");
    } else {
      setError("メールアドレスまたはパスワードが正しくありません。");
      setLoading(false);
    }
  };

  const handleSSO = () => {
    setLoading(true);
    setTimeout(() => router.push("/"), 1000);
  };

  return (
    <Card className="w-full max-w-[400px] mx-4">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground text-lg font-bold">
            P
          </div>
        </div>
        <CardTitle className="text-2xl">プロンプトナビ</CardTitle>
        <p className="text-sm text-muted-foreground">アカウントにログイン</p>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className={validationErrors.email ? "text-destructive" : ""}>メールアドレス</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="user@example.co.jp"
              className={validationErrors.email ? "border-destructive" : ""}
              disabled={loading}
            />
            {validationErrors.email && <p className="text-sm text-destructive">{validationErrors.email}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className={validationErrors.password ? "text-destructive" : ""}>パスワード</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="パスワードを入力"
              className={validationErrors.password ? "border-destructive" : ""}
              disabled={loading}
            />
            {validationErrors.password && <p className="text-sm text-destructive">{validationErrors.password}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            ログイン
          </Button>
        </form>

        <div className="relative my-4">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
            または
          </span>
        </div>

        <Button variant="outline" className="w-full" onClick={handleSSO} disabled={loading}>
          SSOでログイン
        </Button>
      </CardContent>
    </Card>
  );
}

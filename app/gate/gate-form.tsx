"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Khanda } from "@/components/khanda";

export function GateForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(false);

    const response = await fetch("/api/gate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (response.ok) {
      router.replace("/");
      router.refresh();
      return;
    }

    setLoading(false);
    setError(true);
    setPassword("");
  }

  return (
    <Card className="w-full max-w-sm glass-effect animate-fade-up text-center">
      <CardContent className="p-8">
        <div className="flex flex-col items-center">
          <Khanda className="w-14 h-14 text-gold animate-drift" />
          <h1 className="mt-5 text-3xl font-serif font-semibold text-memorial">
            Dr. Nirmal Singh Ahluwalia
          </h1>
          <p className="mt-1 text-sm text-ink-soft tracking-wide">
            27 September 1939 &ndash; 28 June 2026
          </p>
          <div className="gold-divider my-6 w-full text-xs">&#10022;</div>
          <p className="text-sm text-ink-soft mb-6">
            A place to remember and celebrate his life. Please enter the password
            you were given.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-ink-soft">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              autoFocus
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          {error && (
            <p className="text-sm text-destructive" role="alert">
              Incorrect password. Please try again.
            </p>
          )}
          <Button type="submit" className="w-full" disabled={loading || !password}>
            {loading ? "Checking..." : "Enter"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

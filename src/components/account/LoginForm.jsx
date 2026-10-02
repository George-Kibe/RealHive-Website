"use client"

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { buttonVariants } from "@/components/ui/button";
import { apiError, inputClass, safeNext } from "@/components/account/shared";

const LoginForm = () => {
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [unverified, setUnverified] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setUnverified(false);
    setLoading(true);
    try {
      await axios.post("/api/auth/session", { email, password });
      router.replace(next);
      router.refresh();
    } catch (err) {
      setUnverified(err.response?.status === 403);
      setError(apiError(err, "Sign in failed. Please try again."));
      setLoading(false);
    }
  };

  const query = `?next=${encodeURIComponent(next)}`;

  return (
    <>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium">Email</label>
          <input id="login-email" type="email" required autoComplete="email" value={email}
            onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        </div>
        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="login-password" className="block text-sm font-medium">Password</label>
            <Link href={`/forgot-password${query}`} className="text-xs text-muted-foreground hover:text-foreground">Forgot password?</Link>
          </div>
          <input id="login-password" type="password" required autoComplete="current-password" value={password}
            onChange={(e) => setPassword(e.target.value)} className={inputClass} />
        </div>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
            {unverified && (
              <> <Link href={`/register${query}&verify=${encodeURIComponent(email)}`} className="underline">Enter your code</Link></>
            )}
          </p>
        )}
        <button type="submit" disabled={loading} className={buttonVariants({ variant: "brand", className: "w-full" })}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New here? <Link href={`/register${query}`} className="font-semibold text-brand hover:underline">Create an account</Link>
      </p>
    </>
  );
};

export default LoginForm;

"use client"

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { buttonVariants } from "@/components/ui/button";
import { apiError, inputClass, safeNext } from "@/components/account/shared";

const MIN_PASSWORD_LENGTH = 8;

/**
 * Two steps: create the account (a 6-digit code is emailed), then enter the
 * code. After verifying, the user is signed in and sent back to `next`.
 * `?verify=<email>` opens straight on the code step (from the login page).
 */
const RegisterForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get("next"));
  const verifyEmail = searchParams.get("verify");

  const [step, setStep] = useState(verifyEmail ? "verify" : "register");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(verifyEmail ?? "");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const register = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    setLoading(true);
    try {
      await axios.post("/api/auth/users", { username, email, password });
      setStep("verify");
    } catch (err) {
      setError(apiError(err, "Couldn't create your account. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const verify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post("/api/auth/verify", { email, code: code.trim() });
      if (password) {
        // came straight from registering: sign in with the password we still have
        await axios.post("/api/auth/session", { email, password });
        router.replace(next);
        router.refresh();
      } else {
        router.replace(`/login?next=${encodeURIComponent(next)}`);
      }
    } catch (err) {
      setError(apiError(err, "That code didn't work. Please check it and try again."));
      setLoading(false);
    }
  };

  if (step === "verify") {
    return (
      <form onSubmit={verify} className="mt-8 space-y-4">
        <p className="text-sm text-muted-foreground">
          We emailed a 6-digit code to <span className="font-semibold text-foreground">{email || "your inbox"}</span>. It expires in 24 hours.
        </p>
        <div>
          <label htmlFor="verify-code" className="block text-sm font-medium">Verification code</label>
          <input id="verify-code" inputMode="numeric" autoComplete="one-time-code" required maxLength={6} value={code}
            onChange={(e) => setCode(e.target.value)} className={`${inputClass} tracking-[0.5em]`} />
        </div>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <button type="submit" disabled={loading} className={buttonVariants({ variant: "brand", className: "w-full" })}>
          {loading ? "Verifying…" : "Verify and continue"}
        </button>
      </form>
    );
  }

  return (
    <>
      <form onSubmit={register} className="mt-8 space-y-4">
        <div>
          <label htmlFor="reg-username" className="block text-sm font-medium">Display name</label>
          <input id="reg-username" required maxLength={50} autoComplete="nickname" value={username}
            onChange={(e) => setUsername(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label htmlFor="reg-email" className="block text-sm font-medium">Email</label>
          <input id="reg-email" type="email" required autoComplete="email" value={email}
            onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label htmlFor="reg-password" className="block text-sm font-medium">Password</label>
          <input id="reg-password" type="password" required minLength={MIN_PASSWORD_LENGTH} autoComplete="new-password" value={password}
            onChange={(e) => setPassword(e.target.value)} className={inputClass} />
          <p className="mt-1 text-xs text-muted-foreground">At least {MIN_PASSWORD_LENGTH} characters.</p>
        </div>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <button type="submit" disabled={loading} className={buttonVariants({ variant: "brand", className: "w-full" })}>
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account? <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-semibold text-brand hover:underline">Sign in</Link>
      </p>
    </>
  );
};

export default RegisterForm;

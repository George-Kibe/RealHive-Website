"use client"

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { buttonVariants } from "@/components/ui/button";
import { apiError, inputClass, safeNext } from "@/components/account/shared";

const MIN_PASSWORD_LENGTH = 8;

// Step 1: email a reset code. Step 2: enter the code and a new password.
// `loginHref` overrides where "Sign in" goes (the admin flow uses /admin/login).
const ForgotPasswordForm = ({ loginHref: loginHrefOverride }) => {
  const next = safeNext(useSearchParams().get("next"));
  const [step, setStep] = useState("request");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const request = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post("/api/auth/forgot-password", { email });
      setStep("reset");
    } catch (err) {
      setError(apiError(err, "Couldn't send the reset code. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const reset = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    setLoading(true);
    try {
      await axios.post("/api/auth/reset-password", { email, otp: otp.trim(), password });
      setStep("done");
    } catch (err) {
      setError(apiError(err, "That code didn't work. Please check it and try again."));
    } finally {
      setLoading(false);
    }
  };

  const loginHref = loginHrefOverride ?? `/login?next=${encodeURIComponent(next)}`;

  if (step === "done") {
    return (
      <div className="mt-8 space-y-4 text-sm">
        <p>Your password has been reset.</p>
        <Link href={loginHref} className={buttonVariants({ variant: "brand", className: "w-full" })}>Sign in</Link>
      </div>
    );
  }

  if (step === "reset") {
    return (
      <form onSubmit={reset} className="mt-8 space-y-4">
        <p className="text-sm text-muted-foreground">
          We emailed a 6-digit code to <span className="font-semibold text-foreground">{email}</span>. It expires in 10 minutes.
        </p>
        <div>
          <label htmlFor="reset-code" className="block text-sm font-medium">Reset code</label>
          <input id="reset-code" inputMode="numeric" autoComplete="one-time-code" required maxLength={6} value={otp}
            onChange={(e) => setOtp(e.target.value)} className={`${inputClass} tracking-[0.5em]`} />
        </div>
        <div>
          <label htmlFor="reset-password" className="block text-sm font-medium">New password</label>
          <input id="reset-password" type="password" required minLength={MIN_PASSWORD_LENGTH} autoComplete="new-password" value={password}
            onChange={(e) => setPassword(e.target.value)} className={inputClass} />
        </div>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <button type="submit" disabled={loading} className={buttonVariants({ variant: "brand", className: "w-full" })}>
          {loading ? "Resetting…" : "Reset password"}
        </button>
      </form>
    );
  }

  return (
    <>
      <form onSubmit={request} className="mt-8 space-y-4">
        <div>
          <label htmlFor="forgot-email" className="block text-sm font-medium">Email</label>
          <input id="forgot-email" type="email" required autoComplete="email" value={email}
            onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        </div>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <button type="submit" disabled={loading} className={buttonVariants({ variant: "brand", className: "w-full" })}>
          {loading ? "Sending…" : "Email me a reset code"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Remembered it? <Link href={loginHref} className="font-semibold text-brand hover:underline">Sign in</Link>
      </p>
    </>
  );
};

export default ForgotPasswordForm;

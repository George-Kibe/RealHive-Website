"use client"

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { buttonVariants } from "@/components/ui/button";

const inputClass =
  "w-full rounded-md border-0 bg-muted text-foreground placeholder:text-muted-foreground px-3.5 py-2 shadow-xs ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6";

const AdminLoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post("/api/admin/login", { email, password });
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(
        err.response?.status === 401
          ? "Invalid email or password."
          : err.response?.status === 422
            ? "Please enter your email and password."
            : "Login failed. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <div>
        <label htmlFor="admin-email" className="block text-sm font-medium">Email</label>
        <input
          id="admin-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`mt-1 ${inputClass}`}
        />
      </div>
      <div>
        <div className="flex items-baseline justify-between">
          <label htmlFor="admin-password" className="block text-sm font-medium">Password</label>
          <Link href="/admin/forgot-password" className="text-xs text-muted-foreground hover:text-foreground">Forgot password?</Link>
        </div>
        <input
          id="admin-password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`mt-1 ${inputClass}`}
        />
      </div>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className={buttonVariants({ variant: "brand", className: "w-full" })}
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
};

export default AdminLoginForm;

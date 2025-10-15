"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Login failed");
      }
      router.replace("/dashboard/client");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDemo() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/demo", { method: "POST" });
      if (!res.ok) throw new Error("Demo login failed");
      router.replace("/dashboard/client");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow px-6 py-8 space-y-6">
        <div className="flex flex-col items-center gap-3">
          <div className="h-14 w-14 rounded-2xl bg-indigo-600 flex items-center justify-center">
            {/* briefcase icon */}
            <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M9 6V5a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v1" strokeLinecap="round"/>
              <rect x="3" y="7" width="18" height="13" rx="2"/>
              <path d="M3 12h18"/>
            </svg>
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold text-gray-900">Welcome back</h1>
            <p className="text-sm text-gray-500">Sign in to your ClientHub account</p>
          </div>
        </div>

        {error ? (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-2">{error}</div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-700">Email</label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M4 6h16v12H4z"/>
                  <path d="m22 6-10 7L2 6"/>
                </svg>
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-gray-700">Password</label>
              <a className="text-xs text-indigo-600 hover:underline cursor-pointer">Forgot password?</a>
            </div>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
                  <path d="M6 10V8a6 6 0 1 1 12 0v2"/>
                  <rect x="4" y="10" width="16" height="10" rx="2"/>
                </svg>
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200"/>
          <span className="text-xs text-gray-400">or</span>
          <div className="h-px flex-1 bg-gray-200"/>
        </div>

        <div className="text-center text-sm text-gray-600">
          Don't have an account? <Link href="/signup" className="text-indigo-600 hover:underline">Sign up</Link>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-gray-400 text-center">Quick demo access:</p>
          <button
            onClick={handleDemo}
            disabled={loading}
            className="w-full bg-gray-900 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-black disabled:opacity-50 cursor-pointer"
          >
            Demo account
          </button>
        </div>
      </div>
    </div>
  );
}



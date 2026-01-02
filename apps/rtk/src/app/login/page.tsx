"use client"

import { useState } from "react"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Important: if the API uses cookies itself, you'd add:
        // credentials: "include",
        body: JSON.stringify({ username, password }),
      })

      if (res.status === 401) {
        setError("Wrong username or password.")
        return
      }

      if (!res.ok) {
        setError(`Login failed (HTTP ${res.status}).`)
        return
      }

      const data: unknown = await res.json()
      const token = (data as any)?.token as string | undefined

      if (!token) {
        setError("Login failed: no token returned.")
        return
      }

      // Set cookie (client-side; NOT HttpOnly)
      // 7 days expiry; adjust if you want session-only.
      const maxAgeSeconds = 60 * 60 * 24 * 7
      document.cookie = [
        `TOKEN=${encodeURIComponent(token)}`,
        "Path=/",
        `Max-Age=${maxAgeSeconds}`,
        "SameSite=Lax",
        "Secure",
      ].join("; ")

      // Redirect
      window.location.href = process.env.NEXT_PUBLIC_BASE_URL || "/"
    } catch (err) {
      setError("Network error. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-sm px-6">
        <h1 className="text-white text-3xl font-semibold text-center mb-8">
          Login
        </h1>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full px-4 py-3 bg-zinc-900 text-white placeholder-zinc-500 border border-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
            autoComplete="username"
            required
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            className="w-full px-4 py-3 bg-zinc-900 text-white placeholder-zinc-500 border border-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
            autoComplete="current-password"
            required
          />

          {error && (
            <div className="w-full rounded-md border border-red-900 bg-red-950/40 px-4 py-3 text-red-200 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-white text-black font-medium rounded-md hover:bg-zinc-200 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  )
}
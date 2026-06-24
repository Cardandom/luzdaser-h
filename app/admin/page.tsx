"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { supabase } from "@/lib/supabase/client"

export default function AdminPlaceholderPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    setError(null)

    try {
      const { error: signOutError } = await supabase.auth.signOut()

      if (signOutError) {
        throw signOutError
      }

      router.replace("/client-login")
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not sign out right now.",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
            Admin
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            Admin dashboard placeholder - coming next
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            This page is only here to confirm the authentication redirect flow.
          </p>

          {error ? (
            <div
              className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
              aria-live="polite"
            >
              {error}
            </div>
          ) : null}

          <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
            className="mt-6 inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Signing out..." : "Log out"}
          </button>
        </section>
      </div>
    </main>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { supabase } from "@/lib/supabase/client"

type PropertyRow = {
  id: string | number
  property_number: string | number | null
  progress: string | number | null
  status: string | null
  created_at: string | null
}

function formatValue(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return "N/A"
  }

  return String(value)
}

function formatDate(value: string | null) {
  if (!value) {
    return "N/A"
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

function getProgressValue(progress: string | number | null | undefined) {
  if (progress === null || progress === undefined || progress === "") {
    return 0
  }

  const numericValue = Number.parseFloat(String(progress).replace("%", ""))

  if (Number.isNaN(numericValue)) {
    return 0
  }

  return Math.min(100, Math.max(0, numericValue))
}

export default function ClientPlaceholderPage() {
  const router = useRouter()
  const [properties, setProperties] = useState<PropertyRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let isActive = true

    const loadProperties = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (!isActive) {
        return
      }

      if (userError || !user) {
        router.replace("/client-login")
        return
      }

      const { data, error: propertiesError } = await supabase
        .from("properties")
        .select("id, property_number, progress, status, created_at")
        .eq("buyer_id", user.id)
        .order("created_at", { ascending: false })

      if (!isActive) {
        return
      }

      if (propertiesError) {
        setError(propertiesError.message)
        setProperties([])
      } else {
        setProperties((data ?? []) as PropertyRow[])
      }

      setIsLoading(false)
    }

    loadProperties()

    return () => {
      isActive = false
    }
  }, [router])

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
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                Client
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                My properties
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-600">
                Temporary client page to verify the logged-in buyer can see their
                assigned properties.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Signing out..." : "Log out"}
            </button>
          </div>

          {error ? (
            <div
              className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
              aria-live="polite"
            >
              {error}
            </div>
          ) : null}
        </section>

        <section className="space-y-4">
          {isLoading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-sm text-slate-600 shadow-sm">
              Loading properties...
            </div>
          ) : properties.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-sm text-slate-600 shadow-sm">
              No properties assigned to this account yet.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {properties.map((property) => {
                const progressValue = getProgressValue(property.progress)

                return (
                  <article
                    key={String(property.id)}
                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                          Property
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                          {formatValue(property.property_number)}
                        </h2>
                      </div>

                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-600">
                        {formatValue(property.status)}
                      </span>
                    </div>

                    <div className="mt-6 space-y-3">
                      <div className="flex items-center justify-between text-sm text-slate-600">
                        <span>Progress</span>
                        <span className="font-medium text-slate-900">
                          {formatValue(property.progress)}
                        </span>
                      </div>
                      <div
                        className="h-2 w-full overflow-hidden rounded-full bg-slate-100"
                        aria-hidden="true"
                      >
                        <div
                          className="h-full rounded-full bg-linear-to-r from-slate-700 to-slate-950 transition-all"
                          style={{ width: `${progressValue}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-6 border-t border-slate-100 pt-4 text-sm text-slate-600">
                      <span className="block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                        Created
                      </span>
                      <span className="mt-1 block">{formatDate(property.created_at)}</span>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

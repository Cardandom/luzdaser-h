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

type PropertyUpdateRow = {
  id: string | number
  property_id: string | number
  title: string | null
  description: string | null
  progress: string | number | null
  update_date: string | null
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

function formatProgressPercentage(
  progress: string | number | null | undefined,
) {
  if (progress === null || progress === undefined || progress === "") {
    return "N/A"
  }

  const value = String(progress)

  return value.includes("%") ? value : `${value}%`
}

export default function ClientPlaceholderPage() {
  const router = useRouter()
  const [properties, setProperties] = useState<PropertyRow[]>([])
  const [updatesByPropertyId, setUpdatesByPropertyId] = useState<
    Record<string, PropertyUpdateRow[]>
  >({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let isActive = true

    const loadPropertiesAndUpdates = async () => {
      setError(null)
      setIsLoading(true)

      try {
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

        const { data: propertyData, error: propertiesError } = await supabase
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
          setUpdatesByPropertyId({})
          return
        }

        const propertyRows = (propertyData ?? []) as PropertyRow[]
        setProperties(propertyRows)

        if (propertyRows.length === 0) {
          setUpdatesByPropertyId({})
          return
        }

        const propertyIds = propertyRows.map((property) => String(property.id))

        const { data: updateData, error: updatesError } = await supabase
          .from("property_updates")
          .select(
            "id, property_id, title, description, progress, update_date, created_at",
          )
          .in("property_id", propertyIds)
          .order("update_date", { ascending: true })

        if (!isActive) {
          return
        }

        if (updatesError) {
          setError(updatesError.message)
          setUpdatesByPropertyId({})
          return
        }

        const groupedUpdates: Record<string, PropertyUpdateRow[]> = {}

        for (const update of (updateData ?? []) as PropertyUpdateRow[]) {
          const propertyKey = String(update.property_id)

          if (!groupedUpdates[propertyKey]) {
            groupedUpdates[propertyKey] = []
          }

          groupedUpdates[propertyKey].push(update)
        }

        setUpdatesByPropertyId(groupedUpdates)
      } catch (err) {
        if (isActive) {
          setError(
            err instanceof Error ? err.message : "Could not load properties.",
          )
          setProperties([])
          setUpdatesByPropertyId({})
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadPropertiesAndUpdates()

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
                const propertyUpdates =
                  updatesByPropertyId[String(property.id)] ?? []

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

                    <div className="mt-6 border-t border-slate-100 pt-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                        Updates
                      </p>

                      {propertyUpdates.length === 0 ? (
                        <p className="mt-3 text-sm text-slate-600">
                          No updates available for this property yet.
                        </p>
                      ) : (
                        <div className="mt-4 space-y-4">
                          {propertyUpdates.map((update, index) => (
                            <div key={String(update.id)} className="relative pl-5">
                              <span className="absolute left-0 top-2 h-2.5 w-2.5 rounded-full bg-slate-900" />
                              {index < propertyUpdates.length - 1 ? (
                                <span className="absolute left-1.5 top-5 bottom-0 w-px bg-slate-200" />
                              ) : null}

                              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                  <div>
                                    <h3 className="font-medium text-slate-950">
                                      {formatValue(update.title)}
                                    </h3>
                                    <p className="mt-1 text-sm leading-6 text-slate-600">
                                      {formatValue(update.description)}
                                    </p>
                                  </div>

                                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-700">
                                    {formatProgressPercentage(update.progress)}
                                  </span>
                                </div>

                                <div className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                                  {formatDate(update.update_date)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
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

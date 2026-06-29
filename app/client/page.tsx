"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { supabase } from "@/lib/supabase/client"
import { getProfileForUser } from "@/lib/supabase/profiles"

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

type PropertyFileRow = {
  id: string | number
  property_id: string | number
  file_name: string | null
  file_path: string | null
  file_type: string | null
  description: string | null
  created_at: string | null
}

type PropertyFileDisplayRow = PropertyFileRow & {
  signedUrl: string | null
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

function getFirstName(fullName: string | null | undefined) {
  if (!fullName) {
    return null
  }

  const [firstName] = fullName.trim().split(/\s+/)

  return firstName || null
}

function isPdfFile(fileType: string | null | undefined) {
  return String(fileType ?? "").toLowerCase() === "pdf"
}

export default function ClientPlaceholderPage() {
  const router = useRouter()
  const [properties, setProperties] = useState<PropertyRow[]>([])
  const [updatesByPropertyId, setUpdatesByPropertyId] = useState<
    Record<string, PropertyUpdateRow[]>
  >({})
  const [filesByPropertyId, setFilesByPropertyId] = useState<
    Record<string, PropertyFileDisplayRow[]>
  >({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [profileFullName, setProfileFullName] = useState<string | null>(null)

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

        const profile = await getProfileForUser(user.id).catch(() => null)

        if (!isActive) {
          return
        }

        setProfileFullName(
          typeof profile?.full_name === "string" ? profile.full_name : null,
        )

        if (String(profile?.role ?? "").toLowerCase() === "admin") {
          router.replace("/admin")
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
          setFilesByPropertyId({})
          return
        }

        const propertyRows = (propertyData ?? []) as PropertyRow[]
        setProperties(propertyRows)

        if (propertyRows.length === 0) {
          setUpdatesByPropertyId({})
          setFilesByPropertyId({})
          return
        }

        const propertyIds = propertyRows.map((property) => String(property.id))

        const [
          { data: updateData, error: updatesError },
          { data: fileData, error: filesError },
        ] = await Promise.all([
          supabase
            .from("property_updates")
            .select(
              "id, property_id, title, description, progress, update_date, created_at",
            )
            .in("property_id", propertyIds)
            .order("update_date", { ascending: true }),
          supabase
            .from("property_files")
            .select(
              "id, property_id, file_name, file_path, file_type, description, created_at",
            )
            .in("property_id", propertyIds)
            .order("created_at", { ascending: true }),
        ])

        if (!isActive) {
          return
        }

        if (updatesError) {
          setError(updatesError.message)
          setUpdatesByPropertyId({})
          setFilesByPropertyId({})
          return
        }

        if (filesError) {
          setError(filesError.message)
          setUpdatesByPropertyId({})
          setFilesByPropertyId({})
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

        const filesWithSignedUrls = await Promise.all(
          ((fileData ?? []) as PropertyFileRow[]).map(async (file) => {
            if (!file.file_path) {
              return { ...file, signedUrl: null }
            }

            const { data, error: signedUrlError } = await supabase.storage
              .from("property-files")
              .createSignedUrl(String(file.file_path), 3600)

            if (signedUrlError || !data?.signedUrl) {
              return { ...file, signedUrl: null }
            }

            return { ...file, signedUrl: data.signedUrl }
          }),
        )

        const groupedFiles: Record<string, PropertyFileDisplayRow[]> = {}

        for (const file of filesWithSignedUrls) {
          const propertyKey = String(file.property_id)

          if (!groupedFiles[propertyKey]) {
            groupedFiles[propertyKey] = []
          }

          groupedFiles[propertyKey].push(file)
        }

        setUpdatesByPropertyId(groupedUpdates)
        setFilesByPropertyId(groupedFiles)
      } catch (err) {
        if (isActive) {
          setError(
            err instanceof Error ? err.message : "Could not load properties.",
          )
          setProperties([])
          setUpdatesByPropertyId({})
          setFilesByPropertyId({})
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

  const firstName = getFirstName(profileFullName)

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 sm:gap-8">
        <section className="luxury-panel rounded-3xl p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <span className="luxury-eyebrow inline-flex items-center rounded-full border border-luxury-border bg-white px-3 py-1.5 text-[0.7rem] font-semibold text-slate-600">
                Client portal
              </span>
              <div className="space-y-3">
                <h1 className="luxury-title-sm text-slate-950">
                  {firstName ? `Welcome back, ${firstName}` : "Welcome back"}
                </h1>
                <p className="luxury-copy max-w-2xl text-sm sm:text-base">
                  Here you can review the current status of your property
                  investment, including progress, construction updates, and
                  private files.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:items-end">
              <div className="inline-flex items-center rounded-full border border-luxury-border bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
                {properties.length} assigned properties
              </div>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
              >
                Back to website
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loading}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Signing out..." : "Log out"}
              </button>
            </div>
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

        {isLoading ? (
          <section className="luxury-card rounded-3xl border border-slate-200 p-8 text-sm text-slate-600">
            Loading your properties and updates...
          </section>
        ) : properties.length === 0 ? (
          <section className="luxury-card rounded-3xl border border-slate-200 p-8 text-sm text-slate-600">
            No properties are assigned to this account yet. Once your
            investment is linked, it will appear here with progress, timeline
            updates, and private files.
          </section>
        ) : (
          <div className="grid gap-6">
            {properties.map((property) => {
              const progressValue = getProgressValue(property.progress)
              const propertyUpdates =
                updatesByPropertyId[String(property.id)] ?? []
              const propertyFiles = filesByPropertyId[String(property.id)] ?? []

              return (
                <article
                  key={String(property.id)}
                  className="luxury-card overflow-hidden rounded-3xl border border-slate-200 p-6 shadow-sm sm:p-7"
                >
                  <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">
                        Property
                      </p>
                      <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                        {formatValue(property.property_number)}
                      </h2>
                      <p className="text-sm text-slate-600">
                        Created {formatDate(property.created_at)}
                      </p>
                    </div>

                    <div className="flex flex-col items-start gap-2 sm:items-end">
                      <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-600">
                        {formatValue(property.status)}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                        Current progress
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                    <div className="space-y-6">
                      <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 sm:p-5">
                        <div className="flex items-center justify-between text-sm text-slate-600">
                          <span>Progress</span>
                          <span className="font-semibold text-slate-950">
                            {formatProgressPercentage(property.progress)}
                          </span>
                        </div>
                        <div
                          className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100"
                          aria-hidden="true"
                        >
                          <div
                            className="h-full rounded-full bg-linear-to-r from-luxury-gold-soft via-luxury-gold to-slate-900 transition-all"
                            style={{ width: `${progressValue}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                            Timeline
                          </p>
                          <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                            {propertyUpdates.length} updates
                          </span>
                        </div>

                        {propertyUpdates.length === 0 ? (
                          <div className="rounded-2xl border border-slate-100 bg-white px-5 py-4 text-sm text-slate-600">
                            No updates have been shared for this property yet.
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {propertyUpdates.map((update, index) => (
                              <div key={String(update.id)} className="relative pl-6">
                                <span className="absolute left-0 top-2.5 h-3 w-3 rounded-full bg-luxury-gold shadow-sm" />
                                {index < propertyUpdates.length - 1 ? (
                                  <span className="absolute left-1.5 top-6 bottom-0 w-px bg-slate-200" />
                                ) : null}

                                <article className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="space-y-1">
                                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                                        {formatDate(update.update_date)}
                                      </p>
                                      <h3 className="text-base font-semibold text-slate-950">
                                        {formatValue(update.title)}
                                      </h3>
                                    </div>

                                    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-700">
                                      {formatProgressPercentage(update.progress)}
                                    </span>
                                  </div>

                                  <p className="mt-3 text-sm leading-6 text-slate-600">
                                    {formatValue(update.description)}
                                  </p>
                                </article>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                          Files
                        </p>
                        <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                          Private downloads
                        </span>
                      </div>

                      {propertyFiles.length === 0 ? (
                        <div className="rounded-2xl border border-slate-100 bg-white px-5 py-4 text-sm text-slate-600">
                          No files are available for this property yet.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {propertyFiles.map((file) => {
                            const pdf = isPdfFile(file.file_type)

                            return (
                              <article
                                key={String(file.id)}
                                className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
                              >
                                <div className="flex flex-col gap-4">
                                  {file.signedUrl && !pdf ? (
                                    <div className="aspect-video overflow-hidden rounded-2xl bg-slate-100">
                                      <img
                                        src={file.signedUrl}
                                        alt={formatValue(file.file_name)}
                                        className="h-full w-full object-cover"
                                      />
                                    </div>
                                  ) : (
                                    <div className="aspect-video rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5">
                                      <div className="flex h-full flex-col justify-between">
                                        <div>
                                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                                            {pdf ? "PDF document" : "File preview"}
                                          </p>
                                          <h3 className="mt-2 text-lg font-semibold text-slate-950">
                                            {formatValue(file.file_name)}
                                          </h3>
                                        </div>

                                        <span className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-600">
                                          {formatValue(file.file_type)}
                                        </span>
                                      </div>
                                    </div>
                                  )}

                                  <div className="space-y-3">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                      <div className="min-w-0">
                                        <h3 className="font-semibold text-slate-950">
                                          {formatValue(file.file_name)}
                                        </h3>
                                        <p className="mt-1 text-sm leading-6 text-slate-600">
                                          {formatValue(file.description)}
                                        </p>
                                      </div>

                                      <span className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-600">
                                        {formatValue(file.file_type)}
                                      </span>
                                    </div>

                                    {pdf && file.signedUrl ? (
                                      <a
                                        href={file.signedUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
                                      >
                                        Open PDF
                                      </a>
                                    ) : null}

                                    {file.signedUrl ? null : (
                                      <p className="text-sm text-slate-500">
                                        Preview unavailable right now.
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </article>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

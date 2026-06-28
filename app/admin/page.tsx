"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"

import { supabase } from "@/lib/supabase/client"

type AdminProfileRow = {
  id: string | number
  full_name: string | null
  email: string | null
  role: string | null
  created_at: string | null
}

type BuyerProfileRow = {
  id: string | number
  full_name: string | null
  email: string | null
  role: string | null
}

type PropertyRow = {
  id: string | number
  property_number: string | number | null
  buyer_id: string | number | null
  progress: string | number | null
  status: string | null
  created_at: string | null
}

type PropertyUpdateRow = {
  id: string | number
  property_id: string | number | null
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

function formatProgressPercentage(
  progress: string | number | null | undefined,
) {
  if (progress === null || progress === undefined || progress === "") {
    return "N/A"
  }

  const value = String(progress)

  return value.includes("%") ? value : `${value}%`
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

export default function AdminOverviewPage() {
  const router = useRouter()
  const [adminProfile, setAdminProfile] = useState<AdminProfileRow | null>(null)
  const [buyers, setBuyers] = useState<BuyerProfileRow[]>([])
  const [properties, setProperties] = useState<PropertyRow[]>([])
  const [propertyUpdates, setPropertyUpdates] = useState<PropertyUpdateRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [refreshIndex, setRefreshIndex] = useState(0)
  const [buyerFullName, setBuyerFullName] = useState("")
  const [buyerEmail, setBuyerEmail] = useState("")
  const [buyerPhone, setBuyerPhone] = useState("")
  const [buyerPassword, setBuyerPassword] = useState("")
  const [isCreatingBuyer, setIsCreatingBuyer] = useState(false)
  const [buyerError, setBuyerError] = useState<string | null>(null)
  const [buyerSuccess, setBuyerSuccess] = useState<string | null>(null)

  useEffect(() => {
    let isActive = true

    const loadOverview = async () => {
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

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id, full_name, email, role, created_at")
          .eq("id", user.id)
          .maybeSingle()

        if (!isActive) {
          return
        }

        if (profileError) {
          throw profileError
        }

        if (!profileData) {
          await supabase.auth.signOut()
          router.replace("/client-login")
          return
        }

        if (String(profileData.role ?? "").toLowerCase() !== "admin") {
          router.replace("/client")
          return
        }

        setAdminProfile(profileData as AdminProfileRow)

        const [propertiesResult, buyersResult, updatesResult] = await Promise.all([
          supabase
            .from("properties")
            .select("id, property_number, buyer_id, progress, status, created_at")
            .order("created_at", { ascending: false }),
          supabase
            .from("profiles")
            .select("id, full_name, email, role")
            .eq("role", "client")
            .order("full_name", { ascending: true }),
          supabase
            .from("property_updates")
            .select("id, property_id")
            .order("created_at", { ascending: false }),
        ])

        if (!isActive) {
          return
        }

        if (propertiesResult.error) {
          throw propertiesResult.error
        }

        if (buyersResult.error) {
          throw buyersResult.error
        }

        if (updatesResult.error) {
          throw updatesResult.error
        }

        setProperties((propertiesResult.data ?? []) as PropertyRow[])
        setBuyers((buyersResult.data ?? []) as BuyerProfileRow[])
        setPropertyUpdates((updatesResult.data ?? []) as PropertyUpdateRow[])
      } catch (caughtError) {
        if (isActive) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Could not load the admin overview.",
          )
          setAdminProfile(null)
          setProperties([])
          setBuyers([])
          setPropertyUpdates([])
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadOverview()

    return () => {
      isActive = false
    }
  }, [refreshIndex, router])

  const handleCreateBuyer = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBuyerError(null)
    setBuyerSuccess(null)
    setIsCreatingBuyer(true)

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.replace("/client-login")
        return
      }

      const response = await fetch("/api/admin/buyers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          full_name: buyerFullName,
          email: buyerEmail,
          phone: buyerPhone,
          password: buyerPassword,
        }),
      })

      const payload = (await response.json().catch(() => null)) as
        | { buyer?: unknown; error?: string }
        | null

      if (!response.ok) {
        throw new Error(payload?.error ?? "Could not create the buyer.")
      }

      setBuyerFullName("")
      setBuyerEmail("")
      setBuyerPhone("")
      setBuyerPassword("")
      setBuyerSuccess("Buyer created successfully.")
      setRefreshIndex((value) => value + 1)
    } catch (caughtError) {
      setBuyerError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not create the buyer.",
      )
    } finally {
      setIsCreatingBuyer(false)
    }
  }

  const handleLogout = async () => {
    setLoading(true)
    setError(null)

    try {
      const { error: signOutError } = await supabase.auth.signOut()

      if (signOutError) {
        throw signOutError
      }

      router.replace("/client-login")
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not sign out right now.",
      )
    } finally {
      setLoading(false)
    }
  }

  const buyerById = buyers.reduce<Record<string, BuyerProfileRow>>((acc, buyer) => {
    acc[String(buyer.id)] = buyer
    return acc
  }, {})

  const updateCountByPropertyId = propertyUpdates.reduce<
    Record<string, number>
  >((acc, update) => {
    const propertyId = String(update.property_id ?? "")

    if (!propertyId) {
      return acc
    }

    acc[propertyId] = (acc[propertyId] ?? 0) + 1
    return acc
  }, {})

  const totalProperties = properties.length
  const totalBuyers = buyers.length
  const totalUpdates = propertyUpdates.length

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                Admin overview
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                Reina Sophia Admin Dashboard
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-600">
                Temporary overview for checking access, counts, and property
                records before the full dashboard is built.
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

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                Create buyer
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                Secure buyer creation
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-slate-600">
                Temporary admin form for creating authenticated buyer accounts.
              </p>
            </div>
          </div>

          <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleCreateBuyer}>
            <div className="space-y-2">
              <label
                htmlFor="buyer-full-name"
                className="text-sm font-medium text-slate-700"
              >
                Full name
              </label>
              <input
                id="buyer-full-name"
                type="text"
                value={buyerFullName}
                onChange={(event) => setBuyerFullName(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                placeholder="Buyer name"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="buyer-email"
                className="text-sm font-medium text-slate-700"
              >
                Email
              </label>
              <input
                id="buyer-email"
                type="email"
                autoComplete="email"
                value={buyerEmail}
                onChange={(event) => setBuyerEmail(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                placeholder="buyer@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="buyer-phone"
                className="text-sm font-medium text-slate-700"
              >
                Phone
              </label>
              <input
                id="buyer-phone"
                type="tel"
                autoComplete="tel"
                value={buyerPhone}
                onChange={(event) => setBuyerPhone(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                placeholder="+1 555 000 0000"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="buyer-password"
                className="text-sm font-medium text-slate-700"
              >
                Temporary password
              </label>
              <input
                id="buyer-password"
                type="password"
                autoComplete="new-password"
                value={buyerPassword}
                onChange={(event) => setBuyerPassword(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                placeholder="Temporary password"
                required
              />
            </div>

            {buyerError ? (
              <div
                className="md:col-span-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
                aria-live="polite"
              >
                {buyerError}
              </div>
            ) : null}

            {buyerSuccess ? (
              <div
                className="md:col-span-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
                aria-live="polite"
              >
                {buyerSuccess}
              </div>
            ) : null}

            <div className="md:col-span-2 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={isCreatingBuyer}
                className="inline-flex items-center justify-center rounded-full bg-linear-to-b from-luxury-gold-soft to-luxury-gold px-5 py-3 text-sm font-semibold text-stone-950 shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isCreatingBuyer ? "Creating buyer..." : "Create Buyer"}
              </button>
              <span className="text-sm text-slate-500">
                This creates a client auth user and profile row.
              </span>
            </div>
          </form>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Admin
            </p>
            <h2 className="mt-3 text-xl font-semibold text-slate-950">
              {formatValue(adminProfile?.full_name)}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {formatValue(adminProfile?.email)}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Properties
            </p>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
              {totalProperties}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Buyers
            </p>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
              {totalBuyers}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Updates
            </p>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
              {totalUpdates}
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          {isLoading ? (
            <div className="p-8 text-sm text-slate-600">Loading admin overview...</div>
          ) : totalProperties === 0 ? (
            <div className="p-8">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
                No properties found yet.
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    <th scope="col" className="px-6 py-4">
                      Property
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Buyer
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Progress
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Updates
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {properties.map((property) => {
                    const buyer = buyerById[String(property.buyer_id ?? "")]
                    const progressValue = getProgressValue(property.progress)
                    const updateCount =
                      updateCountByPropertyId[String(property.id)] ?? 0

                    return (
                      <tr key={String(property.id)} className="hover:bg-slate-50/70">
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-950">
                            {formatValue(property.property_number)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-700">
                          {formatValue(buyer?.full_name)}
                        </td>
                        <td className="px-6 py-4 text-slate-700">
                          {formatValue(buyer?.email)}
                        </td>
                        <td className="px-6 py-4 text-slate-700">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                              <span>{formatProgressPercentage(property.progress)}</span>
                            </div>
                            <div className="h-2 w-40 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full bg-linear-to-r from-slate-700 to-slate-950"
                                style={{ width: `${progressValue}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-600">
                            {formatValue(property.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-700">
                          {updateCount}
                        </td>
                        <td className="px-6 py-4 text-slate-700">
                          {formatDate(property.created_at)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

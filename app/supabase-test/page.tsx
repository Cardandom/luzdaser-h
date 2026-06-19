import { connection } from "next/server"
import { supabase } from "@/lib/supabase/client"

type PropertyRow = {
  id: string | number
  property_number: string | number | null
  buyer_name: string | null
  buyer_email: string | null
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

function getStatusStyles(status: string | null) {
  const normalized = status?.toLowerCase() ?? ""

  if (normalized.includes("complete") || normalized.includes("done")) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700"
  }

  if (normalized.includes("pending") || normalized.includes("hold")) {
    return "border-amber-200 bg-amber-50 text-amber-700"
  }

  if (normalized.includes("cancel") || normalized.includes("reject")) {
    return "border-rose-200 bg-rose-50 text-rose-700"
  }

  return "border-slate-200 bg-slate-50 text-slate-700"
}

export const dynamic = "force-dynamic"

export default async function SupabaseTestPage() {
  await connection()

  const { data, error } = await supabase
    .from("properties")
    .select(
      "id, property_number, buyer_name, buyer_email, progress, status, created_at",
    )
    .order("created_at", { ascending: false })

  const properties = (data ?? []) as PropertyRow[]
  const totalProperties = properties.length

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                Supabase Test
              </p>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Properties table preview
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-600">
                Temporary route for checking the `properties` table connection and
                validating the data shape before building the dashboard.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                Records
              </p>
              <p className="mt-1 text-2xl font-semibold">{totalProperties}</p>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {error ? (
            <div className="p-10">
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-rose-700">
                  Data fetch failed
                </p>
                <p className="mt-2 text-lg font-medium text-rose-900">
                  Could not load rows from the properties table
                </p>
                <p className="mt-2 text-sm leading-6 text-rose-800">
                  {error.message}
                </p>
              </div>
            </div>
          ) : properties.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-lg font-medium text-slate-900">No properties found</p>
              <p className="mt-2 text-sm text-slate-600">
                The Supabase connection is working, but the `properties` table is
                currently empty.
              </p>
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
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {properties.map((property) => (
                    <tr key={String(property.id)} className="hover:bg-slate-50/70">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">
                          {formatValue(property.property_number)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        {formatValue(property.buyer_name)}
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        {formatValue(property.buyer_email)}
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        {formatValue(property.progress)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${getStatusStyles(property.status)}`}
                        >
                          {formatValue(property.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        {formatDate(property.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

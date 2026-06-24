"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"

import { supabase } from "@/lib/supabase/client"

type ProfileRow = {
  role?: string | null
  id?: string | null
  user_id?: string | null
  auth_user_id?: string | null
  profile_id?: string | null
  [key: string]: unknown
}

async function getProfileForUser(userId: string) {
  try {
    const directProfile = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle()

    if (directProfile.data) {
      return directProfile.data as ProfileRow
    }
  } catch {
    // Fall back to a broader scan if the profile key is not `id`.
  }

  const { data, error } = await supabase.from("profiles").select("*")

  if (error) {
    throw error
  }

  const profiles = (data ?? []) as ProfileRow[]

  return (
    profiles.find(
      (profile) =>
        profile.id === userId ||
        profile.user_id === userId ||
        profile.auth_user_id === userId ||
        profile.profile_id === userId,
    ) ?? null
  )
}

export default function ClientLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        })

      if (signInError) {
        throw signInError
      }

      const { data: userData, error: userError } = await supabase.auth.getUser()

      if (userError) {
        throw userError
      }

      const user = userData.user ?? signInData.user

      if (!user) {
        throw new Error("No authenticated user was returned.")
      }

      const profile = await getProfileForUser(user.id)

      if (!profile) {
        await supabase.auth.signOut()
        setError("No profile was found for this account.")
        return
      }

      const role = String(profile.role ?? "").toLowerCase()

      if (role === "admin") {
        router.replace("/admin")
        return
      }

      if (role === "client") {
        router.replace("/client")
        return
      }

      await supabase.auth.signOut()
      setError("This account does not have an admin or client role.")
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not sign in right now.",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-md flex-col justify-center">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              Reina Sophia Admin
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              Client login
            </h1>
            <p className="text-sm leading-6 text-slate-600">
              Sign in to test the redirect flow for admin and client roles.
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-slate-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                placeholder="info@jbsseco.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                placeholder="Enter your password"
                required
              />
            </div>

            {error ? (
              <div
                className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
                aria-live="polite"
              >
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-full bg-linear-to-b from-luxury-gold-soft to-luxury-gold px-5 py-3 text-sm font-semibold text-stone-950 shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </section>
      </div>
    </main>
  )
}

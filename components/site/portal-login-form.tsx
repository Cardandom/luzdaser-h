"use client"

import { FormEvent, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import {
  consumeClientLoginReturn,
  queueClientLoginScrollRestore,
} from "@/lib/client-login-return"
import { supabase } from "@/lib/supabase/client"
import { getProfileForUser } from "@/lib/supabase/profiles"

type PortalRole = "client" | "admin"

type PortalLoginFormProps = {
  eyebrow: string
  title: string
  subtitle: string
  expectedRole: PortalRole
  successPath: "/client" | "/admin"
  mismatchMessage: string
  mismatchRedirectPath?: "/client" | "/admin"
  dismissToPreviousPageOnBackdropClick?: boolean
}

function normalizeRole(role: string | null | undefined) {
  return String(role ?? "").toLowerCase()
}

export function PortalLoginForm({
  eyebrow,
  title,
  subtitle,
  expectedRole,
  successPath,
  mismatchMessage,
  mismatchRedirectPath,
  dismissToPreviousPageOnBackdropClick = false,
}: PortalLoginFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const returnToPreviousPage = () => {
    const returnLocation = consumeClientLoginReturn()

    if (returnLocation) {
      queueClientLoginScrollRestore(returnLocation)
      router.replace(returnLocation.href, { scroll: false })
      return
    }

    if (window.history.length > 1) {
      router.back()
      return
    }

    router.replace("/")
  }

  useEffect(() => {
    let isActive = true

    const syncExistingSession = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser()

      if (!isActive) {
        return
      }

      if (userError || !userData.user) {
        return
      }

      const profile = await getProfileForUser(userData.user.id).catch(() => null)

      if (!isActive) {
        return
      }

      if (!profile) {
        await supabase.auth.signOut()
        setStatusMessage("No portal profile was found for this account.")
        return
      }

      const role = normalizeRole(profile.role)

      if (role === expectedRole) {
        router.replace(successPath)
        return
      }

      if (mismatchRedirectPath) {
        router.replace(mismatchRedirectPath)
        return
      }

      await supabase.auth.signOut()
      setStatusMessage(mismatchMessage)
    }

    syncExistingSession()

    return () => {
      isActive = false
    }
  }, [expectedRole, mismatchMessage, mismatchRedirectPath, router, successPath])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setStatusMessage(null)

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
        setError("No portal profile was found for this account.")
        return
      }

      const role = normalizeRole(profile.role)

      if (role === expectedRole) {
        router.replace(successPath)
        return
      }

      if (mismatchRedirectPath) {
        router.replace(mismatchRedirectPath)
        return
      }

      await supabase.auth.signOut()
      setError(mismatchMessage)
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not sign in right now.",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main
      className="relative isolate flex min-h-screen overflow-hidden px-4 py-12 text-slate-900 sm:px-6 lg:px-8"
      onClick={dismissToPreviousPageOnBackdropClick ? returnToPreviousPage : undefined}
    >
      <div aria-hidden="true" className="absolute inset-0 -z-20">
        <video
          className="absolute inset-0 size-full object-cover object-center"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src="/vid1.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-linear-to-r from-white/80 via-white/55 to-white/25" />
        <div className="absolute inset-0 bg-white/20 backdrop-blur-xl supports-[backdrop-filter]:bg-white/15" />
      </div>

      <div className="relative z-10 flex w-full items-center justify-center">
        <section
          className="luxury-panel w-full max-w-lg rounded-3xl p-6 sm:p-8 lg:p-10"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="space-y-4">
            <span className="luxury-eyebrow inline-flex items-center rounded-full border border-luxury-border bg-white px-3 py-1.5 text-[0.7rem] font-semibold text-slate-600">
              {eyebrow}
            </span>
            <div className="space-y-3">
              <h1 className="luxury-title-sm text-slate-950">{title}</h1>
              <p className="luxury-copy max-w-md text-sm sm:text-base">
                {subtitle}
              </p>
            </div>
          </div>

          {statusMessage ? (
            <div
              className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
              aria-live="polite"
            >
              {statusMessage}
            </div>
          ) : null}

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="luxury-input"
                placeholder="info@jbsseco.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="luxury-input"
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

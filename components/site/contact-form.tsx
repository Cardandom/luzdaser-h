"use client"

import Link from "next/link"
import { useState } from "react"
import type { FormEvent } from "react"

type SubmissionState = "idle" | "submitting" | "success" | "error"

const feedbackMessages: Record<Exclude<SubmissionState, "idle" | "submitting">, string> = {
  success: "Thank you. Your request has been sent successfully.",
  error: "We couldn't send your request. Please try again or contact us directly.",
}

export function ContactForm() {
  const [status, setStatus] = useState<SubmissionState>("idle")
  const isSubmitting = status === "submitting"

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    const form = event.currentTarget
    const formData = new FormData(form)

    setStatus("submitting")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: String(formData.get("name") ?? ""),
          phone: String(formData.get("phone") ?? ""),
          email: String(formData.get("email") ?? ""),
          city: String(formData.get("city") ?? ""),
          comments: String(formData.get("comments") ?? ""),
          marketingConsent: formData.get("marketingConsent") === "on",
          website: String(formData.get("website") ?? ""),
        }),
      })

      if (!response.ok) {
        throw new Error("Contact request failed")
      }

      form.reset()
      setStatus("success")
    } catch {
      setStatus("error")
    }
  }

  function clearFeedback() {
    if (status === "success" || status === "error") {
      setStatus("idle")
    }
  }

  const feedback = status === "success" || status === "error" ? feedbackMessages[status] : ""

  return (
    <form
      className="luxury-card rounded-3xl p-5 sm:p-6"
      onSubmit={handleSubmit}
      onChange={clearFeedback}
      aria-busy={isSubmitting}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm text-foreground/75">
          Name *
          <input
            className="luxury-input"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            minLength={2}
            maxLength={100}
            required
          />
        </label>
        <label className="grid gap-2 text-sm text-foreground/75">
          Phone
          <input
            className="luxury-input"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+297 000 0000"
            maxLength={40}
          />
        </label>
        <label className="grid gap-2 text-sm text-foreground/75">
          Email *
          <input
            className="luxury-input"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            maxLength={254}
            required
          />
        </label>
        <label className="grid gap-2 text-sm text-foreground/75">
          City
          <input
            className="luxury-input"
            name="city"
            type="text"
            autoComplete="address-level2"
            placeholder="Your city"
            maxLength={100}
          />
        </label>
        <label className="grid gap-2 text-sm text-foreground/75 sm:col-span-2">
          Comments *
          <textarea
            className="luxury-input min-h-36 resize-y"
            name="comments"
            placeholder="Tell us what kind of villa you are interested in"
            minLength={10}
            maxLength={2000}
            required
          />
        </label>

        <div className="sr-only" aria-hidden="true">
          <label htmlFor="contact-website">Website</label>
          <input
            id="contact-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
      </div>

      <label className="mt-5 flex items-start gap-3 text-sm leading-6 text-foreground/75">
        <input
          name="marketingConsent"
          type="checkbox"
          className="mt-1 size-4 shrink-0 accent-luxury-gold"
        />
        <span>
          I would like to receive news, property availability updates and
          promotional communications from Reina Sophia Residences.
        </span>
      </label>

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2 text-sm text-foreground/70">
          <p className="max-w-3xl text-xs leading-5">
            By submitting this form, you acknowledge that JBSSECO / Reina Sophia
            Residences will process your personal information to respond to your
            enquiry and provide information about the property or project you are
            interested in. Please review our{" "}
            <Link
              href="/privacy-policy"
              className="font-medium text-foreground underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            .
          </p>
          <p
            id="contact-form-status"
            role="status"
            aria-live="polite"
            className={status === "error" ? "text-red-700" : "text-foreground/80"}
          >
            {feedback}
          </p>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-linear-to-b from-luxury-gold-soft to-luxury-gold px-6 font-semibold text-stone-950 shadow-lg transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {isSubmitting ? "Sending..." : "Send request"}
        </button>
      </div>
    </form>
  )
}

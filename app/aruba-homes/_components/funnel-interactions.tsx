"use client"

import { sendGTMEvent } from "@next/third-parties/google"
import { ArrowRight, Check, ChevronDown, MessageCircleMore } from "lucide-react"
import {
  createContext,
  useContext,
  useRef,
  useState,
  type FormEvent,
  type MouseEventHandler,
  type ReactNode,
} from "react"
import {
  createFunnelContactPayload,
  type FunnelRequestType,
  type ResidenceName,
} from "../_lib/contact-payload"

type SubmissionState = "idle" | "submitting" | "success" | "error"

const buyerPackBenefits = [
  "Current Price List",
  "Available Residences",
  "Floorplans",
  "Payment Structure",
  "What's Included",
]

const ResidenceContext = createContext<{
  residence: ResidenceName | null
  selectResidence: (residence: ResidenceName | null) => void
} | null>(null)

export function FunnelProvider({ children }: { children: ReactNode }) {
  const [residence, selectResidence] = useState<ResidenceName | null>(null)

  return (
    <ResidenceContext.Provider value={{ residence, selectResidence }}>
      {children}
    </ResidenceContext.Provider>
  )
}

function useResidence() {
  const context = useContext(ResidenceContext)
  if (!context) throw new Error("Funnel controls require FunnelProvider")
  return context
}

export function RequestAvailabilityLink({
  residence,
  onClick,
}: {
  residence: ResidenceName
  onClick?: MouseEventHandler<HTMLAnchorElement>
}) {
  const { selectResidence } = useResidence()

  return (
    <a
      href="#request-prices"
      onClick={(event) => {
        selectResidence(residence)
        onClick?.(event)
      }}
      data-funnel-event="funnel_model_interest"
      data-cta-location="residence-card"
      data-residence={residence}
      aria-label={`Check current availability for ${residence}`}
      className="inline-flex min-h-12 w-full items-center justify-between gap-2 rounded-full border border-luxury-gold/60 bg-luxury-gold-soft/30 px-5 text-sm font-semibold text-foreground transition-colors hover:bg-luxury-gold-soft motion-reduce:transition-none"
    >
      Check Current Availability
      <ArrowRight className="size-4" aria-hidden="true" />
    </a>
  )
}

export function FunnelForm({
  id,
  submitLabel = "Send Me the Buyer Pack",
  whatsappHref,
  children,
  requestType = "buyer-pack",
}: {
  id: string
  submitLabel?: string
  whatsappHref: string
  children?: ReactNode
  requestType?: FunnelRequestType
}) {
  const { residence, selectResidence } = useResidence()
  const [status, setStatus] = useState<SubmissionState>("idle")
  const submitting = useRef(false)
  const isSubmitting = status === "submitting"
  const isConsultation = requestType === "video-consultation"

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting.current || status === "success") return

    const form = event.currentTarget
    const fields = new FormData(form)
    submitting.current = true
    setStatus("submitting")

    try {
      // Adapt the short enquiry to the existing contact contract. No backend change.
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(25000),
        body: JSON.stringify(createFunnelContactPayload(fields, residence, id, requestType)),
      })

      if (!response.ok) throw new Error("Contact request failed")
      const result: unknown = await response.json()
      if (
        typeof result !== "object" ||
        result === null ||
        !("success" in result) ||
        result.success !== true
      ) {
        throw new Error("Contact request was not confirmed")
      }

      form.reset()
      setStatus("success")
      // Preserve the existing conversion name; analytics must not affect delivery UX.
      const successEvents = isConsultation
        ? ["lead_form_success", "video_consultation_request"]
        : ["lead_form_success"]
      for (const eventName of successEvents) {
        try {
          sendGTMEvent({ event: eventName })
        } catch {
          // The request has already succeeded, even when tracking is unavailable.
        }
      }
    } catch {
      setStatus("error")
    } finally {
      submitting.current = false
    }
  }

  return (
    <form
      id={id}
      tabIndex={-1}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-privacy`}
      aria-busy={isSubmitting}
      onSubmit={handleSubmit}
      onChange={() => {
        if (status === "success" || status === "error") setStatus("idle")
      }}
      data-funnel-event="funnel_form_start"
      data-form-location={isConsultation ? "video-consultation" : "primary"}
      className="scroll-mt-8 rounded-3xl border border-luxury-border bg-white p-5 shadow-sm sm:p-6"
    >
      <h2 id={`${id}-title`} className="font-heading text-2xl leading-tight">
        {isConsultation ? "Request a Private Video Consultation" : "Get the Current Reina Sophia Buyer Pack"}
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {isConsultation
          ? "Leave your details and our team will contact you to arrange a time."
          : "Receive the information you need to compare your options before speaking with our team."}
      </p>

      {!isConsultation && (
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium sm:text-sm">
          {buyerPackBenefits.map((benefit) => (
            <li key={benefit} className="inline-flex items-center gap-1.5">
              <Check className="size-3.5 shrink-0 text-luxury-gold" aria-hidden="true" />
              {benefit}
            </li>
          ))}
        </ul>
      )}

      {residence && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-stone-50 px-3 text-sm">
          <p aria-live="polite">Interested in: <strong>{residence}</strong></p>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => selectResidence(null)}
            className="min-h-11 px-2 text-xs underline underline-offset-4"
            aria-label="Clear residence selection"
          >
            Clear
          </button>
        </div>
      )}

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <label htmlFor={`${id}-name`} className="grid gap-1.5 text-sm font-medium">
          Name
          <input
            id={`${id}-name`}
            className="luxury-input min-h-12 text-base"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            minLength={2}
            maxLength={100}
            required
            disabled={isSubmitting}
          />
        </label>
        <label htmlFor={`${id}-phone`} className="grid gap-1.5 text-sm font-medium">
          WhatsApp / Phone
          <input
            id={`${id}-phone`}
            className="luxury-input min-h-12 text-base"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="Include country code"
            minLength={6}
            maxLength={40}
            required
            disabled={isSubmitting}
          />
        </label>
        <label htmlFor={`${id}-email`} className="grid gap-1.5 text-sm font-medium">
          Email
          <input
            id={`${id}-email`}
            className="luxury-input min-h-12 text-base"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            maxLength={254}
            required
            disabled={isSubmitting}
          />
        </label>
        <div className="sr-only" aria-hidden="true">
          <label htmlFor={`${id}-website`}>Website</label>
          <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
      </div>

      <div className="mt-4 grid items-center gap-3 lg:grid-cols-3 lg:gap-5">
        <button
          type="submit"
          disabled={isSubmitting || status === "success"}
          data-funnel-event="funnel_form_submit"
          className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-linear-to-b from-luxury-gold-soft to-luxury-gold px-4 py-3 text-sm font-semibold text-stone-950 shadow-sm transition-shadow hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70 motion-reduce:transition-none"
        >
          {isSubmitting ? "Sending…" : status === "success" ? "Request Sent" : submitLabel}
          {status === "success" ? <Check className="size-4 shrink-0" aria-hidden="true" /> : <ArrowRight className="size-4 shrink-0" aria-hidden="true" />}
        </button>

        <p id={`${id}-privacy`} className="text-xs leading-5 text-muted-foreground lg:col-span-2">
          By submitting, you acknowledge that JBSSECO / Reina Sophia Residences will
          process your information to respond to your enquiry. Read our{" "}
          <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
            Privacy Policy<span className="sr-only"> (opens in a new tab)</span>
          </a>.
        </p>
      </div>

      <div role="status" aria-live="polite" aria-atomic="true">
        {status === "success" && (
          <p className="mt-4 rounded-xl bg-stone-50 p-3 text-sm leading-6">
            {isConsultation
              ? "Thank you. Our team will contact you to arrange your private video consultation."
              : "Thank you. Your Buyer Pack request has been received."}
          </p>
        )}
        {status === "error" && (
          <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm leading-6 text-red-800">
            We couldn&apos;t confirm your request. Please try again or contact us on WhatsApp.
          </p>
        )}
      </div>
      {(status === "success" || status === "error") && (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          data-funnel-event="funnel_whatsapp_click"
          data-cta-location={`${id}-${status}`}
          className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline underline-offset-4"
        >
          <MessageCircleMore className="size-4 text-[#25D366]" aria-hidden="true" />
          Continue on WhatsApp
        </a>
      )}
      {children}
    </form>
  )
}

export function VideoConsultationRequest({ whatsappHref }: { whatsappHref: string }) {
  return (
    <details className="group mt-5">
      <summary
        data-funnel-event="funnel_primary_cta"
        data-cta-location="video-consultation"
        className="flex min-h-12 w-fit max-w-full cursor-pointer list-none items-center justify-between gap-3 rounded-full bg-linear-to-b from-luxury-gold-soft to-luxury-gold px-5 py-3 text-sm font-semibold text-stone-950 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-luxury-gold motion-reduce:transition-none [&::-webkit-details-marker]:hidden"
      >
        Request a Private Video Consultation
        <ChevronDown className="size-4 shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
      </summary>
      <div className="mt-5">
        <FunnelForm
          id="video-consultation"
          requestType="video-consultation"
          submitLabel="Request My Consultation"
          whatsappHref={whatsappHref}
        />
      </div>
    </details>
  )
}

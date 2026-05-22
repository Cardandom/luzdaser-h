"use client"

import { useRef, type FormEvent } from "react"
import { ArrowRight, LockKeyhole, X } from "lucide-react"
import { Dialog } from "@base-ui/react/dialog"

type ClientLoginDialogProps = {
  onSuccess: () => void
  onClose: () => void
}

export function ClientLoginDialog({ onSuccess, onClose }: ClientLoginDialogProps) {
  const usernameRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    event.currentTarget.reset()
    onClose()
    onSuccess()
  }

  return (
    <Dialog.Portal>
      <Dialog.Backdrop className="fixed inset-0 z-40 bg-foreground/55 backdrop-blur-sm transition-opacity duration-200 data-starting-style:opacity-0 data-ending-style:opacity-0" />

      <Dialog.Popup
        initialFocus={usernameRef}
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-luxury-border bg-white shadow-2xl outline-none transition duration-200 ease-out data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0"
      >
        <div className="absolute inset-0 bg-linear-to-br from-white via-stone-50 to-white" />

        <div className="relative p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-luxury-border bg-white px-3 py-1.5 text-xs font-medium uppercase tracking-widest text-foreground/60">
                <LockKeyhole className="size-3.5 text-luxury-gold" aria-hidden="true" />
                Client access
              </span>

              <Dialog.Title className="mt-5 font-heading text-3xl tracking-tight text-foreground sm:text-4xl">
                Private client login
              </Dialog.Title>

              <Dialog.Description className="mt-4 max-w-lg text-sm leading-7 text-foreground/70 sm:text-base">
                Sign in to reach the project progress area. This first version is
                front-end only, so we can refine the experience before wiring the
                backend and database.
              </Dialog.Description>
            </div>

            <Dialog.Close
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-luxury-border bg-white text-foreground transition hover:border-luxury-gold hover:text-luxury-gold"
              aria-label="Close login dialog"
            >
              <X className="size-5" aria-hidden="true" />
            </Dialog.Close>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="client-login-username"
                className="text-xs font-medium uppercase tracking-widest text-foreground/55"
              >
                Username
              </label>
              <input
                ref={usernameRef}
                id="client-login-username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder="Enter your username"
                className="luxury-input mt-2"
                required
              />
            </div>

            <div>
              <label
                htmlFor="client-login-password"
                className="text-xs font-medium uppercase tracking-widest text-foreground/55"
              >
                Password
              </label>
              <input
                id="client-login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                className="luxury-input mt-2"
                required
              />
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-6 text-foreground/55">
                Access credentials will be connected later. For now, this modal
                routes you to the project progress section.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Dialog.Close
                  className="inline-flex items-center justify-center rounded-full border border-luxury-border bg-white px-5 py-3 text-sm font-medium text-foreground transition hover:border-luxury-gold hover:text-luxury-gold"
                  type="button"
                >
                  Cancel
                </Dialog.Close>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-white transition hover:bg-foreground/90"
                >
                  Continue
                  <ArrowRight className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </Dialog.Popup>
    </Dialog.Portal>
  )
}

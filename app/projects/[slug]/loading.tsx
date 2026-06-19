export default function Loading() {
  return (
    <main className="relative isolate overflow-hidden pb-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-linear-to-b from-luxury-gold/15 to-transparent"
      />

      <section className="luxury-shell mt-6 sm:mt-8">
        <div className="overflow-hidden rounded-4xl border border-luxury-border bg-white px-4 py-10 shadow-xl sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl animate-pulse">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto h-3 w-32 rounded-full bg-stone-200" />
              <div className="mx-auto mt-4 h-12 w-4/5 rounded-2xl bg-stone-200 sm:h-16" />
              <div className="mx-auto mt-3 h-3 w-64 rounded-full bg-stone-200" />
            </div>

            <div className="mt-8 rounded-4xl border border-luxury-border bg-linear-to-b from-white via-stone-50 to-white p-5 shadow-2xl sm:p-8 lg:p-10">
              <div className="grid gap-6 xl:grid-cols-3">
                <div className="h-96 rounded-3xl bg-stone-200" />
                <div className="h-96 rounded-3xl bg-stone-200" />
                <div className="h-96 rounded-3xl bg-stone-200" />
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="h-72 rounded-3xl bg-stone-200" />
                <div className="h-72 rounded-3xl bg-stone-200" />
                <div className="h-72 rounded-3xl bg-stone-200" />
                <div className="h-72 rounded-3xl bg-stone-200" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

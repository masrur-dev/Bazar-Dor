export default function Loading() {
  return (
    <main className="min-h-screen bg-[#f7f7f5] px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-7xl animate-pulse">
        {/* Hero Skeleton */}
        <section className="rounded-3xl bg-white p-8 sm:p-12">
          <div className="h-5 w-40 rounded-full bg-black/10" />

          <div className="mt-6 h-14 max-w-2xl rounded-xl bg-black/10 sm:h-20" />

          <div className="mt-4 h-14 max-w-xl rounded-xl bg-black/10 sm:h-20" />

          <div className="mt-6 h-5 max-w-lg rounded bg-black/10" />

          <div className="mt-8 h-11 w-36 rounded-lg bg-black/10" />
        </section>

        {/* Section Title */}
        <div className="mt-12">
          <div className="h-8 w-40 rounded-lg bg-black/10" />

          <div className="mt-3 h-4 w-64 rounded bg-black/10" />
        </div>

        {/* Cards */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-black/10 bg-white p-5"
            >
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-xl bg-black/10" />

                <div className="flex-1">
                  <div className="h-5 w-32 rounded bg-black/10" />

                  <div className="mt-2 h-3 w-20 rounded bg-black/10" />
                </div>
              </div>

              <div className="mt-8 h-8 w-28 rounded bg-black/10" />

              <div className="mt-4 h-4 w-20 rounded bg-black/10" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
const STATS = [
  { value: "4", label: "supported upload formats" },
  { value: "20", label: "documents per chat" },
  { value: "5", label: "free documents" },
  { value: "50", label: "Pro questions per month" },
]

function Stats() {
  return (
    <section className="border-y bg-surface">
      <dl className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-x-6 gap-y-10 px-6 py-12 md:grid-cols-4">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center gap-2 text-center"
          >
            {/* `dt` leads in the DOM so it reads as "label: value", but the
                value is shown first. */}
            <dt className="order-2 text-sm text-muted-foreground">
              {stat.label}
            </dt>
            <dd className="order-1 text-4xl font-bold tracking-tight sm:text-5xl">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export { Stats }

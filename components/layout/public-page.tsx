import type { ReactNode } from "react"

function PublicPage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string
  title: string
  intro: string
  children: ReactNode
}) {
  return (
    <article className="mx-auto w-full max-w-4xl px-6 py-16 lg:py-24">
      <header className="max-w-2xl border-b pb-10">
        <p className="font-mono text-xs font-bold tracking-[0.18em] text-brand uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-4 text-4xl leading-tight font-bold tracking-tight sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          {intro}
        </p>
      </header>
      <div className="mt-12 flex max-w-3xl flex-col gap-10 text-[0.9375rem] leading-relaxed">
        {children}
      </div>
    </article>
  )
}

function PublicSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  )
}

export { PublicPage, PublicSection }

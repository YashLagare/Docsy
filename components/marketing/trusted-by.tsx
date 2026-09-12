import { cn } from "@/lib/utils"

const USE_CASES = ["Research", "Business reports", "Technical docs", "Project files"]

function TrustedBy({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      <p className="text-center font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
        For the documents you need to understand
      </p>
      <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {USE_CASES.map((company) => (
          <li
            key={company}
            className="font-medium tracking-wide text-muted-foreground uppercase"
          >
            {company}
          </li>
        ))}
      </ul>
    </div>
  )
}

export { TrustedBy }

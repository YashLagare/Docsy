import { SectionHeading } from "@/components/marketing/section-heading"
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const STEPS = [
  {
    number: "01",
    title: "Upload documents",
    description:
      "Add PDF, DOCX, TXT, or Markdown files to your workspace.",
  },
  {
    number: "02",
    title: "Ask in plain language",
    description:
      "Choose the documents for a chat and ask questions in plain language. Get answers based on those selected sources.",
  },
  {
    number: "03",
    title: "Review the sources",
    description:
      "Use source markers to review available supporting passages and open the original document.",
  },
]

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="mx-auto w-full max-w-6xl scroll-mt-16 px-6 pt-13 pb-16 lg:pt-19 lg:pb-24"
    >
      <SectionHeading
        className="max-w-160"
        eyebrow="How it works"
        title="From documents to an answer you can review."
      />

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {STEPS.map((step) => (
          <Card key={step.number} className="[--card-spacing:--spacing(6)]">
            <CardHeader className="gap-2.5">
              <span className="mb-3 font-mono text-sm font-bold text-brand">
                {step.number}
              </span>
              <CardTitle className="text-lg font-semibold">
                {step.title}
              </CardTitle>
              <CardDescription className="text-[0.9375rem] leading-relaxed">
                {step.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  )
}

export { HowItWorks }

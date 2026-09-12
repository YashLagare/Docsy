import { SectionHeading } from "@/components/marketing/section-heading"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

const USE_CASES = [
  {
    quote: "Review research papers and academic material without reading every page first.",
    name: "Research",
    initials: "R",
    role: "Papers and source material",
  },
  {
    quote: "Find key details in business reports, proposals, and operational documents.",
    name: "Business",
    initials: "B",
    role: "Reports and proposals",
  },
  {
    quote: "Ask about technical documentation and project files while keeping the source close by.",
    name: "Projects",
    initials: "P",
    role: "Technical and project documents",
  },
]

function Testimonials() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16 lg:py-24">
      <SectionHeading
        className="max-w-160"
        eyebrow="Built for document work"
        title="Start with the documents you already use."
      />

      {/* Below `md` the cards become a swipeable rail: each card is 82% of the
          content width, so the next one peeks in by about a quarter. */}
      <div className="no-scrollbar -mx-6 mt-14 flex snap-x snap-mandatory scroll-pl-6 gap-4 overflow-x-auto px-6 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0">
        {USE_CASES.map((testimonial) => (
          <Card
            key={testimonial.name}
            className="w-[82%] shrink-0 snap-start [--card-spacing:--spacing(7)] md:w-auto"
          >
            <CardContent>
              <blockquote className="text-[0.9375rem] leading-relaxed">
                {testimonial.quote}
              </blockquote>
            </CardContent>

            <CardContent className="mt-auto flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="text-xs">
                  {testimonial.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-col">
                <span className="text-[0.9375rem] font-semibold">
                  {testimonial.name}
                </span>
                <span className="text-sm text-muted-foreground">
                  {testimonial.role}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

export { Testimonials }

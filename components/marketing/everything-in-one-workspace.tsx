import {
    BookOpenIcon,
    CommandIcon,
    FileIcon,
    LayersIcon,
    MessageSquareIcon,
    Share2Icon,
} from "lucide-react"

import { SectionHeading } from "@/components/marketing/section-heading"
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const FEATURES = [
  {
    icon: MessageSquareIcon,
    title: "Document workspace",
    description:
      "Keep documents, chats, and workspace activity together in one place.",
  },
  {
    icon: BookOpenIcon,
    title: "Answers from selected sources",
    description:
      "Attach relevant documents to a chat and ask questions about their content.",
  },
  {
    icon: LayersIcon,
    title: "Source references",
    description:
      "Follow source markers, review available passages, and open the supporting document.",
  },
  {
    icon: FileIcon,
    title: "Supported uploads",
    description:
      "Upload PDF, DOCX, TXT, and Markdown files. Text is extracted from DOCX, TXT, and Markdown for the current answer flow.",
  },
  {
    icon: CommandIcon,
    title: "Workspace search",
    description:
      "Find chats and documents across your workspace from one search experience.",
  },
  {
    icon: Share2Icon,
    title: "Usage and billing",
    description:
      "Track question usage and manage workspace plans from your account settings.",
  },
]

function EverythingInOneWorkspace() {
  return (
    <section id="product" className="scroll-mt-16 border-y bg-surface">
      <div className="mx-auto w-full max-w-6xl px-6 py-16 lg:py-24">
        <SectionHeading
          className="max-w-160"
          eyebrow="Everything in one workspace"
          title="The tools for understanding documents faster."
        />

        {/* Below `md` the cards become a swipeable rail: each card is 82% of
            the content width, so the next one peeks in by about a quarter. */}
        <div className="no-scrollbar -mx-6 mt-14 flex snap-x snap-mandatory scroll-pl-6 gap-4 overflow-x-auto px-6 md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <Card
              key={title}
              className="w-[82%] shrink-0 snap-start [--card-spacing:--spacing(6)] md:w-auto"
            >
              <CardHeader className="gap-2">
                <span className="mb-3 flex size-9 items-center justify-center rounded-lg bg-muted text-brand">
                  <Icon className="size-4.5" />
                </span>
                <CardTitle className="text-base font-semibold">
                  {title}
                </CardTitle>
                <CardDescription className="leading-relaxed">
                  {description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export { EverythingInOneWorkspace }

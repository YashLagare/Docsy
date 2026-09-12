import { PlusIcon } from "lucide-react"

import { SectionHeading } from "@/components/marketing/section-heading"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const FAQS = [
  {
    question: "How are answers connected to my documents?",
    answer:
      "Answers are based on the documents selected for the chat. Source markers let you review available supporting passages and open the original document.",
  },
  {
    question: "What file types can I upload?",
    answer:
      "You can upload PDF, DOCX, TXT, and Markdown files. DOCX, TXT, and Markdown are extracted into text for the current answer flow; PDF files are stored and downloadable.",
  },
  {
    question: "How is workspace data organized?",
    answer:
      "Documents, chats, usage, and search results are scoped to your workspace. Authentication and server-side authorization protect workspace routes.",
  },
  {
    question: "Can I ask about more than one document?",
    answer:
      "Yes. Attach one or more ready documents to a chat and ask questions against the selected sources.",
  },
  {
    question: "Can I review the source document?",
    answer:
      "Yes. Source references can open available passages in the source reader, and the original uploaded document can be opened separately.",
  },
  {
    question: "What's the difference between plans?",
    answer:
      "Questions per month is the only limit that changes. Free covers 5 documents and 5 questions, Pro removes the document limit and raises questions to 50, and Business makes questions unlimited.",
  },
]

function Faqs() {
  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-16 lg:py-24">
      <SectionHeading
        className="items-center text-center"
        eyebrow="FAQ"
        title="Questions, answered."
      />

      <Accordion className="mt-10 border-t">
        {FAQS.map((faq) => (
          <AccordionItem key={faq.question} value={faq.question} className="border-b">
            {/* The component ships a chevron; swap it for the plus the design
                uses, which rotates into a close icon when the panel opens. */}
            <AccordionTrigger className="cursor-pointer gap-6 py-4 text-base font-semibold **:data-[slot=accordion-trigger-icon]:hidden hover:no-underline">
              {faq.question}
              <PlusIcon className="mt-0.5 ml-auto size-4 shrink-0 text-muted-foreground transition-transform group-aria-expanded/accordion-trigger:rotate-45" />
            </AccordionTrigger>
            <AccordionContent className="pr-10 pb-5 text-[0.9375rem] leading-relaxed text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}

export { Faqs }

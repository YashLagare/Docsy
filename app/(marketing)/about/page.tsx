import { Globe, Mail } from "lucide-react"
import type { Metadata } from "next"
import { FaInstagram, FaLinkedin } from "react-icons/fa6"

import { PublicPage, PublicSection } from "@/components/layout/public-page"

export const metadata: Metadata = { title: "About" }

const links = [
  { href: "https://www.linkedin.com/in/yashlagare/", label: "LinkedIn", icon: FaLinkedin },
  { href: "https://www.instagram.com/yashlagare/?hl=en", label: "Instagram", icon: FaInstagram },
  { href: "https://portfolio-five-opal-53.vercel.app/", label: "Portfolio", icon: Globe },
  { href: "mailto:yashlagare77@gmail.com", label: "Email", icon: Mail },
]

export default function AboutPage() {
  return (
    <PublicPage
      eyebrow="About Docsy"
      title="A clearer way to work through long documents."
      intro="Docsy is a multi-tenant document workspace for people who need to understand reports, documentation, research material, policies, and project files without reading every page first."
    >
      <PublicSection title="The problem">
        <p>
          Long documents often contain the information people need, but there is not always time to read each page closely. AI can make information faster to find, but generated answers can miss context or include unsupported details.
        </p>
      </PublicSection>

      <PublicSection title="How Docsy works">
        <p>
          Upload supported documents to a workspace, select the sources for a conversation, and ask questions in normal language. Docsy returns a streamed answer based on those selected documents and provides source references so important information is easier to review.
        </p>
      </PublicSection>

      <PublicSection title="Who it is for">
        <p>
          Docsy can help with research papers, business reports, technical documentation, policies, proposals, and project documents. It is useful anywhere the next step is understanding a source, not just producing a summary.
        </p>
      </PublicSection>

      <PublicSection title="Built by">
        <p>Docsy is built by Yash Lagare.</p>
        <div className="flex flex-wrap gap-x-5 gap-y-3">
          {links.map(({ href, label, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="inline-flex items-center gap-2 text-sm font-medium text-brand hover:underline"
            >
              <Icon className="size-4" />
              {label}
            </a>
          ))}
        </div>
      </PublicSection>
    </PublicPage>
  )
}

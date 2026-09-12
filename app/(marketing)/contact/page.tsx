import { Globe, Mail } from "lucide-react"
import type { Metadata } from "next"
import { FaInstagram, FaLinkedin } from "react-icons/fa6"

import { PublicPage, PublicSection } from "@/components/layout/public-page"

export const metadata: Metadata = { title: "Contact" }

const links = [
  { href: "https://www.linkedin.com/in/yashlagare/", label: "LinkedIn", icon: FaLinkedin },
  { href: "https://www.instagram.com/yashlagare/?hl=en", label: "Instagram", icon: FaInstagram },
  { href: "https://portfolio-five-opal-53.vercel.app/", label: "Portfolio", icon: Globe },
]

export default function ContactPage() {
  return (
    <PublicPage
      eyebrow="Contact"
      title="Questions about Docsy?"
      intro="Email us about the product, a problem, feedback, or an account and billing question."
    >
      <PublicSection title="Email support">
        <p>
          The simplest way to get in touch is by email. Include enough detail for us to understand your question or reproduce the problem.
        </p>
        <a
          href="mailto:yashlagare77@gmail.com"
          className="inline-flex w-fit items-center gap-2 font-medium text-brand hover:underline"
        >
          <Mail className="size-4" />
          yashlagare77@gmail.com
        </a>
      </PublicSection>

      <PublicSection title="Developer">
        <p>Docsy is built by Yash Lagare.</p>
        <div className="flex flex-wrap gap-x-5 gap-y-3">
          {links.map(({ href, label, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
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

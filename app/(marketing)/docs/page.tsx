import type { Metadata } from "next"
import Link from "next/link"

import { PublicPage, PublicSection } from "@/components/layout/public-page"

export const metadata: Metadata = { title: "Docs" }

export default function DocsPage() {
  return (
    <PublicPage
      eyebrow="User guide"
      title="Get started with Docsy."
      intro="Use Docsy to organize documents, ask questions about selected sources, and review the references behind an answer."
    >
      <PublicSection title="1. Create your account">
        <p>Choose sign up from the home page, or sign in if you already have an account.</p>
      </PublicSection>

      <PublicSection title="2. Set up your workspace">
        <p>After signing in, create your workspace. Your documents, chats, usage, and search results belong to that workspace.</p>
      </PublicSection>

      <PublicSection title="3. Upload documents">
        <p>Open the Library and upload PDF, DOCX, TXT, or Markdown files. DOCX, TXT, and Markdown files are extracted into text for the current answer flow. PDF files can be stored and opened, but their text is not currently extracted for answers.</p>
      </PublicSection>

      <PublicSection title="4. Start a chat">
        <p>Create a chat and attach one or more ready documents. The attached documents define the sources available to that conversation.</p>
      </PublicSection>

      <PublicSection title="5. Ask a question">
        <p>Ask a question in normal language about the selected documents. Follow-up questions can continue the same conversation.</p>
      </PublicSection>

      <PublicSection title="6. Review the answer">
        <p>Answers appear as they are generated. Source markers can open available supporting passages in the source reader, and the original uploaded document can be opened separately.</p>
      </PublicSection>

      <PublicSection title="7. Continue the conversation">
        <p>Use the composer to ask follow-up questions while the same document scope remains attached to the chat.</p>
      </PublicSection>

      <PublicSection title="8. Find previous documents and chats">
        <p>Use workspace search to find documents and previous chats.</p>
      </PublicSection>

      <PublicSection title="9. Manage usage and settings">
        <p>Usage shows your question allowance. Settings contains account, billing, and account-management options where applicable.</p>
      </PublicSection>

      <PublicSection title="10. Getting help">
        <p>
          For help, visit <Link className="text-brand hover:underline" href="/contact">Contact</Link> or email yashlagare77@gmail.com.
        </p>
      </PublicSection>
    </PublicPage>
  )
}

import type { Metadata } from "next"

import { PublicPage, PublicSection } from "@/components/layout/public-page"

export const metadata: Metadata = { title: "Privacy" }

export default function PrivacyPage() {
  return (
    <PublicPage
      eyebrow="Privacy"
      title="How Docsy handles information."
      intro="This policy describes the information Docsy stores and the services involved when you use the application."
    >
      <PublicSection title="Information you provide">
        <p>Docsy stores account information such as your name, email address, authentication records, workspace membership, and optional profile image.</p>
      </PublicSection>

      <PublicSection title="Documents and chats">
        <p>Uploaded documents are stored with your workspace. Docsy stores document metadata, extracted text where available, chat questions, answers, source metadata, and feedback associated with your use of the product.</p>
      </PublicSection>

      <PublicSection title="Usage and billing information">
        <p>Docsy records question usage so plan limits can be applied. If you use a paid plan, Stripe processes payment details and subscription events. Docsy stores the subscription information needed to show plan status, invoices, and limited payment-method details.</p>
      </PublicSection>

      <PublicSection title="Third-party services">
        <p>Docsy uses Neon PostgreSQL for application storage, Better Auth for authentication, OpenRouter for document answers, Resend for configured transactional email, and Stripe for paid plans. Information needed for each service may be sent to that service when its feature is used.</p>
      </PublicSection>

      <PublicSection title="Retention and deletion">
        <p>You can delete documents, chats, and your account through the available product controls. Administrators can configure chat retention, and scheduled cleanup can remove chats that exceed the configured retention period. Some records may remain where needed for billing, security, or operational records.</p>
      </PublicSection>

      <PublicSection title="Security">
        <p>Docsy uses authenticated sessions, server-side authorization, workspace-scoped queries, upload validation, database-backed rate limiting, and verified Stripe webhooks. No method of transmission or storage can be described as completely risk-free.</p>
      </PublicSection>

      <PublicSection title="Contact">
        <p>Questions about this policy can be sent to yashlagare77@gmail.com.</p>
      </PublicSection>
    </PublicPage>
  )
}

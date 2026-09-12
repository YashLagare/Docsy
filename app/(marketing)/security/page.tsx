import type { Metadata } from "next"

import { PublicPage, PublicSection } from "@/components/layout/public-page"

export const metadata: Metadata = { title: "Security" }

export default function SecurityPage() {
  return (
    <PublicPage
      eyebrow="Security"
      title="Controls for workspace data."
      intro="Docsy uses authentication, server-side authorization, and workspace scoping to protect access to product data."
    >
      <PublicSection title="Authentication">
        <p>Better Auth manages accounts, sessions, email/password flows, password resets, and optional social sign-in providers.</p>
      </PublicSection>

      <PublicSection title="Workspace-scoped access">
        <p>Documents, chats, search results, usage, and billing data are scoped to the active workspace. Server-side guards check access before protected routes read or change data.</p>
      </PublicSection>

      <PublicSection title="Uploads and documents">
        <p>Uploads are limited by supported file type and size. Documents and avatars are currently stored in PostgreSQL, rather than a separate object-storage service.</p>
      </PublicSection>

      <PublicSection title="Billing and administration">
        <p>Stripe webhook signatures are verified before subscription events are processed. Administrative routes require administrator access, and administrative activity is recorded in an activity log.</p>
      </PublicSection>

      <PublicSection title="What is not implemented">
        <p>Two-factor sign-in is not currently implemented, even though its setting is represented in the admin interface. Docsy does not claim a security certification or a specific compliance status.</p>
      </PublicSection>

      <PublicSection title="Questions">
        <p>For security questions, email yashlagare77@gmail.com.</p>
      </PublicSection>
    </PublicPage>
  )
}

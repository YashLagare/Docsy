import type { Metadata } from "next"

import { PublicPage, PublicSection } from "@/components/layout/public-page"

export const metadata: Metadata = { title: "Refund Policy" }

export default function RefundPolicyPage() {
  return (
    <PublicPage
      eyebrow="Refund policy"
      title="Subscription refunds."
      intro="Docsy subscriptions are processed through Stripe. Contact us before assuming that a cancellation is a refund."
    >
      <PublicSection title="Cancellation">
        <p>Paid plans can be managed through the Stripe Customer Portal available from Billing settings. Cancellation and plan changes are handled there, subject to the subscription details shown by Stripe.</p>
      </PublicSection>

      <PublicSection title="Refund requests">
        <p>Docsy does not currently publish an automatic refund window, money-back guarantee, or universal prorated-refund rule. Refund requests are reviewed individually based on the payment and subscription details.</p>
      </PublicSection>

      <PublicSection title="How to contact us">
        <p>For a refund-related request, email yashlagare77@gmail.com with the account email, relevant payment or invoice details, and a short explanation. Stripe may be involved in reviewing or processing the request.</p>
      </PublicSection>
    </PublicPage>
  )
}

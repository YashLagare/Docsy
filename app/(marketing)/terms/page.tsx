import type { Metadata } from "next"

import { PublicPage, PublicSection } from "@/components/layout/public-page"

export const metadata: Metadata = { title: "Terms" }

export default function TermsPage() {
  return (
    <PublicPage
      eyebrow="Terms of service"
      title="Using Docsy responsibly."
      intro="These terms describe the basic rules for using the Docsy application."
    >
      <PublicSection title="Acceptance">
        <p>By creating an account or using Docsy, you agree to use the service in accordance with these terms and applicable law.</p>
      </PublicSection>

      <PublicSection title="Accounts">
        <p>Provide accurate account information and keep your login details secure. You are responsible for activity under your account and for maintaining access to the email address associated with it.</p>
      </PublicSection>

      <PublicSection title="Your content">
        <p>You retain responsibility for documents, questions, and other content you upload or submit. You must have the rights and permissions needed to use that content with Docsy and its service providers.</p>
      </PublicSection>

      <PublicSection title="AI-generated answers">
        <p>AI-generated answers may contain errors, omissions, or incomplete context. Review source references and the original documents before relying on important information. Docsy does not replace professional, legal, medical, financial, or other qualified advice.</p>
      </PublicSection>

      <PublicSection title="Acceptable use">
        <p>Do not use Docsy to break the law, infringe another person&apos;s rights, bypass access controls, interfere with the service, upload malicious content, or attempt to access another workspace.</p>
      </PublicSection>

      <PublicSection title="Paid plans and billing">
        <p>Paid plans are offered through Stripe Checkout. Subscription status, plan access, and billing management are handled through the product and Stripe Customer Portal. Refund requests are handled under the Refund Policy.</p>
      </PublicSection>

      <PublicSection title="Availability and changes">
        <p>Features, limits, pricing, and availability may change. Docsy may be unavailable for maintenance, provider outages, or other operational reasons.</p>
      </PublicSection>

      <PublicSection title="Suspension and termination">
        <p>Access may be suspended or terminated for misuse, security concerns, non-payment, or violation of these terms. You may stop using the service and delete your account through the available controls.</p>
      </PublicSection>

      <PublicSection title="Intellectual property and disclaimers">
        <p>Docsy, its interface, and its software remain protected by applicable intellectual-property rights. The service is provided as available, without a guarantee that answers will be complete, accurate, uninterrupted, or suitable for a particular purpose.</p>
      </PublicSection>

      <PublicSection title="Contact">
        <p>Questions about these terms can be sent to yashlagare77@gmail.com.</p>
      </PublicSection>
    </PublicPage>
  )
}

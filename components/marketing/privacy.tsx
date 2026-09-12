import {
    ArrowRightIcon,
    CheckIcon,
    LockIcon,
    ShieldIcon,
    Trash2Icon,
} from "lucide-react"
import Link from "next/link"
import { Fragment } from "react"

import { SectionHeading } from "@/components/marketing/section-heading"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const SECURITY_POINTS = [
  {
    icon: LockIcon,
    title: "Workspace-scoped data",
    description: "Documents, chats, and search results are filtered by workspace.",
  },
  {
    icon: ShieldIcon,
    title: "Protected access",
    description: "Authentication and server-side guards protect workspace routes.",
  },
  {
    icon: Trash2Icon,
    title: "Delete your content",
    description: "Remove documents and chats from your workspace when you need to.",
  },
  {
    icon: CheckIcon,
    title: "Admin activity log",
    description: "Administrators can review recorded application activity.",
  },
]

function Privacy() {
  return (
    <section
      id="security"
      className="mx-auto w-full max-w-6xl scroll-mt-16 px-6 py-16 lg:py-24"
    >
      <Card className="grid grid-cols-1 gap-0 p-0 lg:grid-cols-2">
        <div className="p-8 lg:p-12">
          <SectionHeading
            size="sm"
            eyebrow="Workspace controls"
            title="Keep work organized and scoped."
            description={
              <>
                Documents and chats stay connected to their workspace.
                <br />
                Access is checked on the server for protected product routes.
              </>
            }
          />
          <Link
            href="/security"
            className="group mt-8 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-brand"
          >
            Read the security overview
            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="flex flex-col gap-5 border-t bg-surface p-8 lg:border-t-0 lg:border-l lg:p-12">
          {SECURITY_POINTS.map(({ icon: Icon, title, description }, index) => (
            <Fragment key={title}>
              {index > 0 ? <Separator /> : null}
              <div className="flex gap-3">
                <Icon className="mt-0.5 size-4.5 shrink-0 text-brand" />
                <div className="flex flex-col gap-1">
                  <h3 className="text-[0.9375rem] font-semibold">{title}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      </Card>
    </section>
  )
}

export { Privacy }

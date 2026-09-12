import Link from "next/link"

import { AuthHeaderActions } from "@/components/auth/auth-header-actions"
import { DocsyLogo } from "@/components/brand/docsy-logo"
import { MobileNav } from "@/components/layout/mobile-nav"
import { ModeToggle } from "@/components/theme/mode-toggle"
import { mainNav } from "@/lib/site-config"

function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 supports-backdrop-filter:backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-8 px-6">
        <Link href="/" aria-label="Docsy home">
          <DocsyLogo />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-brand"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
          <AuthHeaderActions />
          <MobileNav items={mainNav} className="md:hidden" />
        </div>
      </div>
    </header>
  )
}

export { SiteHeader }

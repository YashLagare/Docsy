export type NavItem = {
  href: string
  label: string
}

export const siteConfig = {
  name: "Docsy",
  description:
    "Docsy is a document workspace for understanding long documents and reviewing source references.",
}

export type NavGroup = {
  title: string
  items: NavItem[]
}

/** Primary marketing navigation, shared by the header and the mobile drawer. */
export const mainNav: NavItem[] = [
  { href: "#product", label: "Product" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#security", label: "Security" },
  { href: "#pricing", label: "Pricing" },
]

/** Link columns in the site footer. */
export const footerNav: NavGroup[] = [
  {
    title: "Product",
    items: [
      { href: "/#product", label: "Features" },
      { href: "/#pricing", label: "Pricing" },
      { href: "/security", label: "Security" },
    ],
  },
  {
    title: "Company",
    items: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Resources",
    items: [
      { href: "/docs", label: "Docs" },
    ],
  },
  {
    title: "Legal",
    items: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
      { href: "/refund-policy", label: "Refund Policy" },
    ],
  },
]

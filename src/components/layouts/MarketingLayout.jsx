import { MarketingNav } from "../MarketingNav.jsx"
import { SiteFooter } from "../SiteFooter.jsx"

/**
 * @param {{ children: import('react').ReactNode }} props
 */
export function MarketingLayout({ children }) {
  return (
    <>
      <MarketingNav />
      {children}
      <SiteFooter />
    </>
  )
}

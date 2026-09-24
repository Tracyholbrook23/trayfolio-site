import type { ReactNode } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#fffdf9] text-stone-900">
      <SiteHeader />
      <main id="main-content" className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

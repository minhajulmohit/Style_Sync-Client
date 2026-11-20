import { Suspense } from "react";
import Navbar from "@/components/navbar/navbar";
import BrowseServices from "@/components/services/browse-services";
import SiteFooter from "@/components/layout/site-footer";

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <Suspense
        fallback={
          <main className="min-h-screen bg-[#fffaf8] px-4 py-16 text-center text-sm text-[#8e7e86]">
            Loading services...
          </main>
        }
      >
        <BrowseServices />
      </Suspense>
      <SiteFooter />
    </>
  );
}

import { Suspense } from "react";
import Navbar from "@/components/navbar/navbar";
import BrowseServices from "@/components/services/browse-services";
import SiteFooter from "@/components/layout/site-footer";
import { BrowseServicesSkeleton } from "@/components/skeletons";

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<BrowseServicesSkeleton />}>
        <BrowseServices />
      </Suspense>
      <SiteFooter />
    </>
  );
}

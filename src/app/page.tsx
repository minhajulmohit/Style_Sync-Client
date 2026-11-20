import Hero from "@/components/home/Hero";
import FeaturedServices from "@/components/home/FeaturedServices";
import ServiceCategories from "@/components/home/service-categories";
import CustomerReviews from "@/components/home/customer-reviews";
import SiteFooter from "@/components/layout/site-footer";
import Navbar from "@/components/navbar/navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <ServiceCategories />
      <FeaturedServices />
      <CustomerReviews />
      <SiteFooter />
    </>
  );
}

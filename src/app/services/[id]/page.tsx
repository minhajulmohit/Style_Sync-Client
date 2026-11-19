import { Suspense } from "react"
import { ServiceDetails } from "@/components/services/service-details"

async function ServiceDetailsWithId({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return <ServiceDetails key={id} id={id} />
}

export default function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-64 items-center justify-center bg-[#fffaf8] text-sm text-[#8e7e86]">
          Loading service details...
        </div>
      }
    >
      <ServiceDetailsWithId params={params} />
    </Suspense>
  )
}

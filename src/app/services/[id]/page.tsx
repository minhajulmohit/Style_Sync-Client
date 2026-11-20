import { Suspense } from "react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { ServiceDetails } from "@/components/services/service-details"
import { ServiceDetailsSkeleton } from "@/components/skeletons"

async function ServiceDetailsWithId({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect("/signin")
  }

  return <ServiceDetails key={id} id={id} />
}

export default function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return (
    <Suspense fallback={<ServiceDetailsSkeleton />}>
      <ServiceDetailsWithId params={params} />
    </Suspense>
  )
}

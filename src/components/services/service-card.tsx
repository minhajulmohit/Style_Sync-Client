import { Clock3, ImageIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { ServiceRecord } from "@/types/services"

export function ServiceCard({ service }: { service: ServiceRecord }) {
  const serviceId = service.id ?? service._id

  return (
    <article className="overflow-hidden rounded-2xl border border-rose-100/70 bg-white shadow-sm shadow-rose-100/40 transition duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-rose-100/60">
      <div className="relative aspect-16/10 overflow-hidden bg-linear-to-br from-rose-50 via-orange-50 to-purple-50">
        {service.image ? (
          <Image
            src={service.image}
            alt={service.serviceName}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-[#e77a8e]">
            <ImageIcon aria-hidden="true" size={32} />
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full border border-white/70 bg-white/90 px-3 py-1 text-xs font-medium text-[#b34d68] shadow-sm backdrop-blur">
          {service.category}
        </span>
      </div>

      <div className="p-5">
        <h2 className="font-heading text-lg font-semibold leading-snug text-[#352a31]">
          {service.serviceName}
        </h2>
        <p className="mt-2 min-h-10 line-clamp-2 text-sm leading-5 text-[#8e7e86]">
          {service.description}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-rose-50 pt-4">
          <p className="font-heading text-xl font-semibold text-[#e45c78]">
            ${service.price}
          </p>
          <span className="inline-flex items-center gap-1.5 text-sm text-[#756a72]">
            <Clock3 aria-hidden="true" size={15} className="text-[#b5a8af]" />
            {service.duration} mins
          </span>
        </div>

        <Button
          render={
            serviceId ? <Link href={`/services/${serviceId}`} /> : undefined
          }
          disabled={!serviceId}
          variant="outline"
          className="mt-4 h-10 w-full rounded-xl border-rose-100 text-[#e45c78] hover:bg-rose-50 hover:text-[#d34c6b]"
        >
          View Details
        </Button>
      </div>
    </article>
  )
}

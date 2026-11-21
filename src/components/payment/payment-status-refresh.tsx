"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { RefreshCw } from "lucide-react"

export function PaymentStatusRefresh() {
  const router = useRouter()
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(true)

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      router.refresh()
    }, 3_000)
    const timeoutId = window.setTimeout(() => {
      window.clearInterval(intervalId)
      setIsAutoRefreshing(false)
    }, 30_000)

    return () => {
      window.clearInterval(intervalId)
      window.clearTimeout(timeoutId)
    }
  }, [router])

  return (
    <div className="mt-5 flex flex-col items-center gap-3">
      <p role="status" className="text-xs text-[#8e7e86]">
        {isAutoRefreshing
          ? "Checking for webhook confirmation..."
          : "Still waiting for webhook confirmation."}
      </p>
      <button
        type="button"
        onClick={() => router.refresh()}
        className="inline-flex h-9 items-center gap-2 rounded-xl border border-rose-200 px-3 text-xs font-semibold text-[#b34d68] transition hover:bg-rose-50"
      >
        <RefreshCw aria-hidden="true" size={14} />
        Check status now
      </button>
    </div>
  )
}

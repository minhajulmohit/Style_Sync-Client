import type { ServiceStatus } from "@/types/services"

export function ServiceStatusToggle({
  status,
  onToggle,
}: {
  status: ServiceStatus
  onToggle: () => void
}) {
  const isActive = status === "Active"

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isActive}
      aria-label={`Service status: ${status}`}
      onClick={onToggle}
      className="flex h-10 items-center justify-between gap-2 rounded-xl border border-rose-100 px-3 text-sm font-medium text-[#756a72] transition hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
    >
      {status}
      <span
        aria-hidden="true"
        className={`flex h-5 w-9 items-center rounded-full p-0.5 transition-colors ${
          isActive ? "bg-emerald-500" : "bg-[#c6b9c0]"
        }`}
      >
        <span
          className={`size-4 rounded-full bg-white shadow-sm transition-transform ${
            isActive ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  )
}

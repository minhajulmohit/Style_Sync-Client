"use client"

import { useState, type ChangeEvent, type FormEvent } from "react"
import { Dialog } from "@base-ui/react/dialog"
import { LoaderCircle, Pencil } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { updateService } from "@/lib/actions/services"
import { uploadImageToImgBB } from "@/lib/api/image-upload"
import {
  SERVICE_CATEGORIES,
  SERVICE_STATUSES,
  type AddServicePayload,
  type ServiceRecord,
} from "@/types/services"

const fieldClassName =
  "mt-2 h-10 w-full rounded-xl border border-rose-100 bg-white px-3 text-sm text-[#493943] outline-none transition focus:border-rose-300 focus:ring-4 focus:ring-rose-100"

export function UpdateServiceButton({
  service,
  serviceId,
  onUpdated,
}: {
  service: ServiceRecord
  serviceId: string
  onUpdated: (service: ServiceRecord) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const image = event.currentTarget.files?.[0]

    if (!image) {
      setImagePreview(null)
      return
    }

    if (!image.type.startsWith("image/")) {
      setImagePreview(null)
      setErrorMessage("Choose an image file.")
      event.currentTarget.value = ""
      return
    }
    if (image.size > 4 * 1024 * 1024) {
      setImagePreview(null)
      setErrorMessage("Choose an image smaller than 4 MB.")
      event.currentTarget.value = ""
      return
    }

    setErrorMessage("")
    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImagePreview(reader.result)
      }
    }

    reader.onerror = () => {
      setImagePreview(null)
      setErrorMessage("Could not preview this image. Please choose it again.")
    }

    reader.readAsDataURL(image)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage("")

    const formData = new FormData(event.currentTarget)
    const serviceName = formData.get("serviceName")
    const categoryValue = formData.get("category")
    const description = formData.get("description")
    const price = Number(formData.get("price"))
    const duration = Number(formData.get("duration"))
    const imageFile = formData.get("image")
    const statusValue = formData.get("status")

    const category = SERVICE_CATEGORIES.find(
      (option) => option === categoryValue,
    )
    const status = SERVICE_STATUSES.find(
      (option) => option === statusValue,
    )

    if (
      typeof serviceName !== "string" ||
      !serviceName.trim() ||
      !category ||
      typeof description !== "string" ||
      !description.trim() ||
      !Number.isFinite(price) ||
      price <= 0 ||
      !Number.isInteger(duration) ||
      duration <= 0 ||
      !status ||
      typeof service.image !== "string"
    ) {
      setErrorMessage(
        "Fill in all fields. Price and duration must be greater than zero.",
      )
      return
    }

    setIsUpdating(true)

    try {
      const imageUrl =
        imageFile instanceof File && imageFile.size > 0
          ? await uploadImageToImgBB(imageFile)
          : service.image

      const updatedServicePayload: AddServicePayload = {
        serviceName: serviceName.trim(),
        category,
        description: description.trim(),
        price,
        duration,
        image: imageUrl,
        status,
      }

      await updateService(serviceId, updatedServicePayload)
      const updatedService: ServiceRecord = {
        ...service,
        ...updatedServicePayload,
      }
      onUpdated(updatedService)
      setImagePreview(null)
      setIsOpen(false)
    } catch (error) {
      console.error("Could not update service:", error)
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Could not update this service. Please try again.",
      )
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!isUpdating) {
          setIsOpen(open)
          if (!open) {
            setErrorMessage("")
            setImagePreview(null)
          }
        }
      }}
    >
      <Button
        type="button"
        variant="outline"
        className="h-10 rounded-xl border-rose-100 text-[#d95272] hover:bg-rose-50"
        onClick={() => setIsOpen(true)}
      >
        <Pencil aria-hidden="true" />
        Update
      </Button>

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-rose-100 bg-[#fffaf8] p-5 shadow-2xl shadow-rose-950/15 outline-none sm:p-7">
          <div className="mb-6">
            <Dialog.Title className="font-heading text-xl font-semibold text-[#352a31]">
              Update service
            </Dialog.Title>
            <Dialog.Description className="mt-1 text-sm text-[#8e7e86]">
              Edit the service information below.
            </Dialog.Description>
          </div>

          <form
            key={isOpen ? "open" : "closed"}
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="update-service-name"
                  className="text-sm font-medium text-[#493943]"
                >
                  Service name
                </label>
                <input
                  id="update-service-name"
                  name="serviceName"
                  required
                  defaultValue={service.serviceName}
                  className={fieldClassName}
                />
              </div>

              <div>
                <label
                  htmlFor="update-service-category"
                  className="text-sm font-medium text-[#493943]"
                >
                  Category
                </label>
                <select
                  id="update-service-category"
                  name="category"
                  required
                  defaultValue={service.category}
                  className={fieldClassName}
                >
                  {SERVICE_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="update-service-status"
                  className="text-sm font-medium text-[#493943]"
                >
                  Status
                </label>
                <select
                  id="update-service-status"
                  name="status"
                  required
                  defaultValue={service.status}
                  className={fieldClassName}
                >
                  {SERVICE_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="update-service-price"
                  className="text-sm font-medium text-[#493943]"
                >
                  Price
                </label>
                <input
                  id="update-service-price"
                  name="price"
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  defaultValue={service.price}
                  className={fieldClassName}
                />
              </div>

              <div>
                <label
                  htmlFor="update-service-duration"
                  className="text-sm font-medium text-[#493943]"
                >
                  Duration (minutes)
                </label>
                <input
                  id="update-service-duration"
                  name="duration"
                  type="number"
                  min="1"
                  step="1"
                  required
                  defaultValue={service.duration}
                  className={fieldClassName}
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="update-service-description"
                  className="text-sm font-medium text-[#493943]"
                >
                  Description
                </label>
                <textarea
                  id="update-service-description"
                  name="description"
                  required
                  rows={4}
                  defaultValue={service.description}
                  className="mt-2 w-full resize-y rounded-xl border border-rose-100 bg-white px-3 py-2.5 text-sm text-[#493943] outline-none transition focus:border-rose-300 focus:ring-4 focus:ring-rose-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="update-service-image"
                  className="text-sm font-medium text-[#493943]"
                >
                  Service image
                </label>
                <div className="mt-2 flex flex-wrap items-center gap-4 rounded-xl border border-rose-100 bg-white p-3">
                  {(imagePreview || service.image) && (
                    <Image
                      src={imagePreview || service.image}
                      alt={
                        imagePreview
                          ? "Selected service image preview"
                          : `Current ${service.serviceName} service`
                      }
                      width={64}
                      height={64}
                      unoptimized
                      className="size-16 rounded-lg object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <input
                      id="update-service-image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-[#756a72] file:mr-3 file:rounded-lg file:border-0 file:bg-rose-50 file:px-3 file:py-2 file:text-xs file:font-medium file:text-[#d95272] hover:file:bg-rose-100"
                    />
                    <p className="mt-1 text-xs text-[#9a8d95]">
                      Leave empty to keep the current image. New images must
                      be 4 MB or smaller.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {errorMessage && (
              <p
                role="alert"
                className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
              >
                {errorMessage}
              </p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-rose-100 pt-5 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                disabled={isUpdating}
                onClick={() => {
                  setIsOpen(false)
                  setErrorMessage("")
                  setImagePreview(null)
                }}
                className="h-10 rounded-xl border-rose-100"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUpdating}
                className="h-10 rounded-xl gradient-surface px-5 shadow-md shadow-rose-200/50 hover:opacity-90"
              >
                {isUpdating ? (
                  <>
                    <LoaderCircle
                      aria-hidden="true"
                      className="animate-spin"
                    />
                    Updating...
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </div>
          </form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

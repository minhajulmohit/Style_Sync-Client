"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowLeft, ImagePlus, LoaderCircle, Scissors } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { addService } from "@/lib/actions/services";
import { uploadImageToImgBB } from "@/lib/api/image-upload";
import {
  SERVICE_CATEGORIES,
  SERVICE_STATUSES,
} from "@/types/services";

const fieldClassName =
  "mt-2 h-11 w-full rounded-xl border border-rose-100 bg-white px-3.5 text-sm text-[#493943] outline-none transition placeholder:text-[#b5a8af] focus:border-rose-300 focus:ring-4 focus:ring-rose-100";

export default function AddServicePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const image = event.currentTarget.files?.[0];

    if (!image) {
      setImagePreview(null);
      return;
    }

    if (!image.type.startsWith("image/")) {
      setImagePreview(null);
      setErrorMessage("Choose an image file to continue.");
      event.currentTarget.value = "";
      return;
    }
    if (image.size > 4 * 1024 * 1024) {
      setImagePreview(null);
      setErrorMessage("Choose an image smaller than 4 MB.");
      event.currentTarget.value = "";
      return;
    }

    setErrorMessage("");
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImagePreview(reader.result);
      }
    };

    reader.onerror = () => {
      setImagePreview(null);
      setErrorMessage("Could not preview this image. Please choose it again.");
    };

    reader.readAsDataURL(image);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const serviceName = formData.get("serviceName");
    const categoryValue = formData.get("category");
    const description = formData.get("description");
    const price = Number(formData.get("price"));
    const duration = Number(formData.get("duration"));
    const image = formData.get("image");
    const statusValue = formData.get("status");

    const category = SERVICE_CATEGORIES.find(
      (option) => option === categoryValue,
    );
    const status = SERVICE_STATUSES.find((option) => option === statusValue);

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
      !(image instanceof File) ||
      image.size === 0 ||
      !status
    ) {
      setErrorMessage(
        "Fill in all fields. Price and duration must be greater than zero, and choose an image.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const imageUrl = await uploadImageToImgBB(image);

      await addService({
        serviceName: serviceName.trim(),
        category,
        description: description.trim(),
        price,
        duration,
        image: imageUrl,
        status,
      });

      form.reset();
      setImagePreview(null);
      setSuccessMessage("Service added successfully.");
    } catch (error) {
      console.error("Could not add service:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Could not add the service. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-full bg-[#fffaf8] px-4 pb-10 pt-7 sm:px-7 lg:px-10">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/dashboard/admin"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#8e7e86] transition hover:text-[#e45c78]"
        >
          <ArrowLeft size={16} />
          Back to overview
        </Link>

        <div className="mb-6 flex items-center gap-3">
          <span className="gradient-surface flex size-11 items-center justify-center rounded-2xl shadow-md shadow-rose-200/50">
            <Scissors aria-hidden="true" size={20} />
          </span>
          <div>
            <h1 className="font-heading text-2xl font-semibold tracking-tight text-[#352a31]">
              Add a new service
            </h1>
            <p className="mt-1 text-sm text-[#8e7e86]">
              Add the details customers need to book this service.
            </p>
          </div>
        </div>

        <form
          noValidate
          onSubmit={handleSubmit}
          className="rounded-2xl border border-rose-100/70 bg-white p-5 shadow-sm shadow-rose-100/50 sm:p-8"
        >
          <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label
                htmlFor="serviceName"
                className="text-sm font-medium text-[#493943]"
              >
                Service name <span className="text-rose-500">*</span>
              </label>
              <input
                id="serviceName"
                name="serviceName"
                type="text"
                required
                placeholder="e.g. Signature haircut"
                className={fieldClassName}
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="text-sm font-medium text-[#493943]"
              >
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                required
                defaultValue=""
                className={fieldClassName}
              >
                <option value="" disabled>
                  Choose a category
                </option>
                {SERVICE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="status"
                className="text-sm font-medium text-[#493943]"
              >
                Status <span className="text-rose-500">*</span>
              </label>
              <select
                id="status"
                name="status"
                required
                defaultValue="Active"
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
                htmlFor="price"
                className="text-sm font-medium text-[#493943]"
              >
                Price <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-7.5 -translate-y-1/2 text-sm text-[#9a8d95]">
                  $
                </span>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  placeholder="0.00"
                  className={`${fieldClassName} pl-8`}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="duration"
                className="text-sm font-medium text-[#493943]"
              >
                Duration <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="duration"
                  name="duration"
                  type="number"
                  min="1"
                  step="1"
                  required
                  placeholder="e.g. 45"
                  className={`${fieldClassName} pr-16`}
                />
                <span className="absolute right-3.5 top-7.5 -translate-y-1/2 text-sm text-[#9a8d95]">
                  minutes
                </span>
              </div>
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="text-sm font-medium text-[#493943]"
              >
                Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                placeholder="Describe what this service includes..."
                className="mt-2 w-full resize-y rounded-xl border border-rose-100 bg-white px-3.5 py-3 text-sm text-[#493943] outline-none transition placeholder:text-[#b5a8af] focus:border-rose-300 focus:ring-4 focus:ring-rose-100"
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="image"
                className="text-sm font-medium text-[#493943]"
              >
                Service image <span className="text-rose-500">*</span>
              </label>
              <label
                htmlFor="image"
                className="mt-2 flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-rose-200 bg-[#fffaf8] px-4 py-5 text-center transition hover:border-rose-300 hover:bg-rose-50/50 focus-within:ring-4 focus-within:ring-rose-100"
              >
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Selected service preview"
                    width={96}
                    height={96}
                    unoptimized
                    className="mb-3 size-24 rounded-xl object-cover"
                  />
                ) : (
                  <ImagePlus
                    aria-hidden="true"
                    className="mb-2 text-[#e77a8e]"
                    size={22}
                  />
                )}
                <span className="text-sm font-medium text-[#493943]">
                  {imagePreview
                    ? "Choose a different image"
                    : "Choose an image to upload"}
                </span>
                <span className="mt-1 text-xs text-[#9a8d95]">
                  JPG, PNG, or another image format, up to 4 MB
                </span>
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  required
                  className="sr-only"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          {errorMessage && (
            <p
              role="alert"
              className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
            >
              {errorMessage}
            </p>
          )}
          {successMessage && (
            <p
              role="status"
              className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
            >
              {successMessage}
            </p>
          )}

          <div className="mt-7 flex justify-end border-t border-rose-50 pt-5">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full rounded-xl gradient-surface px-6 shadow-md shadow-rose-200/50 hover:opacity-90 sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="animate-spin" />
                  Adding service...
                </>
              ) : (
                "Add Service"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

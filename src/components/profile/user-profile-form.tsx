"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import {
  Camera,
  Check,
  ImagePlus,
  LoaderCircle,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import { useState, type ChangeEvent, type FormEvent } from "react";

interface ImgBBUploadResponse {
  success: boolean;
  data?: {
    display_url: string;
  };
  error?: {
    message?: string;
  };
}

export function UserProfileForm() {
  const {
    data: session,
    isPending,
    error: sessionError,
    refetch,
  } = authClient.useSession();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const uploadImageToImgBB = async (imageFile: File): Promise<string> => {
    const apiKey = process.env.NEXT_PUBLIC_IMAGEBB_API;
    if (!apiKey) {
      throw new Error("Profile image uploads are not configured.");
    }

    const uploadData = new FormData();
    uploadData.append("image", imageFile);
    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      { method: "POST", body: uploadData },
    );
    const result = (await response.json()) as ImgBBUploadResponse;

    if (!response.ok || !result.success || !result.data?.display_url) {
      throw new Error(result.error?.message ?? "Image upload failed.");
    }

    return result.data.display_url;
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const imageFile = event.target.files?.[0];
    if (!imageFile) {
      setImagePreview(null);
      return;
    }

    if (!imageFile.type.startsWith("image/")) {
      event.target.value = "";
      setImagePreview(null);
      toast.add({
        type: "error",
        title: "Choose an image file",
        description: "Select a JPG, PNG, or another image format.",
      });
      return;
    }

    if (imageFile.size > 32 * 1024 * 1024) {
      event.target.value = "";
      setImagePreview(null);
      toast.add({
        type: "error",
        title: "Image is too large",
        description: "Choose an image smaller than 32 MB.",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImagePreview(reader.result);
      }
    };
    reader.onerror = () => {
      toast.add({
        type: "error",
        title: "Could not preview image",
        description: "Try choosing the image again.",
      });
    };
    reader.readAsDataURL(imageFile);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const imageFile = formData.get("image");

    if (!name) {
      toast.add({
        type: "error",
        title: "Name is required",
        description: "Enter your name before saving your profile.",
      });
      return;
    }

    setIsSaving(true);
    try {
      const image =
        imageFile instanceof File && imageFile.size > 0
          ? await uploadImageToImgBB(imageFile)
          : (session?.user.image ?? null);

      const { data, error } = await authClient.updateUser({
        name,
        phone: phone || null,
        image,
      });

      if (error) {
        toast.add({
          type: "error",
          title: "Could not update profile",
          description: error.message,
        });
        return;
      }

      if (!data?.status) {
        throw new Error(
          "The profile update was not confirmed. Please try again.",
        );
      }

      await refetch();
      const imageInput = form.elements.namedItem("image");
      if (imageInput instanceof HTMLInputElement) {
        imageInput.value = "";
      }
      setImagePreview(null);
      toast.add({
        type: "success",
        title: "Profile updated",
        description: "Your profile changes have been saved.",
      });
    } catch (submitError) {
      console.error("Profile update failed:", submitError);
      toast.add({
        type: "error",
        title: "Could not update profile",
        description:
          submitError instanceof Error
            ? submitError.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-64 items-center justify-center gap-3 text-sm text-[#8e7e86]">
        <LoaderCircle aria-hidden="true" className="animate-spin" size={18} />
        Loading your profile...
      </div>
    );
  }

  if (sessionError || !session) {
    return (
      <div className="rounded-2xl border border-rose-100 bg-white p-6 text-sm text-[#8e7e86] shadow-sm">
        We could not load your profile. Please sign in again and try once more.
      </div>
    );
  }

  const user = session.user;
  const isAdmin = (user.role ?? "")
    .split(",")
    .some((role) => role.trim().toLowerCase() === "admin");
  const roleLabel = isAdmin ? "Admin" : "Customer";
  const isBlocked = user.banned === true;
  const imageSource = imagePreview || user.image;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="relative overflow-hidden rounded-[1.75rem] border border-rose-100/80 bg-white shadow-sm shadow-rose-100/50">
        <div className="h-28 bg-linear-to-r from-rose-100 via-orange-50 to-purple-100 sm:h-36" />
        <div className="relative px-5 pb-6 sm:px-8">
          <div className="-mt-12 flex flex-wrap items-end justify-between gap-4 sm:-mt-14">
            <div className="relative">
              <div className="grid size-24 place-items-center overflow-hidden rounded-full border-4 border-white bg-rose-50 text-[#dd6580] shadow-md shadow-rose-200/50 sm:size-28">
                {imageSource ? (
                  <Image
                    src={imageSource}
                    alt={`${user.name}'s profile picture`}
                    width={112}
                    height={112}
                    unoptimized
                    className="size-full object-cover"
                  />
                ) : (
                  <UserRound aria-hidden="true" size={38} strokeWidth={1.5} />
                )}
              </div>
              <label
                htmlFor="profile-image"
                className="absolute bottom-1 right-0 grid size-8 cursor-pointer place-items-center rounded-full bg-[#e95d78] text-white ring-2 ring-white transition hover:bg-[#d94d69]"
                aria-label="Choose a new profile picture"
              >
                <Camera aria-hidden="true" size={15} />
              </label>
            </div>
            <div className="flex flex-wrap gap-2 pb-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700">
                <ShieldCheck aria-hidden="true" size={14} />
                {roleLabel}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  isBlocked
                    ? "bg-rose-50 text-rose-700"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`size-1.5 rounded-full ${
                    isBlocked ? "bg-rose-500" : "bg-emerald-500"
                  }`}
                />
                {isBlocked ? "Blocked" : "Active"}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <h1 className="font-heading text-2xl font-semibold tracking-tight text-[#352a31]">
              {user.name}
            </h1>
            <p className="mt-1 text-sm text-[#8e7e86]">
              Keep your account details up to date.
            </p>
          </div>

          <Input
            id="profile-image"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-5 h-auto cursor-pointer border-dashed border-rose-200 bg-rose-50/40 py-2.5 text-xs file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-1.5 file:font-medium file:text-[#a14d62]"
          />
          <p className="mt-2 flex items-center gap-1.5 text-xs text-[#9a8d95]">
            <ImagePlus aria-hidden="true" size={13} />
            JPG, PNG, or another image format (up to 32 MB)
          </p>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-rose-100/80 bg-white p-5 shadow-sm shadow-rose-100/50 sm:p-8">
        <div className="mb-6">
          <h2 className="font-heading text-lg font-semibold text-[#352a31]">
            Personal information
          </h2>
          <p className="mt-1 text-sm text-[#8e7e86]">
            Update the details connected to your account.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="profile-name" className="text-[#594a53]">
              Full name
            </Label>
            <Input
              id="profile-name"
              name="name"
              type="text"
              required
              maxLength={100}
              defaultValue={user.name}
              placeholder="Your full name"
              className="h-11 rounded-xl border-rose-100 bg-[#fffdfc] px-3.5 focus-visible:border-[#e96b83] focus-visible:ring-[#e96b83]/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-email" className="text-[#594a53]">
              Email address
            </Label>
            <div className="relative">
              <Mail
                aria-hidden="true"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#b3a5ac]"
                size={16}
              />
              <Input
                id="profile-email"
                type="email"
                value={user.email}
                readOnly
                disabled
                className="h-11 rounded-xl border-rose-100 bg-rose-50/50 pl-10 text-[#81747c]"
              />
            </div>
            <p className="text-xs text-[#9a8d95]">
              Email addresses cannot be changed here.
            </p>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="profile-phone" className="text-[#594a53]">
              Phone number
            </Label>
            <div className="relative">
              <Phone
                aria-hidden="true"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#b3a5ac]"
                size={16}
              />
              <Input
                id="profile-phone"
                name="phone"
                type="tel"
                defaultValue={user.phone ?? ""}
                placeholder="Add your phone number"
                className="h-11 rounded-xl border-rose-100 bg-[#fffdfc] pl-10 focus-visible:border-[#e96b83] focus-visible:ring-[#e96b83]/20"
              />
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-col-reverse gap-3 border-t border-rose-50 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-[#9a8d95]">
            Role and account status are managed by your administrator.
          </p>
          <Button
            type="submit"
            disabled={isSaving}
            className="h-11 rounded-xl bg-[#e95d78] px-5 font-semibold text-white shadow-md shadow-rose-200/60 hover:bg-[#d94d69]"
          >
            {isSaving ? (
              <>
                <LoaderCircle aria-hidden="true" className="animate-spin" />
                Saving changes...
              </>
            ) : (
              <>
                <Check aria-hidden="true" />
                Update profile
              </>
            )}
          </Button>
        </div>
      </section>
    </form>
  );
}

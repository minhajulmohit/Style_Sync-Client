"use client";

import { FieldGroup, FieldSet } from "@/components/ui/field";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { uploadImageToImgBB } from "@/lib/api/image-upload";
import { Field, Input } from "@base-ui/react";
import {
  Camera,
  Eye,
  EyeOff,
  UserPlus,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useState, type ChangeEvent, type FormEvent } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const imageFile = event.target.files?.[0];

    if (!imageFile) {
      return;
    }

    if (!imageFile.type.startsWith("image/")) {
      setImagePreview(null);
      toast.add({
        type: "error",
        title: "Choose an image file",
        description: "Select a JPG, PNG, or another image file.",
      });
      event.currentTarget.value = "";
      return;
    }

    if (imageFile.size > 4 * 1024 * 1024) {
      setImagePreview(null);
      toast.add({
        type: "error",
        title: "Image is too large",
        description: "Choose an image smaller than 4 MB.",
      });
      event.currentTarget.value = "";
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

  const onSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const image = formData.get("image");

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      toast.add({
        type: "error",
        title: "Check your details",
        description: "Enter your name, email, and password to continue.",
      });
      return;
    }
    if (password.length < 6) {
      toast.add({
        type: "error",
        title: "Password is too short",
        description: "Password must be at least 6 characters long.",
      });
      return;
    }

    if (!/[A-Z]/.test(password)) {
      toast.add({
        type: "error",
        title: "Password needs an uppercase letter",
        description: "Add at least one uppercase letter (A-Z).",
      });
      return;
    }

    if (!/[a-z]/.test(password)) {
      toast.add({
        type: "error",
        title: "Password needs a lowercase letter",
        description: "Add at least one lowercase letter (a-z).",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl: string | undefined;

      if (image instanceof File && image.size > 0) {
        imageUrl = await uploadImageToImgBB(image);
      }

      const { data, error } = await authClient.signUp.email({
        name,
        email,
        password,
        image: imageUrl,
        callbackURL: "/signin",
      });

      if (error) {
        toast.add({
          type: "error",
          title: "Could not create your account",
          description: error.message,
        });
        return;
      }

      if (!data) {
        toast.add({
          type: "error",
          title: "Could not create your account",
          description: "Please try again.",
        });
        return;
      }

      toast.add({
        type: "success",
        title: "Account created",
        description: "Your StyleSync account is ready.",
      });
      router.push("/signin");
      router.refresh();
    } catch (error) {
      console.error("Signup failed:", error);
      toast.add({
        type: "error",
        title: "Sign-up failed",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsSubmitting(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });

      if (error) {
        setIsSubmitting(false);
        toast.add({
          type: "error",
          title: "Google sign-up failed",
          description: error.message,
        });
      }
    } catch (error) {
      console.error("Google sign-up failed:", error);
      setIsSubmitting(false);
      toast.add({
        type: "error",
        title: "Google sign-up failed",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 sm:py-16">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-[2rem] border border-rose-100 bg-card p-6 shadow-xl shadow-rose-100/70 sm:p-9"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-3 flex size-10 items-center justify-center rounded-xl gradient-surface shadow-sm shadow-rose-200/70">
            <UserPlus aria-hidden="true" size={19} />
          </div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
            Join <span className="gradient-text">StyleSync</span>
          </h1>
          <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
            Find your style and book your next salon visit.
          </p>
        </div>

        <FieldSet className="w-full">
          <div className="flex flex-col items-center">
            <label
              htmlFor="profile-image"
              className="group relative grid size-24 cursor-pointer place-items-center rounded-full border-4 border-white bg-rose-50 text-primary shadow-md shadow-rose-200/70 ring-1 ring-rose-100"
              aria-label="Upload a profile image"
            >
              <span className="absolute inset-0 grid place-items-center overflow-hidden rounded-full border-4 border-white">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Profile preview"
                    width={98}
                    height={98}
                    unoptimized
                    className="size-full rounded-full object-cover"
                  />
                ) : (
                  <UserRound aria-hidden="true" size={34} strokeWidth={1.5} />
                )}
              </span>
              <span className="absolute bottom-0 right-0 grid size-8 place-items-center rounded-full gradient-surface ring-2 ring-white">
                <Camera aria-hidden="true" size={15} />
              </span>
            </label>
            <input
              id="profile-image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="sr-only"
            />
            <p className="mt-3 text-xs text-muted-foreground">
              Upload a profile photo (up to 4 MB)
            </p>
          </div>

          <FieldGroup className="gap-4">
            <Field.Root>
              <Field.Label
                htmlFor="full-name"
                className="text-sm font-medium text-foreground"
              >
                Full name
              </Field.Label>
              <Input
                id="full-name"
                name="name"
                type="text"
                required
                placeholder="Enter your full name"
                className="h-12 w-full rounded-xl border border-rose-100 bg-background px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10"
              />
            </Field.Root>

            <Field.Root>
              <Field.Label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email address
              </Field.Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="h-12 w-full rounded-xl border border-rose-100 bg-background px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10"
              />
            </Field.Root>

            <Field.Root>
              <Field.Label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </Field.Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  minLength={6}
                  required
                  placeholder="Your password"
                  className="h-12 w-full rounded-xl border border-rose-100 bg-background px-4 pr-12 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 inline-flex w-12 items-center justify-center rounded-r-xl text-muted-foreground transition hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-primary"
                >
                  {showPassword ? (
                    <EyeOff aria-hidden="true" size={18} />
                  ) : (
                    <Eye aria-hidden="true" size={18} />
                  )}
                </button>
              </div>
              <Field.Description className="text-xs text-muted-foreground">
                At least 6 characters one uppercase and lowercase.
              </Field.Description>
            </Field.Root>
          </FieldGroup>
        </FieldSet>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl gradient-surface font-medium shadow-md shadow-rose-200/70 transition hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-60"
        >
          {isSubmitting ? "Please wait..." : "Create account"}
        </button>
        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-rose-100" />
          OR SIGN UP WITH EMAIL
          <span className="h-px flex-1 bg-rose-100" />
        </div>
        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={isSubmitting}
          className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-rose-100 bg-white font-medium text-foreground transition hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-60"
        >
          <span
            aria-hidden="true"
            className="font-heading text-lg font-bold text-primary"
          >
            G
          </span>
          {isSubmitting ? "Connecting to Google..." : "Continue with Google"}
        </button>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Have an account?{" "}
          <Link
            href="/signin"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </main>
  );
}

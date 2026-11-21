"use client";

import { Field, Input } from "@base-ui/react";
import { FieldGroup, FieldSet } from "@/components/ui/field";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { Eye, EyeOff, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function SignInPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    if (typeof email !== "string" || typeof password !== "string") {
      toast.add({
        type: "error",
        title: "Check your details",
        description: "Enter your email and password to continue.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/dashboard",
      });

      if (error) {
        toast.add({
          type: "error",
          title: "Could not sign in",
          description: error.message,
        });
        return;
      }

      if (!data) {
        toast.add({
          type: "error",
          title: "Could not sign in",
          description: "Please check your details and try again.",
        });
        return;
      }

      toast.add({
        type: "success",
        title: "Signed in",
        description: "Welcome back to StyleSync.",
      });
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Sign-in failed:", error);
      toast.add({
        type: "error",
        title: "Sign-in failed",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
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
          title: "Google sign-in failed",
          description: error.message,
        });
      }
    } catch (error) {
      console.error("Google sign-in failed:", error);
      setIsSubmitting(false);
      toast.add({
        type: "error",
        title: "Google sign-in failed",
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
            <LogIn aria-hidden="true" size={19} />
          </div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
            Welcome back
          </h1>
          <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
            Sign in to continue to <span className="gradient-text">StyleSync</span>.
          </p>
        </div>

        <FieldSet className="w-full">
          <FieldGroup className="gap-4">
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
                autoComplete="email"
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
                  autoComplete="current-password"
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
            </Field.Root>
          </FieldGroup>
        </FieldSet>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl gradient-surface font-medium shadow-md shadow-rose-200/70 transition hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-60"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>

        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-rose-100" />
          OR CONTINUE WITH
          <span className="h-px flex-1 bg-rose-100" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
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
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </form>
    </main>
  );
}

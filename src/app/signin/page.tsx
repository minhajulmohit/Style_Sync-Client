"use client";

import type { FormEvent } from "react";

import { authClient } from "../../lib/auth-client";

interface SignInCredentials {
  email: string;

  password: string;
}

interface SignInAuthResponse {
  data?: unknown;

  error?: unknown;
}

const SignInPage = () => {
  const onSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const user = Object.fromEntries(
      formData.entries(),
    ) as Partial<SignInCredentials>;

    const { data, error }: SignInAuthResponse = await authClient.signIn.email({
      email: user.email as string,

      password: user.password as string,

      callbackURL: "/",
    });

    if (data) {
      // YOU CAN SHOW TOAST
    }

    if (error) {
      // YOU CAN SHOW TOAST
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>YOUR DESIGNED SIGN IN SECTION</form>
    </div>
  );
};

export default SignInPage;

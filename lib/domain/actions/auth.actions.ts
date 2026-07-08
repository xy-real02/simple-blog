"use server";

import { redirect } from "next/navigation";
import {
  auth,
  signIn,
  signOut,
  signUp,
} from "@/lib/domain/services/auth.service";
import type { ActionSession } from "@/lib/entities/auth.type";

function readField(formData: FormData, name: string): string {
  return String(formData.get(name) ?? "").trim();
}

/** Returns the current user session with role, or null if unauthenticated. */
export async function getSessionAction(): Promise<ActionSession | null> {
  return auth();
}

export async function signInAction(formData: FormData) {
  const email = readField(formData, "email");
  const password = readField(formData, "password");
  const callbackURL = readField(formData, "callbackURL") || "/";

  const result = await signIn({ email, password, callbackURL, rememberMe: true });

  if (!result.ok) {
    redirect(`/sign-in?error=${encodeURIComponent(result.error)}`);
  }

  redirect(callbackURL);
}

export async function signUpAction(formData: FormData) {
  const name = readField(formData, "name");
  const email = readField(formData, "email");
  const password = readField(formData, "password");
  const callbackURL = readField(formData, "callbackURL") || "/";

  const result = await signUp({ name, email, password, callbackURL });

  if (!result.ok) {
    redirect(`/sign-up?error=${encodeURIComponent(result.error)}`);
  }

  redirect(callbackURL);
}

export async function signOutAction() {
  const result = await signOut();

  if (!result.ok) {
    redirect(`/?error=${encodeURIComponent(result.error)}`);
  }

  redirect("/sign-in");
}

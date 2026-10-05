"use server";

import { registerUserAccount } from "@/lib/users";

export async function signUpUserAction(formData: {
  username: string;
  email: string;
  password: string;
  name?: string;
}) {
  try {
    const res = await registerUserAccount(formData);
    return res;
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create account" };
  }
}

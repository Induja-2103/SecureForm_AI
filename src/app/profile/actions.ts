"use server";

import { saveUserProfile } from "@/lib/store";
import { revalidatePath } from "next/cache";
import { UserProfile } from "@/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function updateProfileAction(profile: UserProfile) {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email || profile.email;
  await saveUserProfile(profile, userEmail);
  revalidatePath("/profile");
}

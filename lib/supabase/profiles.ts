import { supabase } from "@/lib/supabase/client"

export type ProfileRow = {
  role?: string | null
  id?: string | null
  user_id?: string | null
  auth_user_id?: string | null
  profile_id?: string | null
  full_name?: string | null
  [key: string]: unknown
}

export async function getProfileForUser(userId: string) {
  try {
    const directProfile = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle()

    if (directProfile.data) {
      return directProfile.data as ProfileRow
    }
  } catch {
    // Fall back to a broader scan if the profile key is not `id`.
  }

  const { data, error } = await supabase.from("profiles").select("*")

  if (error) {
    throw error
  }

  const profiles = (data ?? []) as ProfileRow[]

  return (
    profiles.find(
      (profile) =>
        profile.id === userId ||
        profile.user_id === userId ||
        profile.auth_user_id === userId ||
        profile.profile_id === userId,
    ) ?? null
  )
}

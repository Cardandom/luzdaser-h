import { supabase } from "@/lib/supabase/client"

export type ProfileRow = {
  id: string
  full_name: string | null
  role: string | null
}

export async function getProfileForUser(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", userId)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data as ProfileRow | null
}

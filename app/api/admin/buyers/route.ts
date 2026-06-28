import { NextResponse } from "next/server"

import { supabaseAdmin } from "@/lib/supabase/admin"

type BuyerRequestBody = {
  full_name?: unknown
  email?: unknown
  phone?: unknown
  password?: unknown
}

function getBearerToken(authorizationHeader: string | null) {
  if (!authorizationHeader?.startsWith("Bearer ")) {
    return null
  }

  const token = authorizationHeader.slice("Bearer ".length).trim()

  return token || null
}

export async function POST(request: Request) {
  const authorizationHeader = request.headers.get("authorization")
  const accessToken = getBearerToken(authorizationHeader)

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(
    accessToken,
  )

  if (userError || !userData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: profileData, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("id, role")
    .eq("id", userData.user.id)
    .maybeSingle()

  if (profileError) {
    return NextResponse.json(
      { error: "Could not verify admin permissions." },
      { status: 500 },
    )
  }

  if (!profileData || String(profileData.role ?? "").toLowerCase() !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  let body: BuyerRequestBody | null = null

  try {
    body = (await request.json()) as BuyerRequestBody
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const fullName = typeof body.full_name === "string" ? body.full_name.trim() : ""
  const email = typeof body.email === "string" ? body.email.trim() : ""
  const phone =
    typeof body.phone === "string" ? body.phone.trim() : ""
  const password = typeof body.password === "string" ? body.password : ""

  if (!fullName || !email || !password) {
    return NextResponse.json(
      {
        error: "full_name, email, and password are required.",
      },
      { status: 400 },
    )
  }

  const { data: authUserData, error: createUserError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
      },
    })

  if (createUserError || !authUserData.user) {
    return NextResponse.json(
      {
        error:
          createUserError?.message ?? "Could not create the buyer account.",
      },
      { status: 400 }
    )
  }

  const buyerId = authUserData.user.id

  const { data: buyerProfile, error: insertError } = await supabaseAdmin
    .from("profiles")
    .insert({
      id: buyerId,
      full_name: fullName,
      email,
      phone: phone || null,
      role: "client",
    })
    .select("id, full_name, email, phone, role, created_at")
    .single()

  if (insertError || !buyerProfile) {
    try {
      await supabaseAdmin.auth.admin.deleteUser(buyerId)
    } catch {
      // Best-effort cleanup only.
    }

    return NextResponse.json(
      {
        error:
          insertError?.message ?? "Could not create the buyer profile.",
      },
      { status: 500 },
    )
  }

  return NextResponse.json({ buyer: buyerProfile }, { status: 201 })
}

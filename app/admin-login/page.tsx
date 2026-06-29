import { PortalLoginForm } from "@/components/site/portal-login-form"

export default function AdminLoginPage() {
  return (
    <PortalLoginForm
      eyebrow="Reina Sophia"
      title="Admin Access"
      subtitle="Authorized Reina Sophia administrators only."
      expectedRole="admin"
      successPath="/admin"
      mismatchMessage="This portal is reserved for clients. Please use the client login page."
      mismatchRedirectPath="/client"
    />
  )
}

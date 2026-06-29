import { PortalLoginForm } from "@/components/site/portal-login-form"

export default function ClientLoginPage() {
  return (
    <PortalLoginForm
      eyebrow="Client portal"
      title="Client Portal Login"
      subtitle="Access your property progress, files, and updates."
      expectedRole="client"
      successPath="/client"
      mismatchMessage="Please use the admin access route."
      mismatchRedirectPath="/admin"
    />
  )
}

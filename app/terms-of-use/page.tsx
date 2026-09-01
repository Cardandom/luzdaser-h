import type { Metadata } from "next"

import {
  LegalList,
  LegalPage,
  LegalSection,
} from "@/components/site/legal-page"
import {
  brandName,
  chamberRegistration,
  companyDisplayName,
  legalEntityName,
  privacyEmail,
  registeredAddress,
} from "@/lib/legal-config"

export const metadata: Metadata = {
  title: `Terms of Use | ${brandName}`,
  description: `Review the terms governing use of the ${brandName} website, project information, Client Portal, and third-party services.`,
}

export default function TermsOfUsePage() {
  return (
    <LegalPage
      eyebrow="Website terms"
      title="Terms of Use"
      introduction={`These Terms govern access to and use of the ${brandName} website and its Client Portal features. Please read them together with any definitive documentation that applies to your relationship with us.`}
      lastUpdated="August 30, 2026"
    >
      <LegalSection id="scope" title="1. Scope and acceptance">
        <p>
          This website presents {brandName} and is provided by{" "}
          {legalEntityName}. {companyDisplayName} and {brandName} may be used as
          commercial or brand names.
        </p>
        <div className="rounded-2xl border border-luxury-border bg-stone-50 p-5">
          <p>
            <strong className="text-foreground">Legal entity:</strong>{" "}
            {legalEntityName}
          </p>
          <p>
            <strong className="text-foreground">Registered address:</strong>{" "}
            {registeredAddress}
          </p>
          <p>
            <strong className="text-foreground">
              Aruba Chamber of Commerce registration:
            </strong>{" "}
            {chamberRegistration}
          </p>
        </div>
        <p>
          By accessing or using this website, you agree to these Terms to the
          extent permitted by applicable law. If you do not agree, do not use the
          website. Additional terms may apply to authenticated features,
          particular services, reservations, or purchases.
        </p>
      </LegalSection>

      <LegalSection
        id="informational-purpose"
        title="2. Informational and marketing purpose"
      >
        <p>
          Public website content is provided for general informational and
          marketing purposes. It is intended to introduce the project and enable
          enquiries. Website content, contact-form correspondence, availability
          indications, and preliminary discussions do not by themselves create
          a reservation, sale, lease, investment relationship, or other binding
          obligation.
        </p>
        <p>
          Nothing on this website constitutes a binding offer or acceptance. Any
          transaction remains subject to confirmation, eligibility, due
          diligence, approvals, and execution of the definitive documents by the
          appropriate parties.
        </p>
      </LegalSection>

      <LegalSection id="no-advice" title="3. No professional advice">
        <p>
          Website content is not legal, financial, investment, accounting, or
          tax advice and should not be relied upon as such. Laws, regulations,
          financing conditions, and individual circumstances can change or vary
          by jurisdiction. You should obtain independent advice from suitably
          qualified professionals before making a property, contractual,
          financial, or tax decision.
        </p>
      </LegalSection>

      <LegalSection id="project-disclaimer" title="4. Project and visual disclaimer">
        <p>
          Renderings, photographs, videos, maps, models, virtual views,
          animations, furnishings, and other visual materials are illustrative
          and may include artistic impressions. They are intended to communicate
          a general design concept and may not depict the final delivered project
          or a particular residence exactly.
        </p>
        <LegalList>
          <li>
            Floor plans, boundaries, layouts, areas, measurements, and dimensions
            are approximate unless expressly confirmed in definitive documents.
          </li>
          <li>
            Designs, specifications, amenities, fixtures, materials, finishes,
            colors, furniture, appliances, and construction details may change.
          </li>
          <li>
            Landscaping, vegetation, views, surrounding development, and other
            environmental or contextual features may differ from illustrations
            and may change over time.
          </li>
          <li>
            Images can show optional, upgraded, staged, or decorative items that
            are not included in a purchase.
          </li>
        </LegalList>
        <p>
          Where a detail matters to your decision, request current written
          confirmation and review the definitive purchase documentation.
        </p>
      </LegalSection>

      <LegalSection id="pricing-availability" title="5. Pricing and availability">
        <p>
          Any price, payment schedule, availability indication, property status,
          completion estimate, or commercial term displayed or communicated
          through the website is subject to confirmation and may change without
          prior website notice, to the extent permitted by applicable law.
          Taxes, fees, closing costs, upgrades, furnishings, services, and other
          amounts may not be included unless expressly stated in definitive
          documentation.
        </p>
      </LegalSection>

      <LegalSection id="definitive-documents" title="6. Definitive documentation controls">
        <p>
          Only the final agreements, schedules, specifications, disclosures, and
          other documents duly executed or issued by the authorized parties govern
          a purchase or other transaction. If website content, a rendering,
          informal communication, or Client Portal display conflicts with those
          definitive documents, the definitive documents control, subject to
          mandatory rights under applicable law.
        </p>
      </LegalSection>

      <LegalSection id="intellectual-property" title="7. Intellectual property">
        <p>
          Unless otherwise indicated, the website and its text, branding,
          graphics, photographs, renderings, videos, interface, layouts, and
          software are owned by or licensed to the relevant {companyDisplayName}
          or {brandName} rights holder and are protected by applicable
          intellectual-property laws.
        </p>
        <p>
          You may view and use the website for your personal, non-commercial
          evaluation of the project. No ownership rights are transferred. You may
          not reproduce, publish, distribute, alter, scrape, frame, commercially
          exploit, or create derivative works from protected materials without
          prior authorization, except where applicable law permits otherwise.
        </p>
      </LegalSection>

      <LegalSection id="acceptable-use" title="8. Acceptable website use">
        <p>You must not:</p>
        <LegalList>
          <li>Use the website for an unlawful, fraudulent, or abusive purpose.</li>
          <li>
            Attempt to bypass access controls, probe vulnerabilities, disrupt the
            website, or interfere with another user.
          </li>
          <li>
            Introduce malware, harmful code, automated traffic, or excessive
            requests that could impair the service.
          </li>
          <li>
            Misrepresent your identity, authority, affiliation, or interest in a
            transaction.
          </li>
          <li>
            Collect personal information or confidential portal content without
            authorization.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection id="third-party-services" title="9. Third-party links and services">
        <p>
          The website may link to or, with the appropriate privacy choice, load
          services operated by third parties, such as Google Maps, messaging,
          telephone, email, or attribution websites. Third-party services are
          governed by their own terms and privacy practices. A link, integration,
          or reference does not necessarily constitute endorsement or control of
          that service.
        </p>
      </LegalSection>

      <LegalSection id="client-portal" title="10. Client Portal and account responsibilities">
        <p>
          Client Portal access is personal to the authorized account holder. You
          are responsible for providing accurate account information, protecting
          your credentials, using a secure device, and notifying us promptly if
          you suspect unauthorized access.
        </p>
        <LegalList>
          <li>Do not share an account or password with an unauthorized person.</li>
          <li>
            Do not access or attempt to access another client&apos;s profile,
            property, update, or private file.
          </li>
          <li>
            Do not download, disclose, or use confidential portal materials for
            an unauthorized purpose.
          </li>
        </LegalList>
        <p>
          We may suspend or restrict access where reasonably necessary to protect
          accounts, investigate misuse, comply with law, or maintain the service.
          Portal displays are informational and remain subject to the definitive
          documentation applicable to the property.
        </p>
      </LegalSection>

      <LegalSection id="website-availability" title="11. Website availability and warranties">
        <p>
          We take reasonable steps to maintain useful and accurate website
          content, but information can become outdated, incomplete, or affected
          by technical errors. To the extent permitted by applicable law, the
          website is provided on an “as available” basis, without a promise that
          it will always be uninterrupted, secure, error-free, or suitable for a
          particular purpose.
        </p>
        <p>
          Nothing in these Terms excludes an express written commitment in
          definitive documentation or a warranty that cannot lawfully be excluded.
        </p>
      </LegalSection>

      <LegalSection id="liability" title="12. Limitation of liability">
        <p>
          To the extent permitted by applicable law, {legalEntityName}, the
          relevant project entities, and their service providers will not be
          responsible for indirect, incidental, special, or consequential loss
          arising solely from use of, inability to use, or reliance on this
          informational website or an independent third-party service.
        </p>
        <p>
          Nothing in these Terms limits or excludes liability where doing so
          would be unlawful, including liability that applicable law requires to
          remain available. You remain responsible for independently verifying
          information material to a proposed transaction.
        </p>
      </LegalSection>

      <LegalSection id="consumer-rights" title="13. Mandatory consumer rights">
        <p>
          These Terms do not waive or reduce consumer rights or remedies that
          cannot be waived or limited under applicable law. If a provision is
          inconsistent with such a mandatory right, that provision applies only
          to the maximum extent lawfully permitted, and the remaining provisions
          continue to apply where possible.
        </p>
      </LegalSection>

      <LegalSection id="governing-law" title="14. Governing law">
        <p>
          These Terms and website use are intended to be governed by the laws of
          Aruba, without prejudice to any mandatory consumer, privacy, or other
          rights that apply to you under the law of your place of residence or
          another applicable jurisdiction. Any dispute forum or process stated in
          definitive transaction documents takes precedence for that transaction.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="15. Changes to these Terms">
        <p>
          We may update these Terms to reflect changes in the website, services,
          project information, or applicable requirements. The latest revision
          date appears at the top. Changes apply prospectively from publication,
          except where applicable law or definitive documentation requires a
          different process.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="16. Contact">
        <p>
          Questions about these Terms can be sent to{" "}
          <a
            href={`mailto:${privacyEmail}`}
            className="text-luxury-gold-ink underline decoration-luxury-gold/60 underline-offset-4"
          >
            {privacyEmail}
          </a>
          .
        </p>
        <p>
          {legalEntityName}
          <br />
          {registeredAddress}
          <br />
          Aruba Chamber of Commerce registration: {chamberRegistration}
        </p>
      </LegalSection>
    </LegalPage>
  )
}

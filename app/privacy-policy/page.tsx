import type { Metadata } from "next"
import Link from "next/link"

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
  title: `Privacy Policy | ${brandName}`,
  description: `How ${legalEntityName} handles personal information across the ${brandName} website and client portal.`,
}

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Privacy Policy"
      introduction={`This Policy explains how personal information is handled when you visit the ${brandName} website, submit an enquiry, or use an authenticated client feature.`}
      lastUpdated="August 30, 2026"
    >
      <LegalSection id="who-we-are" title="1. Who we are">
        <p>
          This website presents {brandName}. {legalEntityName} is the legal
          entity responsible for the personal information processing described
          in this Policy. {companyDisplayName} and {brandName} may be used as
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
          <p>
            <strong className="text-foreground">Privacy contact:</strong>{" "}
            <a
              href={`mailto:${privacyEmail}`}
              className="text-luxury-gold-ink underline decoration-luxury-gold/60 underline-offset-4"
            >
              {privacyEmail}
            </a>
          </p>
        </div>
        <p>
          References to “we”, “us”, and “our” in this Policy refer to{" "}
          {legalEntityName} in its role as the responsible legal entity.
        </p>
      </LegalSection>

      <LegalSection id="scope" title="2. Scope">
        <p>
          This Policy applies to personal information processed through this
          website, its public contact form, and the authenticated client and
          administrative portal features associated with {brandName}. It does
          not govern independent websites or services operated by third
          parties, even when this website links to or embeds them.
        </p>
      </LegalSection>

      <LegalSection
        id="information-provided"
        title="3. Information you provide directly"
      >
        <p>
          When you submit the public contact form, we may receive the following
          information:
        </p>
        <LegalList>
          <li>Name and email address.</li>
          <li>Phone number and city, when you choose to provide them.</li>
          <li>Comments, property interests, and the substance of your enquiry.</li>
          <li>
            Your optional choice about receiving news, availability updates,
            and promotional communications.
          </li>
        </LegalList>
        <p>
          The current public contact form sends the submitted information
          through our website backend and email-delivery provider to the
          designated {legalEntityName} mailbox. It does not create a lead
          record in the project&apos;s Supabase database. Copies may nevertheless
          remain in operational email systems for as long as reasonably needed
          for the enquiry and related legal or business requirements.
        </p>
      </LegalSection>

      <LegalSection id="client-portal-data" title="4. Client Portal data">
        <p>
          If you receive access to the Client Portal, we may process information
          needed to create, secure, and operate your account and to present
          project information relevant to you. This may include:
        </p>
        <LegalList>
          <li>
            Account and authentication data, such as your email address, user
            identifier, role, authentication status, and session information.
          </li>
          <li>
            Profile information, such as your name, email address, and phone
            number.
          </li>
          <li>
            Property assignments, property number, project status, and progress
            information.
          </li>
          <li>
            Property updates, including titles, descriptions, dates, and
            progress values.
          </li>
          <li>
            Private property files and associated metadata, such as file name,
            type, description, storage path, property association, and creation
            date.
          </li>
        </LegalList>
        <p>
          Authentication credentials and sessions are processed through
          Supabase Auth. Portal records and private files are handled through
          access-controlled database and storage services. Access remains
          subject to the permissions configured for the relevant account and
          project resources.
        </p>
      </LegalSection>

      <LegalSection id="technical-data" title="5. Technical data">
        <p>
          When you use the website, our hosting, security, and service providers
          may automatically process limited technical and usage information.
          Depending on the service and your choices, this can include IP
          address, browser and device information, requested URLs, referrer,
          timestamps, diagnostic logs, and security events.
        </p>
        <p>
          The website also uses first-party preference storage, session storage
          for functional navigation and loader behavior, and local storage for
          authenticated Supabase sessions. Optional analytics, advertising, and
          external-media technologies are governed by the choices described in
          our{" "}
          <Link
            href="/cookie-policy"
            className="text-luxury-gold-ink underline decoration-luxury-gold/60 underline-offset-4"
          >
            Cookie Policy
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection id="purposes" title="6. Purposes of processing">
        <p>We may process personal information to:</p>
        <LegalList>
          <li>Receive, evaluate, and respond to property or project enquiries.</li>
          <li>
            Provide requested project information and communicate about relevant
            next steps.
          </li>
          <li>Create, authenticate, secure, and support portal accounts.</li>
          <li>
            Assign properties and make relevant progress, updates, and private
            files available to authorized users.
          </li>
          <li>Operate, maintain, troubleshoot, and protect the website.</li>
          <li>Prevent fraud, misuse, unauthorized access, and security incidents.</li>
          <li>Comply with legal, regulatory, accounting, and recordkeeping duties.</li>
          <li>
            Send marketing communications where you have requested them or
            where another lawful basis is available under applicable law.
          </li>
          <li>
            Measure website and campaign performance if optional technologies
            are enabled and their use is permitted.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection id="legal-grounds" title="7. Legal grounds">
        <p>
          The legal ground relied upon depends on the processing context and
          applicable jurisdiction. It may include:
        </p>
        <LegalList>
          <li>
            Taking steps at your request before a potential contract or
            providing services or information you requested.
          </li>
          <li>Performing a contract with you.</li>
          <li>Complying with legal obligations.</li>
          <li>
            Pursuing legitimate interests, such as website security, service
            improvement, and appropriate business administration, where
            permitted and not overridden by your rights.
          </li>
          <li>Your consent, where required by applicable law.</li>
        </LegalList>
      </LegalSection>

      <LegalSection id="marketing" title="8. Marketing communications">
        <p>
          The public contact form may offer an optional, unchecked choice to
          receive news, property availability updates, and promotional
          communications. Declining that choice does not prevent you from
          submitting an enquiry or receiving a response to it.
        </p>
        <p>
          You may ask us to stop direct marketing at any time by using an
          unsubscribe method provided in the communication or by contacting{" "}
          <a
            href={`mailto:${privacyEmail}`}
            className="text-luxury-gold-ink underline decoration-luxury-gold/60 underline-offset-4"
          >
            {privacyEmail}
          </a>
          . We may retain limited suppression information where necessary to
          honor that request.
        </p>
      </LegalSection>

      <LegalSection id="service-providers" title="9. Service providers">
        <p>
          We use service providers that process information for the purposes
          described in this Policy. Depending on which feature you use, these
          may include:
        </p>
        <LegalList>
          <li>
            <strong className="text-foreground">Supabase</strong> for
            authentication, database services, and private file storage used by
            authenticated areas.
          </li>
          <li>
            <strong className="text-foreground">Resend</strong> for delivery of
            public contact-form submissions by email.
          </li>
          <li>
            <strong className="text-foreground">Google</strong>, where
            applicable, for user-authorized external media such as Google Maps
            and, if enabled in the future, consent-controlled measurement or
            advertising technologies.
          </li>
          <li>
            Our hosting, infrastructure, security, and email providers as needed
            to operate the website and business communications.
          </li>
        </LegalList>
        <p>
          Providers may also process information under their own terms when
          acting independently. Their practices should be reviewed before using
          the relevant third-party feature.
        </p>
      </LegalSection>

      <LegalSection id="international-transfers" title="10. International transfers">
        <p>
          Some providers or recipients may operate in countries other than the
          country where you are located. Consequently, personal information may
          be processed across national borders. Where required by applicable
          law, we will seek to use an appropriate transfer mechanism or other
          safeguards for the relevant transfer.
        </p>
      </LegalSection>

      <LegalSection id="retention" title="11. Data retention">
        <p>
          We retain personal information for no longer than reasonably necessary
          for the purpose for which it was collected, including responding to
          enquiries, operating accounts, performing contractual obligations,
          maintaining security and business records, resolving disputes, and
          meeting legal requirements. Actual periods vary according to the type
          of record, relationship, applicable limitation periods, and legal or
          regulatory obligations.
        </p>
      </LegalSection>

      <LegalSection id="security" title="12. Security">
        <p>
          We use reasonable technical and organizational measures appropriate to
          the nature of the information and the services involved. These may
          include authenticated access, role-based controls, private storage,
          and time-limited links for certain files. No internet transmission,
          system, or storage method can be guaranteed to be completely secure.
        </p>
      </LegalSection>

      <LegalSection id="rights" title="13. Your privacy rights">
        <p>
          Depending on applicable law and your circumstances, you may have the
          right to request access to, correction of, or deletion of personal
          information, as well as restriction of or objection to certain
          processing. You may also have rights to data portability and to lodge
          a complaint with a competent privacy or data-protection authority.
        </p>
        <p>
          Rights can be subject to conditions, exceptions, identity verification,
          and record-retention obligations. To make a request, contact{" "}
          <a
            href={`mailto:${privacyEmail}`}
            className="text-luxury-gold-ink underline decoration-luxury-gold/60 underline-offset-4"
          >
            {privacyEmail}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection id="withdrawal" title="14. Withdrawal of consent">
        <p>
          Where processing is based on consent, you may withdraw that consent at
          any time. Withdrawal does not affect the lawfulness of processing that
          occurred before it. You can update optional website technologies
          through Cookie Settings and can contact us regarding other consent
          choices.
        </p>
      </LegalSection>

      <LegalSection id="cookies" title="15. Cookies and similar technologies">
        <p>
          We use necessary technologies to remember privacy choices, support
          basic website behavior, and maintain requested authenticated sessions.
          Analytics, advertising, and external-media technologies are controlled
          separately. Please review our{" "}
          <Link
            href="/cookie-policy"
            className="text-luxury-gold-ink underline decoration-luxury-gold/60 underline-offset-4"
          >
            Cookie Policy
          </Link>{" "}
          for category details and available choices.
        </p>
      </LegalSection>

      <LegalSection id="third-parties" title="16. Third-party services">
        <p>
          The website may contain third-party links or features, including Google
          Maps and links to messaging, telephone, email, or attribution services.
          Loading or following them may allow the third party to process
          information under its own privacy terms. External media is blocked
          until the relevant preference is enabled or you explicitly request
          that it load.
        </p>
      </LegalSection>

      <LegalSection id="children" title="17. Children">
        <p>
          This website and its property services are not directed to children.
          We do not seek to collect personal information from children through
          the public website. If we learn that such information was submitted
          without appropriate authorization, we will take reasonable steps to
          address it in accordance with applicable law.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="18. Changes to this Policy">
        <p>
          We may update this Policy to reflect changes in the website, our
          practices, service providers, or applicable requirements. The date at
          the top identifies the latest published revision. Where required by
          applicable law, we will provide additional notice or request consent
          for a material change.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="19. Contact information">
        <p>
          Questions, privacy requests, and consent withdrawals can be sent to{" "}
          <a
            href={`mailto:${privacyEmail}`}
            className="text-luxury-gold-ink underline decoration-luxury-gold/60 underline-offset-4"
          >
            {privacyEmail}
          </a>
          . Please do not include passwords or unnecessary sensitive information
          in your message.
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

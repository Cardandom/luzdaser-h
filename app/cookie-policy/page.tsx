import type { Metadata } from "next"
import Link from "next/link"

import {
  LegalList,
  LegalPage,
  LegalSection,
} from "@/components/site/legal-page"
import {
  brandName,
  companyDisplayName,
  privacyEmail,
} from "@/lib/legal-config"

export const metadata: Metadata = {
  title: `Cookie Policy | ${brandName}`,
  description: `Learn how ${brandName} uses necessary storage, optional analytics and advertising technologies, and Google Maps.`,
}

export default function CookiePolicyPage() {
  return (
    <LegalPage
      eyebrow="Privacy preferences"
      title="Cookie Policy"
      introduction={`This Policy explains how ${companyDisplayName} and ${brandName} use cookies and similar browser-storage technologies, and how you can control optional categories.`}
      lastUpdated="August 30, 2026"
    >
      <LegalSection id="about-technologies" title="1. Cookies and similar technologies">
        <p>
          Cookies are small text records that a website can ask a browser to
          store. Websites can also use technologies such as local storage and
          session storage to remember settings or maintain requested features.
          In this Policy, references to cookies include these similar storage
          technologies where appropriate.
        </p>
        <p>
          Some technologies are necessary to operate the website or provide a
          secure account feature you request. Other technologies are optional
          and are used only when enabled and permitted by your consent choices,
          where required by applicable law.
        </p>
      </LegalSection>

      <LegalSection id="privacy-choices" title="2. Your privacy choices">
        <p>
          The preference center separates technologies into Necessary,
          Analytics, Advertising, and External Media categories. On a first
          visit, Analytics, Advertising, and External Media are disabled by
          default. You can accept all optional categories, reject them, or make
          independent choices.
        </p>
        <p>
          Your choice is stored in a first-party preference cookie named{" "}
          <code className="rounded bg-stone-100 px-1.5 py-1 text-sm text-foreground">
            rs_consent_v1
          </code>
          . It contains consent version <strong className="text-foreground">1</strong>,
          Boolean choices for Analytics, Advertising, and External Media, and a
          consent timestamp. It does not contain your name, email address,
          telephone number, or other contact-form information. Its intended
          lifetime is approximately six months.
        </p>
        <p>
          You can reopen the preference center using the Cookie Settings action
          in the website footer. Rejecting optional categories is not treated as
          accepting them, and changing a choice applies to future use of the
          affected technology. Some third-party data already transmitted before
          a later withdrawal may remain subject to that provider&apos;s retention
          practices and applicable law.
        </p>
      </LegalSection>

      <LegalSection id="necessary" title="3. Necessary">
        <p>
          Necessary technologies support core website behavior, remember your
          privacy choice, or provide secure features you expressly request. They
          are not used for advertising and cannot be disabled through the
          preference center without impairing the relevant feature.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-luxury-border">
          <table className="w-full min-w-2xl border-collapse text-left text-sm">
            <thead className="bg-stone-50 text-foreground">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Technology
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Storage
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Purpose
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-luxury-border">
              <tr>
                <td className="px-4 py-3 align-top">
                  <code>rs_consent_v1</code>
                </td>
                <td className="px-4 py-3 align-top">First-party cookie</td>
                <td className="px-4 py-3 align-top">
                  Remembers versioned privacy preferences and their timestamp,
                  generally for about six months.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 align-top">
                  <code>reina-sophia-home-loader-seen-v1</code>
                </td>
                <td className="px-4 py-3 align-top">Session storage</td>
                <td className="px-4 py-3 align-top">
                  Avoids replaying the Home experience loader repeatedly in the
                  same browser tab.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 align-top">
                  <code>reina-sophia-client-login-return</code>
                </td>
                <td className="px-4 py-3 align-top">Session storage</td>
                <td className="px-4 py-3 align-top">
                  Temporarily remembers the page and scroll position used to
                  return from Client Login.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 align-top">
                  <code>reina-sophia-client-login-restore-scroll</code>
                </td>
                <td className="px-4 py-3 align-top">Session storage</td>
                <td className="px-4 py-3 align-top">
                  Temporarily restores the saved scroll position after returning
                  from Client Login.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 align-top">Supabase Auth session</td>
                <td className="px-4 py-3 align-top">Local storage</td>
                <td className="px-4 py-3 align-top">
                  Maintains an authenticated session for the secure client or
                  administrative area. The generated storage-key name can vary
                  with the Supabase project configuration.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Session-storage records generally remain for the browser-tab session
          unless consumed earlier. An authenticated session can remain in local
          storage until sign-out, expiry, replacement, or browser-data removal,
          subject to the authentication configuration.
        </p>
      </LegalSection>

      <LegalSection id="analytics" title="4. Analytics">
        <p>
          This category is reserved and prepared for Google Analytics 4 if it is
          enabled in the future. Analytics is disabled unless the integration is
          configured and the category is permitted by your consent choice. When
          disabled, the website must not load the optional analytics tag.
        </p>
        <p>
          If enabled with permission, analytics may help us understand aggregate
          website use and performance. Provider-specific cookies and retention
          details will depend on the configuration in effect and this Policy
          should be updated if those details change.
        </p>
      </LegalSection>

      <LegalSection id="advertising" title="5. Advertising">
        <p>
          This category is reserved and prepared for Google Ads measurement if
          it is enabled in the future. Advertising is disabled unless the
          integration is configured and the category is permitted by your
          consent choice. When disabled, the website must not load the optional
          advertising tag.
        </p>
        <p>
          If enabled with permission, advertising technologies may help measure
          campaigns and conversions. Contact-form details such as your name,
          email, phone number, city, and comments are not intended to be placed
          in the Google data layer.
        </p>
      </LegalSection>

      <LegalSection id="external-media" title="6. External Media">
        <p>
          The website offers an interactive Google Maps feature. The Google Maps
          iframe remains blocked unless you enable External Media or explicitly
          choose to load the map. An explicit load request updates the same
          External Media preference so the map can be displayed.
        </p>
        <p>
          When Google Maps loads, Google may receive technical information about
          your browser or device and may use cookies or similar technologies
          according to its own terms and privacy practices. Rejecting optional
          technologies keeps the iframe blocked unless you later make an
          explicit load choice.
        </p>
      </LegalSection>

      <LegalSection id="category-summary" title="7. Category summary">
        <LegalList>
          <li>
            <strong className="text-foreground">Necessary:</strong> always
            enabled for core operation and requested secure features.
          </li>
          <li>
            <strong className="text-foreground">Analytics:</strong> default
            false; reserved for consent-controlled Google Analytics 4.
          </li>
          <li>
            <strong className="text-foreground">Advertising:</strong> default
            false; reserved for consent-controlled Google Ads measurement.
          </li>
          <li>
            <strong className="text-foreground">External Media:</strong> default
            false; controls embedded Google Maps.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection id="browser-controls" title="8. Browser controls">
        <p>
          Most browsers allow you to view or remove cookies and site storage.
          Blocking necessary storage may prevent privacy preferences, the Home
          loader state, return navigation, or authenticated portal sessions from
          working as intended. Browser controls operate separately from the
          website preference center.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="9. Changes to this Policy">
        <p>
          We may update this Policy when the website, providers, categories, or
          legal requirements change. The latest revision date appears at the top.
          Where required by applicable law, we will request a fresh choice before
          newly using an optional technology.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="10. Contact">
        <p>
          For questions about these technologies or your privacy choices, email{" "}
          <a
            href={`mailto:${privacyEmail}`}
            className="text-luxury-gold-ink underline decoration-luxury-gold/60 underline-offset-4"
          >
            {privacyEmail}
          </a>
          . For more information about personal-data handling, review the{" "}
          <Link
            href="/privacy-policy"
            className="text-luxury-gold-ink underline decoration-luxury-gold/60 underline-offset-4"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPage>
  )
}

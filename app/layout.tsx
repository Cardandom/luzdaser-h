import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Geist, Geist_Mono } from "next/font/google"
import Script from "next/script"
import { AppChrome } from "@/components/site/app-chrome"
import { GoogleConsentMode } from "@/components/site/google-consent-mode"
import {
  PRIVACY_CONSENT_COOKIE_NAME,
  PRIVACY_CONSENT_VERSION,
} from "@/lib/privacy-consent"
import "./globals.css"

const googleConsentBootstrap = `
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  var savedConsent = null;
  var cookiePrefix = ${JSON.stringify(PRIVACY_CONSENT_COOKIE_NAME + "=")};
  var encodedConsent = document.cookie.split(";").map(function (cookie) {
    return cookie.trim();
  }).find(function (cookie) {
    return cookie.startsWith(cookiePrefix);
  });

  if (encodedConsent) {
    try {
      var parsedConsent = JSON.parse(
        decodeURIComponent(encodedConsent.slice(cookiePrefix.length))
      );
      if (
        parsedConsent &&
        parsedConsent.version === ${PRIVACY_CONSENT_VERSION} &&
        typeof parsedConsent.analytics === "boolean" &&
        typeof parsedConsent.advertising === "boolean" &&
        typeof parsedConsent.externalMedia === "boolean" &&
        typeof parsedConsent.timestamp === "string" &&
        Number.isFinite(Date.parse(parsedConsent.timestamp))
      ) {
        savedConsent = parsedConsent;
      }
    } catch (_) {
      // Missing or malformed consent keeps every Google storage type denied.
    }
  }

  var analyticsStorage = savedConsent && savedConsent.analytics
    ? "granted"
    : "denied";
  var advertisingStorage = savedConsent && savedConsent.advertising
    ? "granted"
    : "denied";

  window.gtag("consent", "default", {
    analytics_storage: analyticsStorage,
    ad_storage: advertisingStorage,
    ad_user_data: advertisingStorage,
    ad_personalization: advertisingStorage
  });
`

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://jbsseco.com",
  ),
  title: "Reina Sophia Residences",
  description:
    "Premium landing page for real estate investment in Aruba, optimized for desktop, tablet, and mobile.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} scroll-smooth`}
    >
      <head>
        <Script id="google-consent-default" strategy="beforeInteractive">
          {googleConsentBootstrap}
        </Script>
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <GoogleConsentMode />
        <AppChrome />
        {children}
      </body>
    </html>
  )
}

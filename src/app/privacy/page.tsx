import React from "react";
import type { Metadata } from "next";
import { LegalPageLayout, LegalSection } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
    title: "Privacy Policy - BarHuddle Owner Portal",
    description: "Learn how BarHuddle collects, uses, protects, and discloses your data across the Owner Portal and associated services.",
};

const PRIVACY_SECTIONS: LegalSection[] = [
    {
        title: "Introduction & Scope",
        content:
            "Welcome to BarHuddle. This Privacy Policy describes how BarHuddle ('we', 'our', or 'us') collects, uses, stores, and protects information when you use our Venue Owner Portal, mobile applications, and associated services. We are dedicated to maintaining the privacy and trust of our venue owners, business partners, and platform users.",
    },
    {
        title: "Information We Collect",
        content:
            "We collect information you provide directly, including your name, business email, phone number, venue profile details, event photos, and promotional descriptions. We also automatically collect technical data such as IP addresses, browser types, operating systems, and session cookies to ensure platform security, prevent fraudulent activity, and deliver reliable venue analytics.",
    },
    {
        title: "How We Use Your Data",
        content:
            "Your data is used to operate and enhance the BarHuddle platform, deliver real-time foot traffic analytics, process subscription billing through Stripe, communicate important service updates, and provide responsive customer support. We never sell your personal data or venue information to third-party data brokers.",
    },
    {
        title: "Data Sharing & Third-Party Processors",
        content:
            "BarHuddle shares minimal data with trusted third-party service providers solely to the extent necessary to deliver the service. This includes payment processing (Stripe), email delivery, and secure cloud infrastructure (AWS). All third parties are legally and contractually obligated to protect your data with enterprise-grade security controls.",
    },
    {
        title: "Cookies & Session Tracking",
        content:
            "We use essential authentication cookies, security tokens, and local storage to keep you securely signed in, preserve your interface settings, and monitor system performance. You may configure your browser to reject cookies, though certain portal features may function with reduced capability.",
    },
    {
        title: "Data Security & Retention",
        content:
            "We implement robust technical and administrative safeguards, including TLS encryption in transit, AES-256 encryption at rest, restricted employee access, and regular vulnerability audits. We retain your account data for as long as your account remains active or as required by financial record-keeping laws.",
    },
    {
        title: "Your Rights & Data Choices",
        content:
            "Depending on your legal jurisdiction (including GDPR in Europe and CCPA/CPRA in California), you have the right to request access to your personal data, request corrections, or request complete account deletion. You can exercise these rights anytime via Portal Settings or by emailing our data privacy officer at privacy@barhuddle.com.",
    },
    {
        title: "Children's Privacy",
        content:
            "The BarHuddle Venue Owner Portal is intended strictly for authorized adult venue representatives of legal age. We do not knowingly solicit or collect personal information from individuals under the legal drinking age.",
    },
    {
        title: "Policy Updates & Notification",
        content:
            "We may update this Privacy Policy from time to time to reflect regulatory, technological, or operational changes. The 'Last Updated' date at the top of this document indicates when changes take effect. We encourage users to periodically review this page.",
    },
    {
        title: "Contact Our Data Protection Team",
        content:
            "If you have inquiries, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at privacy@barhuddle.com or support@barhuddle.com.",
    },
];

export default function PrivacyPage() {
    return (
        <LegalPageLayout
            activeTab="privacy"
            title="Privacy Policy"
            subtitle="How BarHuddle collects, utilizes, and safeguards your venue and account data."
            lastUpdated="September 2026"
            sections={PRIVACY_SECTIONS}
        />
    );
}

import React from "react";
import type { Metadata } from "next";
import { LegalPageLayout, LegalSection } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
    title: "Terms & Conditions - BarHuddle Owner Portal",
    description: "Read the Terms and Conditions governing your use of the BarHuddle platform, Owner Portal, and promotional services.",
};

const TERMS_SECTIONS: LegalSection[] = [
    {
        title: "Acceptance of Terms",
        content:
            "By creating a BarHuddle account, accessing our Venue Owner Portal, or utilizing our mobile and web interfaces, you represent and agree to be bound by these Terms and Conditions. If you do not agree to these terms, you must immediately cease use of the platform. These terms apply to all venue managers, bar owners, event organizers, and promotional partners.",
    },
    {
        title: "Account Eligibility & Security",
        content:
            "To register for a venue owner account, you must be at least 21 years of age (or the legal drinking age in your jurisdiction) and legally authorized to enter into binding agreements on behalf of your establishment. You are solely responsible for maintaining the confidentiality of your credentials and for all activities that occur under your account. You must immediately notify BarHuddle of any unauthorized account access.",
    },
    {
        title: "Venue Ownership Verification & Claims",
        content:
            "When claiming a venue on BarHuddle, you represent and warrant that you hold legitimate management rights, ownership, or authorized agency for the designated establishment. BarHuddle reserves the right to request business licenses, utility documentation, government identification, or other verification documents before approving venue claims. Fraudulent claims will result in immediate termination, forfeiture of privileges, and possible legal action.",
    },
    {
        title: "Events, Promotions & Content Standards",
        content:
            "All event listings, deals, flyers, drink specials, and promotional materials published through your account must be accurate, truthful, and compliant with all applicable local alcohol advertising laws and regulations. You retain ownership of your uploaded images and trademarks, granting BarHuddle a non-exclusive, worldwide license to display and distribute them within our consumer-facing applications and promotional channels.",
    },
    {
        title: "Subscriptions, Billing & Payment Terms",
        content:
            "Certain features of the BarHuddle Owner Portal, including featured promotions, boost campaigns, and extended traffic analytics, require an active paid subscription. Payments are processed securely via our payment partner, Stripe. Subscriptions automatically renew at the end of each billing cycle unless cancelled prior to the renewal date. All fees are non-refundable except where required by law.",
    },
    {
        title: "Platform Analytics & Usage Data",
        content:
            "BarHuddle provides visitor density, traffic trends, and demographic analytics as approximations to assist venue planning. While we endeavor to provide the highest data accuracy, BarHuddle provides analytics 'as-is' without warranties of specific business revenue outcomes. You agree not to reverse engineer or re-distribute platform analytics without explicit authorization.",
    },
    {
        title: "Prohibited Conduct & Community Guidelines",
        content:
            "Users are strictly prohibited from attempting to bypass portal authentication, scraping platform data, transmitting malicious payloads, publishing defamatory content, or promoting activities that violate local laws or liquor licensing standards. Violations will result in immediate suspension or termination of account access.",
    },
    {
        title: "Limitation of Liability & Indemnification",
        content:
            "To the fullest extent permitted by law, BarHuddle and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your access to or inability to access the platform. You agree to defend, indemnify, and hold harmless BarHuddle from any third-party claims arising from your breach of these terms.",
    },
    {
        title: "Modifications & Termination",
        content:
            "BarHuddle reserves the right to update or modify these Terms at any time. Material changes will be communicated via the email associated with your account or through an in-portal notification. You may terminate your account at any time through the Delete Account feature in Settings.",
    },
    {
        title: "Contact & Legal Inquiries",
        content:
            "If you have questions regarding these Terms & Conditions or wish to report a dispute, please contact our legal and support team at legal@barhuddle.com or support@barhuddle.com.",
    },
];

export default function TermsPage() {
    return (
        <LegalPageLayout
            activeTab="terms"
            title="Terms & Conditions"
            subtitle="The rules, obligations, and agreements governing your use of BarHuddle."
            lastUpdated="September 2026"
            sections={TERMS_SECTIONS}
        />
    );
}

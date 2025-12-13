/**
 * Privacy Policy Page
 * GDPR/CCPA compliant privacy policy in clear language
 */

import { InfoPageLayout } from '@/components/layout/InfoPageLayout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - CitySheet',
  description: 'How CitySheet collects, uses, and protects your personal information. GDPR and CCPA compliant privacy policy.',
  openGraph: {
    title: 'Privacy Policy - CitySheet',
    description: 'How CitySheet collects, uses, and protects your personal information.',
    type: 'website',
  },
}

export default function PrivacyPage() {
  return (
    <InfoPageLayout
      title="Privacy Policy"
      lastUpdated="2025-12-11"
    >
      <p className="text-lg text-slate-700 dark:text-slate-200 font-medium">
        We believe privacy should be simple and transparent. Here's how we handle your information.
      </p>

      <h2>The Short Version</h2>
      <p>
        We collect minimal data to make CitySheet work. We use Supabase for authentication, Google AdSense for advertising, and standard web analytics. We don't sell your personal information. You can delete your account anytime.
      </p>
      <p>
        For the legal details, keep reading.
      </p>

      <h2>What Information We Collect</h2>

      <h3>Information You Give Us</h3>
      <p>
        When you create an account on CitySheet, we collect:
      </p>
      <ul>
        <li><strong>Email address:</strong> Used for account creation, login, and essential communications</li>
        <li><strong>Display name (optional):</strong> If you choose to set one for comments or contributions</li>
        <li><strong>Password:</strong> Stored securely via Supabase authentication (we never see your actual password)</li>
        <li><strong>Profile preferences:</strong> Language preferences, saved cities, bookmarked places</li>
      </ul>

      <h3>Information Collected Automatically</h3>
      <p>
        When you use CitySheet, we automatically collect:
      </p>
      <ul>
        <li><strong>Usage data:</strong> Pages viewed, features used, time spent, clicks</li>
        <li><strong>Device information:</strong> Browser type, operating system, screen size, device type</li>
        <li><strong>Location data (approximate):</strong> Country and city based on IP address (not precise GPS)</li>
        <li><strong>Referral information:</strong> How you found CitySheet (search engine, direct link, etc.)</li>
        <li><strong>Cookies and similar technologies:</strong> See "Cookies and Tracking" section below</li>
      </ul>

      <h3>Information from Third Parties</h3>
      <p>
        If you sign in using a third-party service (like Google or Apple), we receive:
      </p>
      <ul>
        <li>Email address</li>
        <li>Name (if you've provided it to that service)</li>
        <li>Profile picture (if you've set one)</li>
      </ul>
      <p>
        We only request the minimum permissions necessary for authentication.
      </p>

      <h2>How We Use Your Information</h2>
      <p>
        We use your information to:
      </p>
      <ul>
        <li><strong>Provide CitySheet services:</strong> Account management, saved preferences, personalized features</li>
        <li><strong>Improve our product:</strong> Understand how people use CitySheet, identify bugs, test new features</li>
        <li><strong>Communicate with you:</strong> Respond to inquiries, send essential service updates (not marketing emails unless you opt in)</li>
        <li><strong>Ensure security:</strong> Prevent fraud, detect abuse, protect against unauthorized access</li>
        <li><strong>Display relevant advertising:</strong> Show ads that might be useful to you (see "Advertising" section)</li>
        <li><strong>Comply with legal obligations:</strong> Respond to legal requests, enforce our terms, protect rights</li>
      </ul>

      <h2>Cookies and Tracking Technologies</h2>

      <h3>What Are Cookies?</h3>
      <p>
        Cookies are small text files stored on your device. They help websites remember you and your preferences.
      </p>

      <h3>Cookies We Use</h3>

      <h4>Essential Cookies (Required)</h4>
      <p>
        These cookies are necessary for CitySheet to function:
      </p>
      <ul>
        <li><strong>Authentication cookies:</strong> Keep you logged in</li>
        <li><strong>Security cookies:</strong> Protect against fraud and abuse</li>
        <li><strong>Preference cookies:</strong> Remember your language and display settings</li>
      </ul>

      <h4>Analytics Cookies (Optional)</h4>
      <p>
        These help us understand how people use CitySheet:
      </p>
      <ul>
        <li>Pages visited and features used</li>
        <li>Time spent on different sections</li>
        <li>Navigation patterns and user flows</li>
        <li>Error messages and technical issues</li>
      </ul>
      <p>
        You can opt out of analytics cookies in your browser settings.
      </p>

      <h4>Advertising Cookies (Optional)</h4>
      <p>
        Google AdSense uses cookies to:
      </p>
      <ul>
        <li>Show ads relevant to your interests</li>
        <li>Limit how many times you see the same ad</li>
        <li>Measure ad effectiveness</li>
      </ul>
      <p>
        You can control ad personalization through <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Google Ads Settings</a> or opt out of personalized advertising entirely.
      </p>

      <h3>Managing Cookies</h3>
      <p>
        You can control cookies through:
      </p>
      <ul>
        <li><strong>Browser settings:</strong> Most browsers let you block or delete cookies</li>
        <li><strong>Cookie consent banner:</strong> Manage your preferences when you first visit CitySheet</li>
        <li><strong>Privacy settings:</strong> Update your choices in your account settings</li>
      </ul>
      <p>
        Note: Blocking essential cookies may prevent CitySheet from working properly.
      </p>

      <h2>Advertising and Monetization</h2>

      <h3>Google AdSense</h3>
      <p>
        CitySheet uses Google AdSense to display advertisements. Google may use cookies and similar technologies to:
      </p>
      <ul>
        <li>Show personalized ads based on your browsing history across websites</li>
        <li>Measure ad performance and engagement</li>
        <li>Prevent ad fraud</li>
      </ul>
      <p>
        Google's use of advertising cookies is subject to their <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
      </p>

      <h3>Affiliate Links</h3>
      <p>
        Some links on CitySheet are affiliate links (clearly marked). If you make a purchase through these links, we may earn a commission. This doesn't affect the price you pay or the information we provide—we only recommend what we genuinely believe is useful.
      </p>

      <h2>Data Storage and Security</h2>

      <h3>Where We Store Your Data</h3>
      <ul>
        <li><strong>Supabase:</strong> User authentication and account data (hosted in secure data centers)</li>
        <li><strong>Vercel:</strong> Website hosting and content delivery</li>
        <li><strong>Google Cloud:</strong> Analytics and advertising infrastructure</li>
      </ul>
      <p>
        All data is stored in compliance with GDPR and industry security standards.
      </p>

      <h3>How We Protect Your Data</h3>
      <ul>
        <li><strong>Encryption:</strong> Data transmitted over HTTPS (encrypted connections)</li>
        <li><strong>Access controls:</strong> Limited employee access to personal data</li>
        <li><strong>Regular security audits:</strong> Testing for vulnerabilities</li>
        <li><strong>Secure authentication:</strong> Industry-standard password hashing and protection</li>
      </ul>
      <p>
        No system is 100% secure, but we take reasonable measures to protect your information.
      </p>

      <h2>Your Privacy Rights</h2>

      <h3>Access and Portability</h3>
      <p>
        You can request a copy of your personal data. We'll provide it in a structured, commonly used format.
      </p>

      <h3>Correction</h3>
      <p>
        You can update your account information anytime through your profile settings.
      </p>

      <h3>Deletion</h3>
      <p>
        You can delete your account at any time. This will permanently remove your personal information (except what we're legally required to retain).
      </p>

      <h3>Opt-Out</h3>
      <p>
        You can opt out of:
      </p>
      <ul>
        <li><strong>Email communications:</strong> Unsubscribe from non-essential emails</li>
        <li><strong>Personalized advertising:</strong> Use <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Google Ads Settings</a></li>
        <li><strong>Analytics tracking:</strong> Use browser settings or privacy tools</li>
      </ul>

      <h3>Data Portability</h3>
      <p>
        Under GDPR, you have the right to receive your data in a portable format and transfer it to another service.
      </p>

      <h3>Objection</h3>
      <p>
        You can object to processing of your personal data for certain purposes (like marketing).
      </p>

      <h3>How to Exercise Your Rights</h3>
      <p>
        To exercise any of these rights, contact us at <a href="mailto:privacy@citysheet.com">privacy@citysheet.com</a>. We'll respond within 30 days.
      </p>

      <h2>Children's Privacy</h2>
      <p>
        CitySheet is not directed at children under 16. We don't knowingly collect personal information from children. If you believe we've collected information from a child, please contact us immediately at <a href="mailto:privacy@citysheet.com">privacy@citysheet.com</a>.
      </p>

      <h2>International Data Transfers</h2>
      <p>
        CitySheet is based in the United States. If you access CitySheet from outside the US, your information may be transferred to, stored, and processed in the US or other countries.
      </p>
      <p>
        We ensure appropriate safeguards are in place for international data transfers in compliance with GDPR and other applicable laws.
      </p>

      <h2>Data Retention</h2>
      <p>
        We keep your information only as long as necessary:
      </p>
      <ul>
        <li><strong>Account data:</strong> Until you delete your account, plus up to 30 days for backup systems</li>
        <li><strong>Usage analytics:</strong> Aggregated and anonymized after 26 months</li>
        <li><strong>Legal requirements:</strong> Some data may be retained longer if required by law</li>
      </ul>

      <h2>Changes to This Policy</h2>
      <p>
        We may update this privacy policy occasionally. When we do:
      </p>
      <ul>
        <li>We'll update the "Last Updated" date at the top</li>
        <li>For significant changes, we'll notify you via email or prominent site notice</li>
        <li>Your continued use of CitySheet after changes means you accept the updated policy</li>
      </ul>

      <h2>Third-Party Services</h2>
      <p>
        CitySheet integrates with third-party services. Each has its own privacy policy:
      </p>
      <ul>
        <li><strong>Supabase:</strong> <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">Supabase Privacy Policy</a></li>
        <li><strong>Google AdSense:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a></li>
        <li><strong>Vercel:</strong> <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Vercel Privacy Policy</a></li>
      </ul>

      <h2>California Privacy Rights (CCPA)</h2>
      <p>
        If you're a California resident, you have additional rights:
      </p>
      <ul>
        <li><strong>Right to know:</strong> What personal information we collect and how we use it</li>
        <li><strong>Right to delete:</strong> Request deletion of your personal information</li>
        <li><strong>Right to opt-out:</strong> Opt out of the "sale" of personal information (note: we don't sell your data)</li>
        <li><strong>Right to non-discrimination:</strong> We won't discriminate against you for exercising your rights</li>
      </ul>

      <h2>European Privacy Rights (GDPR)</h2>
      <p>
        If you're in the European Economic Area, you have rights under GDPR including:
      </p>
      <ul>
        <li>Right of access to your personal data</li>
        <li>Right to rectification of inaccurate data</li>
        <li>Right to erasure ("right to be forgotten")</li>
        <li>Right to restrict processing</li>
        <li>Right to data portability</li>
        <li>Right to object to processing</li>
        <li>Right to lodge a complaint with your supervisory authority</li>
      </ul>

      <h2>Contact Us</h2>
      <p>
        Questions about this privacy policy or how we handle your data?
      </p>
      <ul>
        <li><strong>Email:</strong> <a href="mailto:privacy@citysheet.com">privacy@citysheet.com</a></li>
        <li><strong>General inquiries:</strong> <a href="mailto:hello@citysheet.com">hello@citysheet.com</a></li>
      </ul>
      <p>
        We'll respond to privacy requests within 30 days.
      </p>
    </InfoPageLayout>
  )
}

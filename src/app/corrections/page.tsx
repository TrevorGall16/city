/**
 * Corrections Page
 * Allows users to report outdated or incorrect information
 */

import { InfoPageLayout } from '@/components/layout/InfoPageLayout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Submit a Correction - CitySheet',
  description: 'Found outdated or incorrect information on CitySheet? Help us keep our travel guides accurate by submitting a correction.',
  openGraph: {
    title: 'Submit a Correction - CitySheet',
    description: 'Help us keep CitySheet accurate by reporting errors or outdated information.',
    type: 'website',
  },
}

export default function CorrectionsPage() {
  return (
    <InfoPageLayout
      title="Submit a Correction"
      lastUpdated="2025-12-11"
    >
      <p className="text-lg text-slate-700 dark:text-slate-200 font-medium">
        Found something wrong? We appreciate your help keeping CitySheet accurate and up-to-date.
      </p>

      <h2>Why Corrections Matter</h2>
      <p>
        Travel information changes constantly. Restaurants close, museums update their hours, neighborhoods evolve, and prices fluctuate. Despite our best efforts to keep everything current, we rely on travelers like you to help us catch errors and outdated information.
      </p>
      <p>
        Every correction you submit makes CitySheet more useful for thousands of other travelers. Thank you for taking the time to help.
      </p>

      <h2>What to Report</h2>
      <p>
        We want to hear about:
      </p>
      <ul>
        <li><strong>Outdated information:</strong> Closed businesses, changed hours, new prices</li>
        <li><strong>Factual errors:</strong> Wrong addresses, incorrect descriptions, broken links</li>
        <li><strong>Missing context:</strong> Important details we left out</li>
        <li><strong>Misleading recommendations:</strong> Places that no longer meet quality standards</li>
        <li><strong>Translation issues:</strong> Incorrect or confusing translated text</li>
        <li><strong>Technical problems:</strong> Broken features, display issues, bugs</li>
      </ul>

      <h2>How to Submit a Correction</h2>

      <h3>Email Method (Recommended)</h3>
      <p>
        Send your correction to <a href="mailto:corrections@citysheet.com">corrections@citysheet.com</a> with:
      </p>
      <ul>
        <li><strong>Subject line:</strong> "Correction: [City Name] - [Brief Description]"</li>
        <li><strong>City and page:</strong> Which city and section needs updating</li>
        <li><strong>What's wrong:</strong> Clear description of the error or outdated information</li>
        <li><strong>Correct information:</strong> What it should say instead (if known)</li>
        <li><strong>Source (if applicable):</strong> Link or reference confirming the correction</li>
        <li><strong>When you visited (if relevant):</strong> Help us understand timing</li>
      </ul>

      <h3>Example Correction Email</h3>
      <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-6 my-6 font-mono text-sm">
        <p className="text-slate-600 dark:text-slate-400 mb-2"><strong>Subject:</strong> Correction: Paris - Le Comptoir du Relais</p>
        <div className="text-slate-900 dark:text-slate-100">
          <p className="mb-2">Hi CitySheet team,</p>
          <p className="mb-2">The listing for Le Comptoir du Relais in the Latin Quarter needs updating:</p>
          <p className="mb-2"><strong>Issue:</strong> The restaurant is listed as "no reservations required" but they now require advance reservations for dinner.</p>
          <p className="mb-2"><strong>Correct info:</strong> Reservations required for dinner service, walk-ins accepted for lunch only. Book at least 2-3 days ahead for weekends.</p>
          <p className="mb-2"><strong>Source:</strong> Their website and I visited on December 8, 2025.</p>
          <p>Thanks for maintaining such a useful resource!</p>
        </div>
      </div>

      <h3>What Happens Next</h3>
      <ol>
        <li><strong>We acknowledge receipt:</strong> You'll get a confirmation email within 24 hours</li>
        <li><strong>We verify the information:</strong> Our team checks multiple sources to confirm</li>
        <li><strong>We update the guide:</strong> Corrections are typically live within 48 hours</li>
        <li><strong>We thank you:</strong> You'll receive confirmation when the update is published</li>
      </ol>

      <h2>Correction Guidelines</h2>

      <h3>Be Specific</h3>
      <p>
        <strong>Helpful:</strong> "The opening hours for Musée d'Orsay are now 9:30 AM - 6 PM on weekdays, closed Mondays, not 9 AM - 6 PM daily as stated."
      </p>
      <p>
        <strong>Less helpful:</strong> "The museum hours are wrong."
      </p>

      <h3>Provide Context</h3>
      <p>
        Tell us when you encountered the issue and how you confirmed the correct information. This helps us verify and understand if it's a permanent change or temporary situation.
      </p>

      <h3>Include Sources When Possible</h3>
      <p>
        Links to official websites, recent news articles, or authoritative sources help us verify and update information faster.
      </p>

      <h3>Be Respectful</h3>
      <p>
        We're grateful for corrections, even when they point out mistakes. A friendly tone makes the process better for everyone.
      </p>

      <h2>Types of Updates</h2>

      <h3>Critical Corrections (24-48 hours)</h3>
      <p>
        These are updated immediately:
      </p>
      <ul>
        <li>Permanently closed businesses</li>
        <li>Safety concerns or warnings</li>
        <li>Significantly wrong information (wrong city, wrong address, etc.)</li>
        <li>Broken or harmful links</li>
      </ul>

      <h3>Standard Updates (2-5 days)</h3>
      <p>
        These are updated during our regular review cycle:
      </p>
      <ul>
        <li>Changed hours or prices</li>
        <li>Updated contact information</li>
        <li>Minor factual corrections</li>
        <li>Improved descriptions or context</li>
      </ul>

      <h3>Suggestions (Reviewed quarterly)</h3>
      <p>
        These are considered for future updates:
      </p>
      <ul>
        <li>New recommendations to add</li>
        <li>Subjective quality assessments</li>
        <li>Feature requests or improvements</li>
        <li>Style or formatting suggestions</li>
      </ul>

      <h2>What We Don't Correct</h2>
      <p>
        Some things fall outside our corrections process:
      </p>
      <ul>
        <li><strong>Subjective disagreements:</strong> "I didn't like this restaurant" isn't a correction, though we appreciate the feedback</li>
        <li><strong>Personal recommendations:</strong> "You should add my friend's cafe" - use our partnership contact instead</li>
        <li><strong>Promotional requests:</strong> We don't accept paid placements or promotional corrections</li>
        <li><strong>Temporary closures:</strong> We focus on permanent or long-term changes, not daily variations</li>
      </ul>

      <h2>Frequent Contributor Recognition</h2>
      <p>
        Submit multiple high-quality corrections? We notice and appreciate it. Frequent contributors may be:
      </p>
      <ul>
        <li>Acknowledged in our community thanks section</li>
        <li>Invited to become verified local experts</li>
        <li>Given early access to new features</li>
        <li>Credited for significant contributions (with permission)</li>
      </ul>

      <h2>Privacy & Credit</h2>
      <p>
        When you submit a correction:
      </p>
      <ul>
        <li><strong>We keep it private:</strong> Your email and personal details aren't shared publicly</li>
        <li><strong>No spam:</strong> We only contact you about the specific correction you submitted</li>
        <li><strong>Optional credit:</strong> Let us know if you'd like to be credited for significant contributions</li>
      </ul>

      <h2>Beyond Corrections</h2>
      <p>
        Have more extensive feedback or suggestions? Here's where to send it:
      </p>
      <ul>
        <li><strong>General feedback:</strong> <a href="mailto:hello@citysheet.com">hello@citysheet.com</a></li>
        <li><strong>Feature requests:</strong> <a href="mailto:feedback@citysheet.com">feedback@citysheet.com</a></li>
        <li><strong>Partnership inquiries:</strong> <a href="mailto:partners@citysheet.com">partners@citysheet.com</a></li>
        <li><strong>Press and media:</strong> <a href="mailto:press@citysheet.com">press@citysheet.com</a></li>
      </ul>

      <h2>Thank You</h2>
      <p>
        CitySheet is better because of travelers like you who take the time to share corrections. Every email helps make our guides more accurate and useful for the next person planning a trip.
      </p>
      <p>
        We read every correction and take them seriously. Thank you for being part of the CitySheet community.
      </p>

      <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-lg p-6 my-8">
        <h3 className="text-xl font-semibold text-indigo-900 dark:text-indigo-100 mb-3">
          Ready to Submit a Correction?
        </h3>
        <p className="text-indigo-800 dark:text-indigo-200 mb-4">
          Email us at <a href="mailto:corrections@citysheet.com" className="font-semibold underline">corrections@citysheet.com</a> with the details.
        </p>
        <p className="text-sm text-indigo-700 dark:text-indigo-300">
          Include: City name, what's wrong, correct information, and source (if available).
          We'll respond within 24 hours.
        </p>
      </div>
    </InfoPageLayout>
  )
}

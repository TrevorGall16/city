/**
 * Methodology Page
 * Explains data verification process, update cycles, and quality standards
 */

import { InfoPageLayout } from '@/components/layout/InfoPageLayout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Methodology - How CitySheet Works',
  description: 'Learn how CitySheet verifies information, selects cities, maintains data freshness, and ensures quality across all travel guides.',
  openGraph: {
    title: 'Our Methodology - How CitySheet Works',
    description: 'Transparent process for verifying travel information and maintaining quality standards.',
    type: 'website',
  },
}

export default function MethodologyPage() {
  return (
    <InfoPageLayout
      title="Our Methodology"
      lastUpdated="2025-12-11"
    >
      <p className="text-lg text-slate-700 dark:text-slate-200 font-medium">
        How we research, verify, and maintain travel information for CitySheet.
      </p>

      <h2>Our Approach to Travel Information</h2>
      <p>
        CitySheet is built on a simple principle: actionable accuracy over exhaustive coverage. We'd rather have 50 verified recommendations that we're confident about than 500 generic suggestions pulled from tourist websites.
      </p>
      <p>
        Every city guide on CitySheet goes through a rigorous verification process combining multiple data sources, local expertise, and real traveler feedback.
      </p>

      <h2>Data Sources & Verification</h2>

      <h3>Primary Sources</h3>
      <p>
        We prioritize information from these trusted sources:
      </p>
      <ul>
        <li><strong>Local experts and residents:</strong> Input from people who live in the city and know it intimately</li>
        <li><strong>Official tourism boards:</strong> Verified information about attractions, hours, and current status</li>
        <li><strong>Direct verification:</strong> On-site visits and firsthand experiences from our team and verified contributors</li>
        <li><strong>Trusted travel communities:</strong> Curated insights from experienced travelers and expat communities</li>
        <li><strong>Official business sources:</strong> Restaurant websites, museum official pages, transport authority information</li>
      </ul>

      <h3>Verification Process</h3>
      <p>
        Before any recommendation appears on CitySheet, it goes through these steps:
      </p>
      <ol>
        <li><strong>Initial research:</strong> Gather information from multiple primary sources</li>
        <li><strong>Cross-reference:</strong> Verify details across at least three independent sources</li>
        <li><strong>Practical validation:</strong> Confirm practical details (opening hours, prices, accessibility, language support)</li>
        <li><strong>Quality assessment:</strong> Evaluate whether the recommendation meets our standards for usefulness and relevance</li>
        <li><strong>Local validation:</strong> When possible, confirm with local experts or recent visitors</li>
        <li><strong>Regular updates:</strong> Continuously monitor for changes and update accordingly</li>
      </ol>

      <h3>What We Don't Use</h3>
      <p>
        To maintain quality and originality, we explicitly avoid:
      </p>
      <ul>
        <li><strong>Pure AI generation:</strong> We don't auto-generate content from language models without human verification</li>
        <li><strong>Unverified user reviews:</strong> Individual reviews are helpful, but we look for patterns across many sources</li>
        <li><strong>Sponsored content without disclosure:</strong> If we're compensated, we clearly disclose it</li>
        <li><strong>Outdated guidebooks:</strong> Print guidebooks often lag reality by years</li>
        <li><strong>Viral social media posts:</strong> Instagram-famous doesn't mean actually useful</li>
      </ul>

      <h2>Update Cycles & Data Freshness</h2>

      <h3>Continuous Monitoring</h3>
      <p>
        Travel information changes constantly. A restaurant closes, a museum changes hours, a neighborhood gentrifies. We maintain data freshness through:
      </p>
      <ul>
        <li><strong>Quarterly reviews:</strong> Every city guide is reviewed at least once per quarter</li>
        <li><strong>Real-time monitoring:</strong> We track official sources for major changes (closures, renovations, etc.)</li>
        <li><strong>User corrections:</strong> Our <a href="/corrections">corrections system</a> lets travelers report outdated information</li>
        <li><strong>Automated checks:</strong> We use technology to flag potential issues (broken links, changed hours, etc.)</li>
        <li><strong>Seasonal updates:</strong> Before peak travel seasons, we perform focused updates on relevant cities</li>
      </ul>

      <h3>Last Updated Dates</h3>
      <p>
        Every city page displays when it was last verified. If you see information that seems outdated, please <a href="/corrections">submit a correction</a>—we take these seriously and aim to respond within 48 hours.
      </p>

      <h2>How We Select Cities</h2>

      <h3>Coverage Criteria</h3>
      <p>
        We don't try to cover every city on Earth. Instead, we focus on cities that meet these criteria:
      </p>
      <ul>
        <li><strong>High international visitation:</strong> Cities that attract significant numbers of foreign travelers</li>
        <li><strong>Language barriers:</strong> Places where language differences create real challenges for travelers</li>
        <li><strong>Complexity:</strong> Cities with enough depth to warrant detailed, curated guidance</li>
        <li><strong>Quality over quantity:</strong> We'd rather cover 20 cities thoroughly than 200 cities superficially</li>
      </ul>

      <h3>Expansion Strategy</h3>
      <p>
        We're steadily expanding coverage based on:
      </p>
      <ul>
        <li>User requests and demand</li>
        <li>Geographic diversity (not just Western Europe)</li>
        <li>Availability of quality local sources</li>
        <li>Team capacity to maintain high standards</li>
      </ul>

      <h2>Quality Standards</h2>

      <h3>What Makes a Good Recommendation?</h3>
      <p>
        Not everything that's "good" makes it onto CitySheet. We apply strict criteria:
      </p>
      <ul>
        <li><strong>Uniqueness:</strong> Is this genuinely distinctive, or just another cafe?</li>
        <li><strong>Practicality:</strong> Can a typical traveler actually access and enjoy this?</li>
        <li><strong>Reliability:</strong> Is this consistently good, or hit-or-miss?</li>
        <li><strong>Value:</strong> Does the experience justify the time, money, or effort?</li>
        <li><strong>Relevance:</strong> Does this serve a clear traveler need?</li>
      </ul>

      <h3>Handling Subjectivity</h3>
      <p>
        Travel is inherently subjective. What we love, you might hate. Here's how we handle this:
      </p>
      <ul>
        <li>We focus on objective factors (quality, authenticity, value) over pure opinion</li>
        <li>We include information that helps you self-select ("best for solo travelers," "skip if you have kids," etc.)</li>
        <li>We provide context about why something is recommended, not just that it is</li>
        <li>We're honest about trade-offs and limitations</li>
      </ul>

      <h2>Accuracy Commitment</h2>
      <p>
        Despite our best efforts, errors happen. Travel information changes fast, sources conflict, and mistakes slip through. When they do:
      </p>
      <ul>
        <li>We correct them promptly—usually within 24-48 hours of notification</li>
        <li>We acknowledge the correction publicly if it's significant</li>
        <li>We analyze what went wrong to prevent similar errors</li>
        <li>We're transparent about uncertainty when we have it</li>
      </ul>
      <p>
        <strong>Found an error?</strong> Please <a href="/corrections">submit a correction</a>. You're helping make CitySheet better for everyone.
      </p>

      <h2>Editorial Independence</h2>
      <p>
        CitySheet maintains strict editorial independence:
      </p>
      <ul>
        <li><strong>No pay-for-placement:</strong> Recommendations are never influenced by payment</li>
        <li><strong>Disclosed affiliations:</strong> When we use affiliate links, we clearly mark them</li>
        <li><strong>Ad separation:</strong> Advertising appears separately from editorial content</li>
        <li><strong>Honest assessments:</strong> We recommend what we genuinely believe is best, not what's profitable</li>
      </ul>

      <h2>Continuous Improvement</h2>
      <p>
        Our methodology evolves as we learn what works and what doesn't. We regularly:
      </p>
      <ul>
        <li>Review user feedback and correction submissions</li>
        <li>Analyze which recommendations prove most useful</li>
        <li>Test new verification approaches</li>
        <li>Incorporate better data sources as they become available</li>
        <li>Refine our quality standards based on real-world results</li>
      </ul>
      <p>
        Questions about our methodology? Contact us at <a href="mailto:hello@citysheet.com">hello@citysheet.com</a>.
      </p>
    </InfoPageLayout>
  )
}

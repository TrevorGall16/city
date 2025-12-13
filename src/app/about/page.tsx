/**
 * About Page
 * Mission, values, and team information for CitySheet
 */

import { InfoPageLayout } from '@/components/layout/InfoPageLayout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About CitySheet - No-Fluff Travel Utility',
  description: 'Learn about CitySheet\'s mission to provide curated, actionable travel information without the fluff. Human-verified guides for real travelers.',
  openGraph: {
    title: 'About CitySheet - No-Fluff Travel Utility',
    description: 'Learn about CitySheet\'s mission to provide curated, actionable travel information without the fluff.',
    type: 'website',
  },
}

export default function AboutPage() {
  return (
    <InfoPageLayout
      title="About CitySheet"
      lastUpdated="2025-12-11"
    >
      <h2>What is CitySheet?</h2>
      <p>
        CitySheet is a no-fluff travel utility designed for travelers who need real, actionable information—not blog stories about someone's perfect sunset moment or AI-generated content that all sounds the same.
      </p>
      <p>
        We cut through the noise and give you what you actually need: the best restaurant in the Latin Quarter, whether the metro takes cards, which museum to skip if you only have two days, and how to pronounce the street name to a taxi driver.
      </p>

      <h2>Why CitySheet Exists</h2>
      <p>
        Modern travel content is broken. Search for "best things to do in Paris" and you'll drown in:
      </p>
      <ul>
        <li><strong>SEO-optimized blog posts</strong> with 2,000 words of fluff before getting to the point</li>
        <li><strong>AI-generated listicles</strong> that regurgitate the same generic recommendations</li>
        <li><strong>Influencer content</strong> optimized for Instagram, not for actual usefulness</li>
        <li><strong>Outdated guidebooks</strong> that still recommend places that closed in 2019</li>
      </ul>
      <p>
        CitySheet exists because we believe travelers deserve better. You deserve information that respects your time, your intelligence, and your unique travel needs.
      </p>

      <h2>Our Values</h2>

      <h3>No Fluff, Period</h3>
      <p>
        Every word on CitySheet earns its place. No life stories, no "wanderlust" poetry, no 10-paragraph intros. We answer your question in the first sentence, not the seventh paragraph.
      </p>

      <h3>Actionable Over Aspirational</h3>
      <p>
        We don't tell you that Paris is "magical" or that you "must visit the Eiffel Tower." We tell you the best time to go (early morning, 9 AM opening), how to buy tickets (online, skip the line), and what to know before you arrive (security checks take 20+ minutes).
      </p>

      <h3>Human-Curated, Not Algorithm-Generated</h3>
      <p>
        While we use technology to help organize and present information, every recommendation on CitySheet is verified by real people who have actually been there. We prioritize local expertise, verified traveler experiences, and official sources over AI-generated summaries.
      </p>

      <h3>Traveler-Focused Design</h3>
      <p>
        CitySheet is built for people who are actually traveling, not for people who like reading about travel. That means:
      </p>
      <ul>
        <li>Mobile-first design (because you're using this on your phone in a foreign city)</li>
        <li>Offline-capable features (because you won't always have data)</li>
        <li>Instant translation (because not everyone speaks English)</li>
        <li>Quick-reference format (because you're standing on a street corner, not sitting at home)</li>
      </ul>

      <h3>Transparency & Trust</h3>
      <p>
        We're honest about how we make money (ads and affiliate links), how we gather information (verified sources and local experts), and what we don't know (we'll tell you when information is limited or uncertain).
      </p>

      <h2>Who We Are</h2>
      <p>
        CitySheet is built by travelers, for travelers. Our team combines decades of international travel experience with expertise in web development, user experience design, and data verification.
      </p>
      <p>
        We're not a venture-backed startup trying to "disrupt" travel. We're not selling hotel packages or tour bookings. We're building a utility that we ourselves want to use when we travel—and we think you'll find it useful too.
      </p>

      <h2>What's Next</h2>
      <p>
        We're constantly expanding our city coverage and improving our features. Upcoming additions include:
      </p>
      <ul>
        <li>More cities across Europe, Asia, and the Americas</li>
        <li>Offline mode for accessing guides without internet</li>
        <li>User contributions and community verification</li>
        <li>Real-time updates for temporary closures and events</li>
        <li>Neighborhood deep-dives for major cities</li>
      </ul>

      <h2>Get in Touch</h2>
      <p>
        Have a question, suggestion, or city you'd like to see covered? We'd love to hear from you.
      </p>
      <ul>
        <li><strong>General inquiries:</strong> <a href="mailto:hello@citysheet.com">hello@citysheet.com</a></li>
        <li><strong>Corrections or updates:</strong> <a href="/corrections">Submit a correction</a></li>
        <li><strong>Partnership opportunities:</strong> <a href="mailto:partners@citysheet.com">partners@citysheet.com</a></li>
      </ul>
    </InfoPageLayout>
  )
}

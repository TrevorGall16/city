/**
 * How to Use Page
 * Guide explaining CitySheet features and functionality
 */

import { InfoPageLayout } from '@/components/layout/InfoPageLayout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How to Use CitySheet - User Guide',
  description: 'Learn how to use CitySheet\'s interactive maps, city guides, translation features, and more. Get the most out of your travel planning.',
  openGraph: {
    title: 'How to Use CitySheet - User Guide',
    description: 'Complete guide to using CitySheet\'s features for better travel planning.',
    type: 'website',
  },
}

export default function HowToUsePage() {
  return (
    <InfoPageLayout
      title="How to Use CitySheet"
      lastUpdated="2025-12-11"
    >
      <p className="text-lg text-slate-700 dark:text-slate-200 font-medium">
        Get the most out of CitySheet with this guide to our features and functionality.
      </p>

      <h2>Getting Started</h2>
      <p>
        CitySheet is designed to be instantly useful, whether you're planning a trip months in advance or standing on a street corner trying to find lunch. Here's how everything works.
      </p>

      <h2>Finding Your City</h2>

      <h3>Interactive World Map</h3>
      <p>
        Our homepage features an interactive map showing all cities currently covered by CitySheet:
      </p>
      <ul>
        <li><strong>Click any marker:</strong> See a preview of that city with key highlights</li>
        <li><strong>Zoom and pan:</strong> Explore different regions to find your destination</li>
        <li><strong>Filter by region:</strong> Use the region selector to focus on specific areas</li>
        <li><strong>Search:</strong> Type a city name in the search box for quick access</li>
      </ul>

      <h3>Mobile Experience</h3>
      <p>
        On mobile devices, the map automatically adjusts:
      </p>
      <ul>
        <li>Touch gestures for zooming and panning</li>
        <li>Larger tap targets for easier interaction</li>
        <li>Optimized layout for smaller screens</li>
        <li>Swipe to browse city previews</li>
      </ul>

      <h2>Using City Pages</h2>

      <h3>Page Structure</h3>
      <p>
        Every city page follows the same clear structure:
      </p>

      <h4>At a Glance Dashboard</h4>
      <p>
        Quick reference cards at the top of each city page showing:
      </p>
      <ul>
        <li><strong>Best time to visit:</strong> Optimal months based on weather, crowds, and prices</li>
        <li><strong>Budget estimate:</strong> Daily costs for budget, mid-range, and luxury travel</li>
        <li><strong>Language essentials:</strong> Key phrases with pronunciation</li>
        <li><strong>Getting around:</strong> Transportation overview and tips</li>
        <li><strong>Quick tips:</strong> Essential information you need to know</li>
      </ul>

      <h4>Must Eat</h4>
      <p>
        Curated restaurant and food recommendations:
      </p>
      <ul>
        <li>Organized by meal type (breakfast, lunch, dinner, drinks)</li>
        <li>Price indicators (€, €€, €€€)</li>
        <li>Location and neighborhood information</li>
        <li>What to order and insider tips</li>
        <li>Reservation requirements and timing advice</li>
      </ul>

      <h4>Must See</h4>
      <p>
        Top attractions and sights worth your time:
      </p>
      <ul>
        <li>Iconic landmarks and hidden gems</li>
        <li>Opening hours and admission prices</li>
        <li>Best times to visit (avoid crowds)</li>
        <li>How much time to allocate</li>
        <li>Skip-the-line tips and booking links</li>
      </ul>

      <h4>Neighborhoods</h4>
      <p>
        District-by-district breakdowns:
      </p>
      <ul>
        <li>Character and vibe of each area</li>
        <li>What to do and see in each neighborhood</li>
        <li>Best for different traveler types</li>
        <li>Where to stay recommendations</li>
        <li>Safety and accessibility notes</li>
      </ul>

      <h4>Culture & Context</h4>
      <p>
        Important cultural information:
      </p>
      <ul>
        <li>Local customs and etiquette</li>
        <li>Tipping practices</li>
        <li>Language tips and common phrases</li>
        <li>What to know before you go</li>
        <li>Local quirks and unwritten rules</li>
      </ul>

      <h3>Navigation Features</h3>

      <h4>Sticky Navigation Menu</h4>
      <p>
        On city pages, a navigation menu stays visible as you scroll:
      </p>
      <ul>
        <li>Quick jump to any section</li>
        <li>Shows your current location on the page</li>
        <li>Collapses on mobile for more screen space</li>
      </ul>

      <h4>Category Filters</h4>
      <p>
        In Must Eat and Must See sections, filter recommendations by:
      </p>
      <ul>
        <li><strong>Type:</strong> Restaurants, cafes, bars, museums, parks, etc.</li>
        <li><strong>Price range:</strong> Budget, mid-range, splurge</li>
        <li><strong>Neighborhood:</strong> See only places in specific areas</li>
        <li><strong>Special features:</strong> Kid-friendly, romantic, outdoor seating, etc.</li>
      </ul>

      <h2>Translation Features</h2>

      <h3>Instant Translation</h3>
      <p>
        Every city page includes instant translation for practical phrases:
      </p>
      <ul>
        <li><strong>Place names:</strong> Click any restaurant or attraction to see the local spelling</li>
        <li><strong>Essential phrases:</strong> "Where is...?", "How much?", "Thank you"</li>
        <li><strong>Food vocabulary:</strong> Menu items and dietary restrictions</li>
        <li><strong>Transportation:</strong> Ticket types, directions, common questions</li>
      </ul>

      <h3>Pronunciation Guides</h3>
      <p>
        Phonetic guides help you speak confidently:
      </p>
      <ul>
        <li>Simplified pronunciation in English letters</li>
        <li>Stress indicators for correct emphasis</li>
        <li>Audio clips for complex phrases (coming soon)</li>
      </ul>

      <h3>Using Translations Effectively</h3>
      <p>
        <strong>Desktop:</strong> Keep the city page open on your laptop or tablet while planning
      </p>
      <p>
        <strong>Mobile:</strong> Save the page offline (see "Offline Access" below) and reference it while traveling
      </p>
      <p>
        <strong>Pro tip:</strong> Take screenshots of key translations for quick access when you don't have internet
      </p>

      <h2>Account Features</h2>

      <h3>Creating an Account</h3>
      <p>
        CitySheet works without an account, but creating one unlocks additional features:
      </p>
      <ul>
        <li><strong>Save favorite places:</strong> Bookmark restaurants and attractions</li>
        <li><strong>Create itineraries:</strong> Build day-by-day trip plans</li>
        <li><strong>Track visited cities:</strong> Mark cities you've been to</li>
        <li><strong>Sync across devices:</strong> Access your saves on any device</li>
        <li><strong>Contribute:</strong> Leave helpful comments and tips</li>
      </ul>

      <h3>Sign In Options</h3>
      <ul>
        <li>Email and password</li>
        <li>Google account</li>
        <li>Apple ID</li>
      </ul>

      <h3>Privacy & Data</h3>
      <p>
        Your account is private by default. We don't share your travel plans or saved places with anyone. See our <a href="/privacy">Privacy Policy</a> for details.
      </p>

      <h2>Offline Access</h2>

      <h3>Progressive Web App (PWA)</h3>
      <p>
        CitySheet works as a Progressive Web App, which means:
      </p>
      <ul>
        <li><strong>Install to home screen:</strong> Add CitySheet like a native app</li>
        <li><strong>Offline reading:</strong> City pages load even without internet</li>
        <li><strong>Fast loading:</strong> Content is cached for instant access</li>
        <li><strong>Lower data usage:</strong> Less bandwidth needed for return visits</li>
      </ul>

      <h3>How to Install (Mobile)</h3>
      <p>
        <strong>iPhone/iPad (Safari):</strong>
      </p>
      <ol>
        <li>Tap the Share button</li>
        <li>Select "Add to Home Screen"</li>
        <li>Tap "Add"</li>
      </ol>
      <p>
        <strong>Android (Chrome):</strong>
      </p>
      <ol>
        <li>Tap the three-dot menu</li>
        <li>Select "Install app" or "Add to Home screen"</li>
        <li>Tap "Install"</li>
      </ol>

      <h3>How to Install (Desktop)</h3>
      <p>
        <strong>Chrome, Edge, or Brave:</strong>
      </p>
      <ol>
        <li>Look for the install icon in the address bar</li>
        <li>Click "Install"</li>
        <li>CitySheet will open as a standalone app</li>
      </ol>

      <h2>Understanding Affiliate Links</h2>

      <h3>What Are Affiliate Links?</h3>
      <p>
        Some links on CitySheet are affiliate links, marked with a small tag or icon. If you book through these links, we may earn a small commission at no extra cost to you.
      </p>

      <h3>Our Affiliate Policy</h3>
      <ul>
        <li><strong>Editorial independence:</strong> Affiliate relationships never influence our recommendations</li>
        <li><strong>Clear labeling:</strong> Affiliate links are always marked</li>
        <li><strong>Best options:</strong> We only link to services we genuinely recommend</li>
        <li><strong>Your choice:</strong> You're never required to use affiliate links</li>
      </ul>

      <h3>Where We Use Affiliate Links</h3>
      <ul>
        <li><strong>Accommodation:</strong> Booking.com, Airbnb links for hotels and rentals</li>
        <li><strong>Activities:</strong> GetYourGuide, Viator for tours and experiences</li>
        <li><strong>Transportation:</strong> Rail passes, airport transfers, car rentals</li>
        <li><strong>Travel insurance:</strong> SafetyWing, World Nomads</li>
      </ul>

      <h3>Supporting CitySheet</h3>
      <p>
        Using our affiliate links helps support CitySheet at no extra cost to you. It's one way you can help us keep creating and updating these guides. But it's totally optional—our content is useful either way.
      </p>

      <h2>Advertising on CitySheet</h2>

      <h3>Why We Show Ads</h3>
      <p>
        CitySheet is free to use, and advertising helps us:
      </p>
      <ul>
        <li>Cover hosting and infrastructure costs</li>
        <li>Pay for data sources and verification tools</li>
        <li>Expand coverage to more cities</li>
        <li>Keep the service free for everyone</li>
      </ul>

      <h3>Our Ad Philosophy</h3>
      <ul>
        <li><strong>User experience first:</strong> Ads never block content or create popups</li>
        <li><strong>Clearly separated:</strong> Ads are visually distinct from our content</li>
        <li><strong>Relevant:</strong> We try to show ads related to travel and your interests</li>
        <li><strong>Performance-conscious:</strong> Ads are optimized not to slow down the site</li>
        <li><strong>Respectful:</strong> No autoplay videos, no aggressive tactics</li>
      </ul>

      <h3>Ad Placement</h3>
      <p>
        You'll see ads in these locations:
      </p>
      <ul>
        <li><strong>Homepage:</strong> Between featured cities</li>
        <li><strong>City pages:</strong> Between major sections</li>
        <li><strong>Sidebar:</strong> On desktop, in the right column</li>
        <li><strong>Bottom of page:</strong> After the main content</li>
      </ul>

      <h3>Ad Privacy & Control</h3>
      <p>
        We use Google AdSense for advertising. You can:
      </p>
      <ul>
        <li><strong>Control personalization:</strong> Visit <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Google Ads Settings</a></li>
        <li><strong>Opt out of tracking:</strong> Use browser privacy settings</li>
        <li><strong>Learn more:</strong> See our <a href="/privacy">Privacy Policy</a></li>
      </ul>

      <h2>Tips for Different Use Cases</h2>

      <h3>Planning a Trip (Weeks/Months Ahead)</h3>
      <ol>
        <li>Browse the interactive map to explore destinations</li>
        <li>Read the full city page for your destination</li>
        <li>Create an account to save favorite places</li>
        <li>Build a rough itinerary based on neighborhoods</li>
        <li>Book accommodations and skip-the-line tickets using our links</li>
      </ol>

      <h3>During Your Trip</h3>
      <ol>
        <li>Install CitySheet as a PWA for offline access</li>
        <li>Reference the "At a Glance" section for quick facts</li>
        <li>Use filters to find nearby restaurants or attractions</li>
        <li>Screenshot key translations for offline use</li>
        <li>Check back for real-time updates or changes</li>
      </ol>

      <h3>Last-Minute Planning (Days Before)</h3>
      <ol>
        <li>Start with the "Must See" and "Must Eat" sections</li>
        <li>Use the neighborhood guide to pick where to base yourself</li>
        <li>Focus on the "Culture & Context" section for essential etiquette</li>
        <li>Save top recommendations to your account</li>
        <li>Screenshot practical info for easy access while traveling</li>
      </ol>

      <h2>Mobile vs Desktop Experience</h2>

      <h3>Desktop Advantages</h3>
      <ul>
        <li>Larger map for better exploration</li>
        <li>Side-by-side comparison of cities</li>
        <li>More content visible at once</li>
        <li>Easier for detailed trip planning</li>
      </ul>

      <h3>Mobile Advantages</h3>
      <ul>
        <li>Use it while actually traveling</li>
        <li>Install as PWA for offline access</li>
        <li>Quick reference when you need it</li>
        <li>Touch-optimized interactions</li>
        <li>Share recommendations directly from your phone</li>
      </ul>

      <h3>Best Practice</h3>
      <p>
        Use desktop for initial research and planning, then access on mobile during your trip. Your saved places and itinerary sync between devices if you're signed in.
      </p>

      <h2>Accessibility Features</h2>
      <p>
        CitySheet is designed to be accessible to everyone:
      </p>
      <ul>
        <li><strong>Keyboard navigation:</strong> Navigate without a mouse using Tab, Enter, and arrow keys</li>
        <li><strong>Screen reader support:</strong> Properly labeled elements and ARIA attributes</li>
        <li><strong>High contrast mode:</strong> Readable in light and dark themes</li>
        <li><strong>Resizable text:</strong> Zoom up to 200% without breaking layout</li>
        <li><strong>Focus indicators:</strong> Clear visual indicators for keyboard navigation</li>
      </ul>

      <h2>Feedback & Improvements</h2>
      <p>
        CitySheet improves based on traveler feedback. If you:
      </p>
      <ul>
        <li><strong>Found incorrect information:</strong> <a href="/corrections">Submit a correction</a></li>
        <li><strong>Have a feature suggestion:</strong> <a href="mailto:feedback@citysheet.com">feedback@citysheet.com</a></li>
        <li><strong>Encountered a bug:</strong> <a href="mailto:hello@citysheet.com">hello@citysheet.com</a></li>
        <li><strong>Want to contribute local expertise:</strong> <a href="mailto:contributors@citysheet.com">contributors@citysheet.com</a></li>
      </ul>

      <h2>Frequently Asked Questions</h2>

      <h3>Is CitySheet really free?</h3>
      <p>
        Yes. All content is free to access. We're supported by advertising and affiliate commissions, not subscriptions or paywalls.
      </p>

      <h3>Do I need an account?</h3>
      <p>
        No. You can use CitySheet without creating an account. Accounts add features like saving favorites and creating itineraries.
      </p>

      <h3>Can I download city guides for offline use?</h3>
      <p>
        Install CitySheet as a PWA and recently viewed pages will be cached for offline access. We're working on explicit offline download features.
      </p>

      <h3>How often is information updated?</h3>
      <p>
        Every city is reviewed at least quarterly, with real-time updates for major changes. See our <a href="/methodology">Methodology</a> page for details.
      </p>

      <h3>Can I suggest a city to add?</h3>
      <p>
        Absolutely! Email <a href="mailto:hello@citysheet.com">hello@citysheet.com</a> with your suggestion. We prioritize based on demand and data availability.
      </p>

      <h3>Are your recommendations sponsored?</h3>
      <p>
        No. Our editorial recommendations are never influenced by payment. We only recommend what we genuinely believe is best. Affiliate links are clearly marked.
      </p>

      <h2>Get Started</h2>
      <p>
        Ready to explore? Head back to the <a href="/">homepage</a> and find your next destination on our interactive map.
      </p>
    </InfoPageLayout>
  )
}

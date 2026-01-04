import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    // 🎯 Step 1: Read your raw data list from the public folder
    const filePath = path.join(process.cwd(), 'public', 'sitemap.xml');
    const rawContent = await fs.readFile(filePath, 'utf8');

    // 🎯 Step 2: Convert your raw lines into valid Google XML format
    // This handles the "one long line" problem automatically
    const urls = rawContent.split(/\s+/).filter(url => url.startsWith('http'));
    
    const xmlEntries = urls.map(url => `
  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('');

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>`;

    // 🎯 Step 3: Serve it as XML (bypassing all language redirects)
    return new NextResponse(sitemapXml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Sitemap API Error:', error);
    return new NextResponse('Sitemap Not Found', { status: 404 });
  }
}
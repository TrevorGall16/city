import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    // 🎯 MASTER AI: Try multiple paths to find the file on the Netlify server
    const possiblePaths = [
      path.join(process.cwd(), 'public', 'seo', 'sitemap.xml'),
      path.join(process.cwd(), 'seo', 'sitemap.xml'),
      path.join('/var/task/public/seo/sitemap.xml'), // Netlify specific internal path
    ];

    let rawContent = '';
    let found = false;

    for (const filePath of possiblePaths) {
      try {
        rawContent = await fs.readFile(filePath, 'utf8');
        found = true;
        break; 
      } catch (e) {
        continue;
      }
    }

    if (!found) {
      return new NextResponse('Error: Raw sitemap.xml not found in public/seo/', { status: 404 });
    }

    // 🎯 Step 2: Convert raw lines into XML
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

    return new NextResponse(sitemapXml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    return new NextResponse(`Sitemap API Error: ${error}`, { status: 500 });
  }
}
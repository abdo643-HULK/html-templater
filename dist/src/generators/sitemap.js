import { writeFileSync } from 'fs';
import 'path';
import './robots.js';
const BLOG_PATH = '';
const defaultConfig = {};
const DEFAULT_PAGE_PRIORITY = 0.7;
const DEFAULT_CHANGE_FREQUENZY = 'monthly';
const DEFAULT_BASE_FILENAME = 'sitemap';
const config = {
    siteUrl: encodeURIComponent(''),
    changefreq: 'daily',
    priority: 0.7,
    sitemapSize: 5000,
    exclude: ['/protected-page', '/awesome/secret-page'],
    alternateRefs: [
        {
            href: 'https://es.example.com',
            hreflang: 'es',
        },
        {
            href: 'https://fr.example.com',
            hreflang: 'fr',
        },
    ],
};
const TIMESTAMP = new Date().toISOString();
function xmlTemplate(content) {
    return `<?xml version="1.0" encoding="UTF-8" ?>\n<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:pagemap="http://www.google.com/schemas/sitemap-pagemap/1.0" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${content}</urlset>`;
}
function render(pages) {
    const sitemap = xmlTemplate(pages
        .map((element) => {
        const fields = `<loc>${element.loc}</loc>
			<lastmod>${element.lastmod}</lastmod>
			<changefreq>${element.changefreq}</changefreq>
			<priority>${element.priority || DEFAULT_PAGE_PRIORITY}</priority>`;
        return `<url>${fields}</url>\n`;
    })
        .join(''));
    return sitemap;
}
export function generateSitemap(path, pages) {
    writeFileSync(path, render(pages));
}
//# sourceMappingURL=sitemap.js.map
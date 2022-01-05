import 'fs';
export function generateRobotsTxt(sitemaps, config) {
    var _a, _b, _c, _d;
    const file = [];
    const defaultPolicy = [
        {
            userAgent: '*',
            allow: ['/'],
        },
    ];
    for (const policy of ((_a = config.robotsTxt) === null || _a === void 0 ? void 0 : _a.policies) || defaultPolicy) {
        file.push(`# ${policy.userAgent}
            User-Agent: ${policy.userAgent}
            ${(_b = policy.allow) === null || _b === void 0 ? void 0 : _b.map((path) => {
            return `Allow: ${path}`;
        })}
            ${(_c = policy.disallow) === null || _c === void 0 ? void 0 : _c.map((path) => {
            return `Disallow: ${path}`;
        })}`);
    }
    file.push(`# Host
    Host: ${config.siteUrl}`);
    for (const sitemap of sitemaps) {
    }
    for (const addSitemap of ((_d = config.robotsTxt) === null || _d === void 0 ? void 0 : _d.additionalSitemaps) || []) {
    }
}
//# sourceMappingURL=robots.js.map
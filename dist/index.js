import sharp from 'sharp';
import 'path';
import 'url';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { getPath, getAppHtmlConfigFile, getSiteMapConfigFile } from './src/util/helper.js';
import { generateManifest, generateAppleImages, generateFavicons, } from './src/generators/index.js';
import { DEFAULT_MANIFEST_PATH, DEFAULTS, } from './src/util/consts.js';
main();
async function main() {
    var _a, _b;
    const appHtmlConfig = await getAppHtmlConfigFile('src/config');
    if (!appHtmlConfig.appName) {
        throw new Error('missing appName in PWA Config');
    }
    if (!appHtmlConfig.iconPath) {
        throw new Error('missing iconPath in PWA Config');
    }
    const padding = appHtmlConfig.padding || DEFAULTS.padding;
    const iconBuffer = readFileSync(appHtmlConfig.iconPath);
    const pwaManifestConfig = appHtmlConfig.pwaManifest;
    const pwaManifestIconBuffer = (pwaManifestConfig === null || pwaManifestConfig === void 0 ? void 0 : pwaManifestConfig.iconPath)
        ? readFileSync(getPath(pwaManifestConfig === null || pwaManifestConfig === void 0 ? void 0 : pwaManifestConfig.iconPath))
        : iconBuffer;
    const manifestPath = (pwaManifestConfig === null || pwaManifestConfig === void 0 ? void 0 : pwaManifestConfig.manifestOutPath) || DEFAULT_MANIFEST_PATH;
    await generateManifest({
        icon: sharp(pwaManifestIconBuffer),
        iconsOutDir: pwaManifestConfig === null || pwaManifestConfig === void 0 ? void 0 : pwaManifestConfig.iconsOutDir,
        padding: padding,
        manifestOutPath: manifestPath,
        manifest: {
            name: appHtmlConfig.appName,
            themeColor: appHtmlConfig.themeColor,
            ...((pwaManifestConfig === null || pwaManifestConfig === void 0 ? void 0 : pwaManifestConfig.manifest) || {}),
        },
    });
    console.time('Apple');
    const appleConfig = appHtmlConfig.apple;
    const appleIconBuffer = (appleConfig === null || appleConfig === void 0 ? void 0 : appleConfig.iconPath) ? readFileSync(getPath(appleConfig === null || appleConfig === void 0 ? void 0 : appleConfig.iconPath)) : iconBuffer;
    const appleTags = await generateAppleImages(sharp(appleIconBuffer), padding, {
        themeColor: appHtmlConfig.themeColor,
        themeColorDark: appHtmlConfig.themeColorDark,
        iconsOutPath: (_a = appHtmlConfig.apple) === null || _a === void 0 ? void 0 : _a.iconsOutPath,
        splashScreensOutPath: (_b = appHtmlConfig.apple) === null || _b === void 0 ? void 0 : _b.splashScreensOutPath,
    });
    console.timeEnd('Apple');
    console.time('Favicons');
    const faviconConfig = appHtmlConfig.favicon;
    if (!Array.isArray(faviconConfig)) {
        const faviconImageBuffer = (faviconConfig === null || faviconConfig === void 0 ? void 0 : faviconConfig.iconPath)
            ? readFileSync(getPath(faviconConfig === null || faviconConfig === void 0 ? void 0 : faviconConfig.iconPath))
            : iconBuffer;
        await generateFavicons(sharp(faviconImageBuffer));
    }
    console.timeEnd('Favicons');
    console.log('Writing app.html');
    console.time('HTML');
    writeAppHTML({
        headConfig: {
            pwaName: appHtmlConfig.appName,
            startUrl: appHtmlConfig.startUrl,
            ...appHtmlConfig.headConfig,
        },
    });
    console.timeEnd('HTML');
    console.log('Finished Writing');
    const sitemapConfig = await getSiteMapConfigFile('src/config');
}
function writeAppHTML(config) {
    const { lang = 'de', body = '', headConfig } = config;
    const html = `
<!DOCTYPE html>
<html lang="${lang}">
${writeHead(headConfig)}
${writeBody(body)}
</html>`;
    if (!existsSync(getPath('src'))) {
        mkdirSync(getPath('src'));
    }
    writeFileSync(getPath('src/app.html'), html);
}
function writeHead(options) {
    const { pwaName, shrinkToFit = true, pwa = true, startUrl = DEFAULTS.startUrl, apple, dnsPrefetches = [], externalStyleSheets = [], preConnections = [], transform = (head) => head, } = options;
    const isPWA = pwa ? 'yes' : 'no';
    const fullscreen = (apple === null || apple === void 0 ? void 0 : apple.fullscreen) || true ? 'yes' : 'no';
    const statusBarStyle = (apple === null || apple === void 0 ? void 0 : apple.statusBarStyle) || 'default';
    const polyfillsFile = readFileSync(getPath('./polyfills.js'));
    const polyfills = polyfillsFile.length !== 0
        ? `
	<script>
	${polyfillsFile}
	</script>`
        : '';
    const head = `
	<head>
		<meta charset="utf-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" ${!shrinkToFit ? 'shrink-to-fit=no ' : ''}/>
		
		<meta name="application-name" content="${pwaName}" />
		<meta name="apple-mobile-web-app-title" content="${pwaName}" />
		<meta name="mobile-web-app-capable" content=${isPWA} />
		<meta name="apple-mobile-web-app-capable" content=${isPWA} />
		<meta name="apple-touch-fullscreen" content="${fullscreen}" />
		<meta name="apple-mobile-web-app-status-bar-style" content="${statusBarStyle}" />
		${startUrl && `<meta name="msapplication-starturl" content="${startUrl}" />`}

		${preConnections
        .map((con) => {
        return `
		<link rel="preconnect" href="${con}" />
		<link rel="dns-prefetch" href="${con}" />`;
    })
        .join('\n')}
		${dnsPrefetches.map((prefetch) => `<link rel="dns-prefetch" href="${prefetch}" />`)}
		${externalStyleSheets.map((href) => `<link rel="stylesheet" href="${href}" />`)}
		${polyfills}
		%svelte.head%
	</head>`;
    return transform(head);
}
function writeBody(body = '') {
    return `
	<body>
		<div id="svelte">%svelte.body%</div>
		${body}
		${firebaseA11y()}	
	</body>`;
}
function firebaseA11y() {
    return `
		<script>
			const observer = new MutationObserver((mutations) => {
				for (let mutation of mutations) {
					if (mutation.type === 'childList') {
						const node = mutation.addedNodes[0];
						if (node?.tagName === 'IFRAME' && node?.id?.startsWith('I0')) {
							node.style.visibility = 'hidden';
							observer.disconnect();
						}
					}
				}
			});
			observer.observe(document.body, { childList: true });
		</script>`;
}
//# sourceMappingURL=index.js.map
#!/usr/bin/env node

import sharp from 'sharp';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';

import { getPath, getAppHtmlConfigFile, getSiteMapConfigFile } from './util/helper.js';
import {
	generateBrowserconfig,
	generateManifest,
	generateSitemap,
	generateAppleImages,
	generateFavicons
} from './generators/index.js';
import {
	DEFAULT_BROWSERCONFIG_PATH,
	DEFAULT_MANIFEST_PATH,
	DEFAULT_APPLE_SPLASH_PATH,
	DEFAULT_FAVICONS_PATH,
	DEFAULT_SITEMAP_PATH,
	DEFAULTS
} from './util/consts.js';
import { PWAConfig, VALID_RENDERER } from './config/config.js';

// import os from 'os';
// import WorkerPool from './src/util/worker-pool.js';
//const pool = new WorkerPool(os.cpus().length, '');

// const __filename: string = fileURLToPath(import.meta.url);
// const __dirname: string = dirname(__filename!);

main();

async function main() {
	const appHtmlConfig = await getAppHtmlConfigFile('src/config');
	// console.log('PWAConfig:', appHtmlConfig);

	if (!appHtmlConfig.render) {
		throw new Error(
			'Renderer property missing in Config. Valid renderers are: ' + VALID_RENDERER.join(',')
		);
	}

	if (!appHtmlConfig.iconPath) {
		throw new Error('missing iconPath in PWA Config');
	}

	if (appHtmlConfig.pwa) {
		createPWAProps(appHtmlConfig.pwa);
	}

	console.log('Writing app.html');

	console.time('HTML');

	writeAppHTML({
		headConfig: {
			pwaName: appHtmlConfig.appName,
			startUrl: appHtmlConfig.startUrl,
			...appHtmlConfig
		}
	});

	console.timeEnd('HTML');

	console.log('Finished Writing');

	const sitemapConfig = await getSiteMapConfigFile('src/config');
	// console.log('Sitemap:', sitemapConfig);

	// // Sitemap
	// console.log('Writing to filesystem path:', DEFAULT_SITEMAP_PATH);
	// generateSitemap(sitemapConfig);
}

async function createPWAProps(pwaConfig: PWAConfig) {
	const padding = pwaConfig.padding || DEFAULTS.padding;
	const iconBuffer = readFileSync(pwaConfig.iconPath);

	// ---------------------------------------
	// ------------ PWA Manifest -------------
	// ---------------------------------------
	const pwaManifestConfig = pwaConfig.pwaManifest;
	const pwaManifestIconBuffer = pwaManifestConfig?.iconPath
		? readFileSync(getPath(pwaManifestConfig?.iconPath))
		: iconBuffer;
	const manifestPath = pwaManifestConfig?.manifestOutPath || DEFAULT_MANIFEST_PATH;

	const manifestPromise = generateManifest({
		icon: sharp(pwaManifestIconBuffer),
		iconsOutDir: pwaManifestConfig?.iconsOutDir,
		padding: padding,
		manifestOutPath: manifestPath,
		manifest: {
			name: pwaConfig.appName,
			themeColor: pwaConfig.themeColor,
			...(pwaManifestConfig?.manifest || {})
		}
	});

	// ---------------------------------------
	// -------------- AppleImages ------------
	// ---------------------------------------
	console.time('Apple');
	const appleConfig = pwaConfig.apple;
	const appleIconBuffer = appleConfig?.iconPath
		? readFileSync(getPath(appleConfig?.iconPath))
		: iconBuffer;

	const appleImagesPromise = generateAppleImages(
		sharp(appleIconBuffer),
		padding,
		{
			themeColor: pwaConfig.themeColor,
			themeColorDark: pwaConfig.themeColorDark,
			// iconsOutPath: pwaConfig.apple?.iconsOutPath,
			splashScreensOutPath: pwaConfig.apple?.splashScreensOutPath
		},
		() => console.timeEnd('Apple')
	);

	// ---------------------------------------
	// -------------- Favicons ---------------
	// ---------------------------------------
	console.time('Favicons');

	let faviconsPromise: Promise<void>;
	const faviconConfig = pwaConfig.favicon;
	if (!Array.isArray(faviconConfig)) {
		const faviconImageBuffer = faviconConfig?.iconPath
			? readFileSync(getPath(faviconConfig?.iconPath))
			: iconBuffer;

		faviconsPromise = generateFavicons(sharp(faviconImageBuffer), undefined, () =>
			console.timeEnd('Favicons')
		);
	} else {
		faviconsPromise = Promise.resolve();
		console.timeEnd('Favicons');
	}

	// ---------------------------------------
	// ----------- BrowserConfig -------------
	// ---------------------------------------

	// // Microsoft Browserconfig
	// const browserconfig = pwaConfig.browserconfig;
	// if (browserconfig) {
	// 	console.log('Writing to filesystem path:', getPath(browserconfig.outPath || DEFAULT_BROWSERCONFIG_PATH));
	// 	generateBrowserconfig(browserconfig);
	// 	console.log('Finished Browserconfig');
	// }

	return Promise.all([manifestPromise, appleImagesPromise, faviconsPromise]);
}

interface HeadOptions {
	pwaName: string;
	startUrl?: string;
	pwa?: boolean;
	shrinkToFit?: boolean;
	apple?: ApplePWA;
	externalStyleSheets?: readonly string[];
	preConnections?: readonly string[];
	dnsPrefetches?: readonly string[];
	transform?: ((head: string) => string) | undefined;
}

function writeAppHTML(config: { lang?: string; body?: string; headConfig: HeadOptions }) {
	const { lang = 'de', body = '', headConfig } = config;

	const html = `
<!DOCTYPE html>
<html dir="auto">
${writeHead(headConfig)}
${writeBody(body)}
</html>`;

	if (!existsSync(getPath('src'))) {
		mkdirSync(getPath('src'));
	}

	writeFileSync(getPath('src/app.html'), html);
}

function writeHead(options: HeadOptions) {
	const {
		pwaName,
		shrinkToFit = true,
		pwa = true,
		startUrl = DEFAULTS.startUrl,
		apple,
		dnsPrefetches = [],
		externalStyleSheets = [],
		preConnections = [],
		transform = (head) => head
	} = options;

	const isPWA = pwa ? 'yes' : 'no';
	const fullscreen = apple?.fullscreen || true ? 'yes' : 'no';
	const statusBarStyle = apple?.statusBarStyle || 'default';

	const polyfillsFile = readFileSync(getPath('./polyfills.js'));
	const polyfills =
		polyfillsFile.length !== 0
			? `
	<script>
	${polyfillsFile}
	</script>`
			: '';

	const head = `
	<head>
		<meta charset="utf-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" ${
			!shrinkToFit ? 'shrink-to-fit=no ' : ''
		}/>
		
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

function writeBody(body: string = '') {
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

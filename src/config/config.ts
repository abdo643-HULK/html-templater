/// <reference types="svelte2tsx/svelte-jsx" />
/// <reference types="react" />

type Favicons = [Favicon<'shortcut'>, ...Favicon<'icon'>[]];

type ColorScheme =
	| 'normal'
	| 'light'
	| 'dark'
	| 'light only'
	| 'dark only'
	| 'light dark'
	| 'dark light';

export interface MetaDataProperty {
	// vmid?: string;
	// once?: boolean;
	// skip?: boolean;
	body?: boolean;
	pbody?: boolean;
	[key: string]: any;
}

interface Script {
	async: boolean;
	crossOrigin: string | null;
	/** Sets or retrieves the status of the script. */
	defer: boolean;
	integrity: string;
	noModule: boolean;
	referrerPolicy: string;
	/** Retrieves the URL to an external file that contains the source code or data. */
	src: string;
	/** Retrieves or sets the text of the object as a string. */
	text: string;
	/** Sets or retrieves the MIME type for the associated scripting engine. */
	type: string;
	/** You can filter tags to be included in the <body> instead of the <head> to e.g.
	 * force delayed execution of a script.
	 */
}

interface Link extends LinkStyle {
	as: string;
	crossOrigin: string | null;
	disabled: boolean;
	/** Sets or retrieves a destination URL or an anchor point. */
	href: string;
	/** Sets or retrieves the language code of the object. */
	hreflang: string;
	imageSizes: string;
	imageSrcset: string;
	integrity: string;
	/** Sets or retrieves the media type. */
	media: string;
	referrerPolicy: string;
	/** Sets or retrieves the relationship between the object and the destination of the link. */
	rel: string;
	readonly relList: DOMTokenList;
	/**
	 * Sets or retrieves the relationship between the object and the destination of the link.
	 * @deprecated
	 */
	rev: string;
	readonly sizes: DOMTokenList;
	/**
	 * Sets or retrieves the window or frame at which to target content.
	 * @deprecated
	 */
	target: string;
	/** Sets or retrieves the MIME type of the object. */
	type: string;
}

type CommonMeta = {
	/**
	 * enable/disable `shrink-to-fit` in the viewport metatag
	 *
	 * @defaultValue `false`
	 */
	shrinkToFit?: boolean;
	preConnections?: readonly string[];
	dnsPrefetches?: readonly string[];
	transformHead?: (tag: string, innerHtml: string) => { tag: string; innerHtml: string };
	transformBody?: (tag: string, innerHtml: string) => { tag: string; innerHtml: string };
};

type VanillaHTMLAttr<T extends EventTarget> = Omit<svelte.JSX.HTMLAttributes<T>, 'dataset'> &
	Record<string, any>;

export const VALID_RENDERER = ['vanilla', 'svelte', 'sveltekit', 'react', 'next'];

type JSXRenderer = 'next';
type VanillaRenderer = 'vanilla' | 'svelte' | 'sveltekit' | 'react';

interface NextConfig {
	render: JSXRenderer;
	metaInfo?: {
		htmlAttrs?: React.HTMLAttributes<HTMLHtmlElement> & Record<string, any>;
		headAttrs?: React.HTMLAttributes<HTMLHeadElement> & Record<string, any>;
		bodyAttrs?: React.HTMLAttributes<HTMLBodyElement> & Record<string, any>;
	} & CommonMeta;
}

interface VanillaConfig {
	render: VanillaRenderer;
	metaInfo?: {
		htmlAttrs?: VanillaHTMLAttr<HTMLHtmlElement>;
		headAttrs?: VanillaHTMLAttr<HTMLHeadElement>;
		bodyAttrs?: VanillaHTMLAttr<HTMLBodyElement>;
		// links?: readonly Partial<Link>[];
		// scripts?: readonly Partial<Script>[];
		links?: readonly VanillaHTMLAttr<HTMLLinkElement>[];
		scripts?: readonly VanillaHTMLAttr<HTMLScriptElement>[];
		styles?: readonly Partial<StyleSheet>[] & { innerHTML?: string };
	} & CommonMeta;
}

export type Config = (VanillaConfig | NextConfig) & {
	pwa?: PWAConfig;
};

export interface PWAConfig {
	appName: string;
	/**
	 * The Icon that will be used for all generated images
	 * for the best resolution it should be at least 512x512.
	 *
	 * This will be used to generate all Images.
	 * You can define a path to an icon for each generator if
	 * you want to use another image instead.
	 */
	iconPath: FilePath;
	/**
	 * a number between 0.0 and 1.0
	 *
	 * This property is following the spec
	 * ({@link " https://www.w3.org/TR/appmanifest/#icon-masks "})
	 * so it your icon doesn't get cut off
	 *
	 * If your Image already has padding turn this off
	 * by setting it to 0.
	 * Else the Image will get resized with the Math:
	 *
	 * newSize = Math.ceil(neededSize * (1 - padding));
	 *
	 * calculatedPadding = Math.floor(neededSize * 0.2);
	 *
	 * @defaultValue `0.2`
	 */
	padding?: number;
	/**
	 * @defaultValue `"/"`
	 */
	startUrl?: string;
	/**
	 * @defaultValue `"#fff"`
	 */
	themeColor?: Color;
	/**
	 * @defaultValue `"#fff"`
	 */
	backgroundColor?: Color;
	/**
	 * this value will bee added for the dark `theme_color` meta tag and
	 * for the apple splash images
	 * @defaultValue `undefined`
	 */
	themeColorDark?: Color;
	/**
	 * @defaultValue `undefined`
	 */
	backgroundColorDark?: Color;
	/**
	 * @defaultValue
	 * `"normal"` and if darkThemeColor is set, `"dark light"` is the default
	 */
	colorScheme?: ColorScheme;
	pwaManifest?: {
		iconPath?: FilePath;
		iconsOutDir?: DirPath;
		manifestOutPath?: FilePath;
		manifest?: Partial<ManifestOptions>;
	};
	/**
	 * @see {@link ApplePWAConfig} for the default values
	 */
	apple?: ApplePWAConfig;
	/**
	 * if a favicons array is defined
	 * no favicons are generated and only the
	 * tags are added to the html file
	 */
	favicon?:
		| {
				iconPath?: FilePath;
				outDir?: DirPath;
		  }
		| Favicons;
	/**
	 * generating a IE/MSEdge File is optional
	 * if no browserconfig property is provided
	 * no file is generated
	 */
	browserconfig?: {
		config: Browserconfig;
		outPath?: string;
	};
}

export interface ApplePWAConfig {
	iconPath?: FilePath;
	/**
	 * @defaultValue `DEFAULT_APPLE_ICON_PATH`
	 *
	 * @see {@link DEFAULT_APPLE_ICON_PATH}
	 */
	iconsOutPath?: DirPath;
	/**
	 * @defaultValue `DEFAULT_APPLE_SPLASH_PATH`
	 *
	 * @see {@link DEFAULT_APPLE_SPLASH_PATH}
	 */
	splashScreensOutPath?: DirPath;
	// /**
	//  * @defaultValue `undefined`
	//  */
	// darkModeBgColor?: Color;
	/**
	 * @defaultValue `'yes'`
	 */
	fullscreen?: 'yes' | 'no';
	/**
	 * default: white background with black text and icons
	 * black: The default black bar with black text and icons (not recommended)
	 * black-translucent: white text and icons with a transparent background.
	 *
	 *  @defaultValue `'default'`
	 */
	statusBarStyle?: 'default' | 'black' | 'black-translucent';
}

/******************
 * ****************
 * Test configs
 * ****************
 *****************/

const screenshots: Screenshot[] = [
	{
		src: 'screenshot1.webp',
		sizes: '1280x720',
		type: 'image/webp',
		label: ''
	},
	{
		src: 'screenshot2.webp',
		sizes: '1280x720',
		type: 'image/webp',
		label: ''
	}
];

const manifest = {
	direction: 'ltr',
	lang: 'de',
	siteName: 'La Mediterranee Lieferapp',
	siteShortName: 'La Mediterranee',
	scope: '/',
	start_url: '/?utm_source=homescreen',
	display: 'standalone',
	orientation: 'any',
	themeColor: 'aliceblue',
	backgroundColor: '#FFFFFF',
	categories: ['food', 'shopping', 'fast food'],
	shortcuts: [
		{
			name: 'Bestellungen Anschauen',
			url: '',
			icons: [
				{
					src: '/icons/see-orders.png',
					sizes: '192x192'
				}
			]
		}
	],
	icons: [
		{
			src: 'icon/lowres.webp',
			sizes: '48x48',
			type: 'image/webp'
		},
		{
			src: 'icon/lowres',
			sizes: '48x48'
		},
		{
			src: 'icon/hd_hi.ico',
			sizes: '72x72 96x96 128x128 256x256'
		},
		{
			src: 'icon/hd_hi.svg',
			sizes: '72x72'
		}
	],
	screenshots: screenshots
};

const shortcutFavicon: Favicon<'shortcut'> = {
	href: '',
	sizes: '192x192',
	type: 'image/png',
	rel: 'shortcut icon'
} as const;

const alternativeFavicons: Readonly<Favicon<'icon'>[]> = [
	{
		href: '',
		sizes: '16x16',
		type: 'image/png',
		rel: 'icon'
	},
	{
		href: '',
		sizes: '32x32',
		type: 'image/png',
		rel: 'icon'
	},
	{
		href: '',
		sizes: '96x96',
		type: 'image/png',
		rel: 'icon'
	}
] as const;

const favicons: Readonly<Favicons> = [shortcutFavicon, ...alternativeFavicons] as const;

export default {
	appName: '',
	themeColor: '',
	backgroundColor: '',
	addImagePadding: false,
	appShortName: '',
	iconPath: '',
	favicon: {
		srcImage: ''
	},
	headConfig: {
		externalStyleSheets: [
			'https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;500;600;800&display=swap'
		],
		preConnections: [
			'https://fonts.gstatic.com',
			'https://fonts.googleapis.com',
			'https://www.googletagmanager.com'
		]
	}
} as const as PWAConfig;

// const externalStyleSheets: string[] = [];
// const preConnections: string[];
// const dnsPrefetches: string[] = [];

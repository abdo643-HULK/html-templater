const screenshots = [
    {
        src: 'screenshot1.webp',
        sizes: '1280x720',
        type: 'image/webp',
        label: '',
    },
    {
        src: 'screenshot2.webp',
        sizes: '1280x720',
        type: 'image/webp',
        label: '',
    },
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
                    sizes: '192x192',
                },
            ],
        },
    ],
    icons: [
        {
            src: 'icon/lowres.webp',
            sizes: '48x48',
            type: 'image/webp',
        },
        {
            src: 'icon/lowres',
            sizes: '48x48',
        },
        {
            src: 'icon/hd_hi.ico',
            sizes: '72x72 96x96 128x128 256x256',
        },
        {
            src: 'icon/hd_hi.svg',
            sizes: '72x72',
        },
    ],
    screenshots: screenshots,
};
const shortcutFavicon = {
    href: '',
    sizes: '192x192',
    type: 'image/png',
    rel: 'shortcut icon',
};
const alternativeFavicons = [
    {
        href: '',
        sizes: '16x16',
        type: 'image/png',
        rel: 'icon',
    },
    {
        href: '',
        sizes: '32x32',
        type: 'image/png',
        rel: 'icon',
    },
    {
        href: '',
        sizes: '96x96',
        type: 'image/png',
        rel: 'icon',
    },
];
const favicons = [shortcutFavicon, ...alternativeFavicons];
export default {
    appName: '',
    themeColor: '',
    backgroundColor: '',
    addImagePadding: false,
    appShortName: '',
    iconPath: '',
    favicon: {
        srcImage: '',
    },
    headConfig: {
        externalStyleSheets: ['https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;500;600;800&display=swap'],
        preConnections: [
            'https://fonts.gstatic.com',
            'https://fonts.googleapis.com',
            'https://www.googletagmanager.com',
        ],
    },
};
//# sourceMappingURL=config.js.map
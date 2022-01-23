import type { Config, PWAConfig } from './config';

const config = {
	appName: 'Test',
	iconPath: './V4.png',
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
} as PWAConfig;

const conf: Config = {
	render: 'vanilla',
	metaInfo: {
		styles: [{}],
		links: [{}],
		scripts: [{}],
		dnsPrefetches: ['google.at'],
		bodyAttrs: {
			'data-head': 'haha'
		}
	}
};

// module.exports = config;
export default config;

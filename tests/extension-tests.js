import { chrome } from 'jest-chrome';

describe('chrome api functions', () => {
	const manifest = {
		name: 'Examin',
		description:
			'A Chrome extension developer tool that generators Jest/Enzyme render unit tests for React applications',
		version: '1.0.0.1',
		author: 'Ty Doan, Kirsten Yoon, Nicholas Brush, Cliff Assuncao',
		manifest_version: 2,
		background: {
			scripts: ['bundles/background.bundle.js'],
			persistent: false,
		},
		content_scripts: [
			{
				matches: ['http://localhost/*', 'https://localhost/*'],
				js: ['bundles/content.bundle.js'],
			},
		],
		icons: {
			16: 'assets/16.png',
			38: 'assets/38.png',
			48: 'assets/48.png',
			128: 'assets/128.png',
			148: 'assets/148.png',
			192: 'assets/192.png',
		},
		web_accessible_resources: ['bundles/backend.bundle.js'],
		permissions: ['http://localhost/*', 'https://localhost/*'],
		externally_connectable: {
			matches: ['http://localhost/*', 'https://localhost/*'],
		},
		devtools_page: './devtools.html',
		content_security_policy:
			"script-src 'self' 'unsafe-eval'; object-src 'self'",
	};

	chrome.runtime.getManifest.mockImplementation(() => manifest);

	it('correct manifest', () => {
		expect(chrome.runtime.getManifest()).toEqual(manifest);
		expect(chrome.runtime.getManifest).toBeCalled();
	});
});

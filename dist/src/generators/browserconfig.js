import { writeFileSync } from 'fs';
import { DEFAULT_BROWSERCONFIG_PATH } from '../util/consts.js';
import { getPath } from '../util/helper.js';
function render(images, tileColor) {
    return `<?xml version="1.0" encoding="utf-8"?>
			<browserconfig>
			<msapplication>
				<tile>
				<TileColor>${tileColor}</TileColor>
					${images.map((logo) => {
        return `<${logo.form || 'square' + logo.width + 'x' + logo.height + 'logo'} src=${logo.src} />`;
    })}	
				</tile>
			</msapplication>
			</browserconfig>`;
}
export function generateBrowserconfig(browserConfig) {
    const { outPath = DEFAULT_BROWSERCONFIG_PATH, config } = browserConfig;
    writeFileSync(getPath(outPath), render(config.logos, config.tileColor));
}
//# sourceMappingURL=browserconfig.js.map
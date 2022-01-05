import path, { resolve } from 'path';
import { existsSync, readdirSync, readFileSync } from 'fs';
const inScripts = process.cwd();
export function getPath(...pathSegment) {
    return path.resolve(inScripts, ...pathSegment);
}
export async function loadFile(path) {
    try {
        const file = await import(path);
        return file.default ? file.default : file;
    }
    catch (e) {
        console.log('require used');
        return require(path);
    }
}
export async function getAppHtmlConfigFile(otherPath = '') {
    const configDir = getPath(otherPath);
    if (existsSync(configDir)) {
        const match = readdirSync(configDir).find((path) => new RegExp('pwa.config.(cjs|mjs|js|ts)').test(path));
        if (match) {
            const path = getPath(otherPath, match);
            return loadFile(path);
        }
        throw new Error(`pwa.config.(cjs|mjs|js) doesn't exist.`);
    }
    throw new Error("Config directory doesn't exist");
}
export async function getSiteMapConfigFile(otherPath = '') {
    const configDir = getPath(otherPath);
    if (existsSync(configDir)) {
        const match = readdirSync(configDir).find((path) => new RegExp('kit-sitemap.(cjs|mjs|js)').test(path));
        if (match) {
            const path = getPath(otherPath, match);
            return loadFile(path);
        }
        throw new Error(`kit-sitemap.(cjs|mjs|js) doesn't exist.`);
    }
    throw new Error("Config directory doesn't exist");
}
function req(filename) {
    let code = readFileSync(resolve(__dirname, filename)).toString();
    let module = { exports: {} };
    let wrapper = Function('req, exports, module', code);
    wrapper(req, module.exports, module);
    return module.exports;
}
export const stylesheets = (() => {
    let stylesheets = [];
    return {
        links: stylesheets,
        push: (stylesheet) => {
            stylesheets.push(stylesheet);
        },
    };
})();
//# sourceMappingURL=helper.js.map
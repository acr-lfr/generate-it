"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const NodegenRc_1 = tslib_1.__importDefault(require("./NodegenRc"));
const _ = tslib_1.__importStar(require("lodash"));
/**
 * Creates an extended config object
 * @param {object} config
 * @param {object} swagger
 * @param templates
 * @return {Promise<{mockServer}|*>}
 */
class ConfigMerger {
    async base(config, templatesDir) {
        const nodegenRc = await NodegenRc_1.default.fetch(templatesDir, config.targetDir);
        return Object.assign(config, {
            templates: templatesDir,
            nodegenRc,
            interfaceStyle: nodegenRc.interfaceStyle || 'interface',
        });
    }
    injectSwagger(config, swagger) {
        return Object.assign(config, {
            swagger,
            package: {
                name: _.kebabCase(swagger.info.title),
            },
        });
    }
}
exports.default = new ConfigMerger();
//# sourceMappingURL=ConfigMerger.js.map
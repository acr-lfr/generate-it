import Config from '@/interfaces/Config';
import ConfigExtendedBase from '@/interfaces/ConfigExtendedBase';
import NodegenRc from '@/lib/NodegenRc';
import * as _ from 'lodash';

/**
 * Creates an extended config object
 * @param {object} config
 * @param {object} swagger
 * @param templates
 * @return {Promise<{mockServer}|*>}
 */
class ConfigMerger {
  public async base (config: Config, templatesDir: string): Promise<ConfigExtendedBase> {
    const nodegenRc = await NodegenRc.fetch(templatesDir);
    return Object.assign(config, {
      templates: templatesDir,
      nodegenRc,
      interfaceStyle: nodegenRc.interfaceStyle || 'interface',
    });
  }
  public injectSwagger (config: ConfigExtendedBase, swagger: any): ConfigExtendedBase {
    return Object.assign(config, {
      swagger,
      package: {
        name: _.kebabCase(swagger.info.title),
      },
    });
  }
}

export default new ConfigMerger();

import 'colors';
import fs from 'fs-extra';
import path from 'path';

export default (targetDir: string, templatesDir: string) => {
  const packagJsonStr = 'package.json';
  const existing = JSON.parse(
    fs.readFileSync(
      path.join(targetDir, packagJsonStr),
      {encoding: 'utf8'},
    ),
  );
  const newJson = JSON.parse(
    fs.readFileSync(
      path.join(templatesDir, packagJsonStr + '.njk'),
      'utf8',
    ),
  );

  const scriptsChanged: any = {};
  const dependenciesChanged: any = {};
  const devDependenciesChanged: any = {};
  const buildDiff = function (changed: string, from: string): any {
    this['Changed To'] = changed;
    this.from = from || 'Not present on existing package.json, please add.';
  };

  if (newJson.scripts) {
    Object.keys(newJson.scripts).forEach((key: string) => {
      if (!existing.scripts[key] || existing.scripts[key] !== newJson.scripts[key]) {
        // @ts-ignore
        scriptsChanged[key] = new buildDiff(newJson.scripts[key], existing.scripts[key]);
      }
    });
  }

  if (newJson.dependencies) {
    Object.keys(newJson.dependencies).forEach((key) => {
      if (!existing.dependencies[key] || existing.dependencies[key] !== newJson.dependencies[key]) {
        // @ts-ignore
        dependenciesChanged[key] = new buildDiff(newJson.dependencies[key], existing.dependencies[key]);
      }
    });
  }

  if (newJson.devDependencies) {
    Object.keys(newJson.devDependencies).forEach((key) => {
      if (!existing.devDependencies[key] || existing.devDependencies[key] !== newJson.devDependencies[key]) {
        // @ts-ignore
        devDependenciesChanged[key] = new buildDiff(newJson.devDependencies[key], existing.devDependencies[key]);
      }
    });
  }

  if (Object.keys(scriptsChanged).length > 1) {
    console.log('Please check your package json scripts are up to date, the tpl and local scripts differ:'.green);
    console.table(scriptsChanged);
  }
  if (Object.keys(dependenciesChanged).length > 1) {
    console.log('Please check your package json PROD dependencies are up to date, the tpl and local scripts differ:'.green);
    console.table(dependenciesChanged);
  }
  if (Object.keys(devDependenciesChanged).length > 1) {
    console.log('Please check your package json DEV dependencies are up to date, the tpl and local scripts differ:'.green);
    console.table(devDependenciesChanged);
  }
};

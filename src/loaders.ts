/* eslint-disable @typescript-eslint/no-require-imports */

import parseJsonType from 'parse-json';
import yamlType from 'yaml';
import importFreshType from 'import-fresh';
import getPackageTypeType from 'get-package-type';
import semverType from 'semver';
import { Loader, LoaderAsync, LoaderSync } from './index';
import { LoadersSync } from './types';

let importFresh: typeof importFreshType;
const loadCjs: LoaderSync = function loadCjs(filepath) {
  if (importFresh === undefined) {
    importFresh = require('import-fresh');
  }

  const result = importFresh(filepath);
  return result;
};

let getPackageType: typeof getPackageTypeType;
let semver: typeof semverType;
let loadMjs: LoaderAsync;
const loadJs: Loader = function loadJs(filepath, content) {
  if (getPackageType === undefined) {
    getPackageType = require('get-package-type');
  }

  if (getPackageType.sync(filepath) === 'module') {
    if (semver === undefined) {
      semver = require('semver');
    }

    // Initial: https://github.com/nodejs/node/releases/tag/v13.2.0
    // Backport: https://github.com/nodejs/node/releases/tag/v12.17.0
    if (semver.satisfies(process.version, '>=13.2.0 || ^12.17.0')) {
      if (loadMjs === undefined) {
        loadMjs = require(`./loadMjs`);
      }

      return loadMjs(filepath, content);
    }
  }

  return loadCjs(filepath, content);
};

let parseJson: typeof parseJsonType;
const loadJson: LoaderSync = function loadJson(filepath, content) {
  if (parseJson === undefined) {
    parseJson = require('parse-json');
  }

  try {
    const result = parseJson(content);
    return result;
  } catch (error) {
    error.message = `JSON Error in ${filepath}:\n${error.message}`;
    throw error;
  }
};

let yaml: typeof yamlType;
const loadYaml: LoaderSync = function loadYaml(filepath, content) {
  if (yaml === undefined) {
    yaml = require('yaml');
  }

  try {
    const result = yaml.parse(content, { prettyErrors: true });
    return result;
  } catch (error) {
    error.message = `YAML Error in ${filepath}:\n${error.message}`;
    throw error;
  }
};

const loaders: LoadersSync = { loadCjs, loadJs, loadJson, loadYaml };

export { loaders };

import { LoaderAsync } from './index';

// To use native ES module imports in Node.js, we can't allow Babel to run
// module transformations over this file, as it would transpile the `import()`
// call.
const loadMjs: LoaderAsync = async function loadMjs(filepath) {
  return await import(filepath);
};

module.exports = loadMjs;

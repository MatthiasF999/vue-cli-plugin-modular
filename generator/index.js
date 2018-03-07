const fs = require('fs');

module.exports = (api, options) => {
  // get paths for router and store
  const routerPath = api.resolve('./src/router.js');
  const storePath = api.resolve('./src/store.js');

  // add module registry
  api.render('./templates/default', { ...options });

  // update router and store
  api.onCreateComplete(() => {
    // if router is installed
    if (fs.existsSync(routerPath)) {
      let content = fs.readFileSync(routerPath, { encoding: 'utf8' });

      const lines = content.split(/\r?\n/g).reverse();

      // add ´template last import
      const lastImportIndex = lines.findIndex(line => line.match(/^import/));
      lines.splice(lastImportIndex, 0, `import modules from './app/';

const routes = [];
const beforeEach = [];

modules.forEach((element) => {
  if (element.router) {
    if (element.router.routes) {
      routes.push(...element.router.routes);
    }
    if (element.router.beforeEach) {
      beforeEach.push(...element.router.beforeEach);
    }
  }
});`);

      // add routes to router
      const routesIndex = lines.findIndex(line => line.match(/routes: \[/));
      lines.splice(routesIndex, 0, '    ...routes,');

      content = lines.reverse().join('\n');

      // set router as variable
      content = content.replace('export default new Router', 'const router = new Router');

      // add to end of file
      content += `
router.beforeEach((from, to, next) => {
  function operate(i) {
    if (beforeEach.length <= i) {
      next();
    } else {
      beforeEach[i](from, to, (nextArg) => {
        if (nextArg) {
          next(nextArg);
        } else {
          operate(i + 1);
        }
      });
    }
  }

  operate(0);
});

export default router;
`;
      fs.writeFileSync(routerPath, content, { encoding: 'utf8' });
    }

    // if vuex is installed
    if (fs.existsSync(storePath)) {
      let content = fs.readFileSync(storePath, { encoding: 'utf8' });

      const lines = content.split(/\r?\n/g).reverse();

      // add template below
      const lastImportIndex = lines.findIndex(line => line.match(/^import/));
      lines.splice(lastImportIndex, 0, `import appModules from './app/';

const plugins = [];
const modules = {};

appModules.forEach((element) => {
  if (element.store) {
    if (element.store.modules) {
      Object.assign(modules, element.store.modules);
    }
    if (element.store.plugins) {
      plugins.push(...element.router.beforeEach);
    }
  }
});`);

      const storeIndex = lines.findIndex(line => line.match(/export default new Vuex\.Store/));
      lines.splice(storeIndex, 0, '  modules,\n  plugins,');

      content = lines.reverse().join('\n');
      fs.writeFileSync(storePath, content, { encoding: 'utf8' });
    }
  });
};

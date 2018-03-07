# vue-cli-plugin-modular
This is a vue-cli@3.0 plugin, allowing to create separate modules.

## Quickstart
```
npm i -D vue-cli-plugin-modular
# or
yarn add vue-cli-plugin-modular -D
```

Invoke the plugin
```
vue invoke modular
```
## Creating modules
Modules belong in the app folder and export a single json.

```Javascript
export default {
	router: {
		routes: [],    // routes to add to the router
		beforeEach: [] // guards for all routes in router
	},
	store: {
		modules: {},   // modules to add to vuex store
		plugins: []    // plugins to add to vuex store
	}
}
```
Modules only need to be added to _src/app/index.js_.
The data is loaded by the router and the vuex store.
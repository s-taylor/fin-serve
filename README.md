# FIN-SERVE

[![Maintenance status](https://raw.githubusercontent.com/one19/project-status/master/cache/fin-serve/maintained.svg?sanitize=true)](https://github.com/one19/project-status) [![published on npm!](https://raw.githubusercontent.com/one19/project-status/master/cache/fin-serve/npm.svg?sanitize=true)](https://www.npmjs.com/package/fin-serve)
---

### Purpose:

Fin-Serve is a very simple http server. Written in node with few deps, it aims to simply serve up compiled frontend assets without regards to routing.
It will look in /dist for compiled assets. You should compile them before trying to run this.

### Setup:

`npm install` will install the two deps (serve-static and finalhandler), as well as the dev deps used for testing.

### Use:

`npm install fin-serve` to add the package to your project. After compiling assets, `NODE_ENV=production npm start` after configuring your webpack to listen to this middleware will launch a server looking at the static assets in ./dist/.
> TODO: explain how to add it to the babel config.

### Extra:
You may pass `fin-serve` additional env vars that will show up in the header to be parsed by the application later. All you need to do is append `META_TAG_` to the front of whatever env var you'd like to appear as a parsable header, using a query to grab it like: `document.queryselector('meta[name="YOUR_ENV_VAR"]')`.

### Testing:

Run `npm test` after install dev dependencies.

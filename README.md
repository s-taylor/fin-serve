# FIN-SERVE

---

### Purpose:

Fin-Serve is a very simple http server. Written in node with few deps, it aims to simply serve up compiled frontend assets without regards to routing.
It will look in /dist for compiled assets. You should compile them before trying to run this.

### Setup:

`npm install` will install the two deps (serve-static and finalhandler), as well as the dev deps used for testing.

### Use:

`npm install fin-serve` to add the package to your project. After compiling assets, `NODE_ENV=production npm start` after configuring your webpack to listen to this middleware will launch a server looking at the static assets in ./dist/.
> TODO: explain how to add it to the babel config.

### Testing:

Run `npm test` after install dev dependencies.

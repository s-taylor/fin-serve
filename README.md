# FIN-SERVE

---

### Purpose:

Fin-Serve is a very simple http server. Written in node with zero dependencies, it aims to simply serve up compiled frontend assets without regards to routing.

### Setup:

Since this only has dev-dependencies, there is no setup required besides node. `npm install` will install dev dependencies for development and testing purposes.

### Use:

`npm install fin-serve` to add the package to your project. After compiling assets, `NODE_ENV=production npm start` after configuring your webpack to listen to this middleware will launch a server looking at the static assets in ./dist/.
> TODO: explain how to add it to the babel config.

### Testing:

Run `npm test` after install dev dependencies.

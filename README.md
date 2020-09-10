# Universal Vue Template
This is a template for learning universal/isomorphic rendering
methods with VueJS and/or quick-starting your production app.

It is not meant to replace or compete with neither NuxtJS nor VueCLI,
since it does not provide scaffolding and does not add much abstraction.

The avoidance of abstracting configuration is, what this template focuses on.
This allows you, even if you do not start a project with the template,
to learn about how universal rendering, hot-reloading and progressiveness
can be achieved in a VueJS project, without spending hours on reading
documentation.

## Table of contents
* [Features](#features)
* [Development](#development)
  * [Quick Start](#quick-start)
  * [Kubernetes](#kubernetes)
* [Building for Production](#building-for-production)
* [License](#license)
* [Contributing](#contributing)

## Features
- Universal rendering (server-side rendering)
- TypeScript
- webpack
- Hot-reloading
- Vuex ready
- Unit-testing environment (via Jest)
- Linting
- Kubernetes ready (using Skaffold)

## Development
There are two methods to start the project and get developing.
The first one is the fastest one and uses a local express server,
whereas the second one uses skaffold to run the project on a 
kubernetes development-cluster (such as minikube). You can switch
back and forth between those methods without losing any of your 
results.

### Quick Start
In order to quick-start development, clone the project and run the
following commands inside the project root.

```bash
$ npm ci
$ npm start
```

This starts a development server on `http://localhost:8080`.

The easiest point to start development, is the `src/shared/components/App.vue`.

### Kubernetes
For this setup, you will need to have the tool Skaffold installed.

To keep this guide concise, we assume that you already have it installed,
as well as created a kubernetes cluster for development.
If you do not, check out this documentation to get up and running:
[https://skaffold.dev/docs/quickstart/](https://skaffold.dev/docs/quickstart/).

If everything is set up, execute the following command from the project
root:

```bash
$ skaffold dev
```

This builds a docker container from the project and syncs the `src/` folder
into the cluster to allow hot-reloading without rebuilding the container
on every change.

## Building for Production
In order to execute a production build, run the following command:
```bash
$ npm run build
```

This bundles all the scripts and style and makes them available
inside the public directory. You can then run the production
version by executing this command:
```bash
$ node public/app
```

However, keep in mind that running a node service in a production
environment this way is not a great option, since it does not
handle restarting of the app in case of errors. You might want
to use a process-manager like [pm2](https://pm2.keymetrics.io) for this.

## Contributing
If there are any ideas or optimizations to improve this template, 
feel free to submit a pull request including your documented changes.

## License
MIT

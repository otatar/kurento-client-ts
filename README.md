# kurento-client-ts

A simple Kurento client library written in Typescript. This library is intended to work in browser and Node.js. Only a fraction of API offered by Kurento is currently supported:

- Elements: MediaPipeline, WebRtcEndpoint, PlayerEdnpoint, RecorderEndpoint
- Hubs: Composite, Dispatcher, DispatcherOneToMany

More to come in the future :D.

- Browser and Node.js
- First-class TypeScript support
  - Written in TypeScript

## Install

`npm install --save kurento-client-ts`

## Basic usage

### Typescript (Browser/Node.js)

```typescript
import KurentoClient, { MediaPipeline } from "kurento-client-ts";

...

let pipeline: MediaPipeline | null;

//Init kurento client
kurentoClient = new KurentoClient(kmsUri);

//Lets ping kms server
await kurentoClient.ping();

//Create media pipeline
pipeline = await kurentoClient.createMediaPipeline();
```

### Javascript (Browser/Node.js)

```javascript
import KurentoClient from "kurento-client-ts";

...

//Init kurento client
kurentoClient = new KurentoClient(kmsUri);

//Lets ping kms server
await kurentoClient.ping();

//Create media pipeline
pipeline = await kurentoClient.createMediaPipeline();
```

### Javascript CommonJS (Node.js)

```javascript
const KurentoClient = require("kurento-client-ts").default

async function main()  {
const client = new KurentoClient("kmsUri")
await client.ping()
const pipeline = await client.createMediaPipeline()
```

## Examples

You can find examples of usage for browser and Node.js in examples folder. For browser, copy files in browser folder in new location, use some kind of bundler (tested with esbuild and rollup) to bundle js and serve loopback.html (using some sort of simple web server e.g http-server, vscode live-server). The idea for this loopback example was taken from official Kurento docs site.

## Logging

This library logs to standard output. Available log levels: 1: trace, 2: debug, 3: info, 4: warn, 5: error. KurentoClient object by default uses log level 4: warn to only print warning and error messages to console. If you want to change log level, then simply construct KurentoClient object by passing diferent logLevel argument as:

`const client = new KurentoClient(kmsUri, 1)`

## Build

Checkout this repository locally, then:

`npm install`

`npm run build`

## Testing

TO-DO

## Docmentation

TO-DO

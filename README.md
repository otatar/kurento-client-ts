# kurento-client-ts

A simple Kurento client library written in Typescript. This library is intended to work in browser and Node.js.

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
const client = new KurentoClient("ws://192.168.6.170:8888/kurento")
await client.ping()
const pipeline = await client.createMediaPipeline()
```

## Examples

## Build

Checkout this repository locally, then:

`npm install`

`npm run build`

## Docmentation

TO-DO

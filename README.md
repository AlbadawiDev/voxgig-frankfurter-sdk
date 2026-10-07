# Voxgig Frankfurter SDK mini task

Unofficial TypeScript SDK generated with Voxgig for Frankfurter v2. This source repository belongs to Daniel Samir Al Badawi Aazar. Preparation, It is not an official Frankfurter or Voxgig package and is not published to npm.

## Build and verify

Node 24.19.0 was used. From this repository:

```bash
cd ts
npm ci
npm run build
npm test
cd ..
node scripts/smoke-live.cjs
```

If the environment requires an HTTP proxy, Node 24 supports `node --use-env-proxy scripts/smoke-live.cjs`. No API key or account is required. Compiled files are intentionally omitted from this source repository: build before following the installation instructions in the generated TypeScript README.

## Quickstart

After building, require `./ts/dist/FrankfurterSDK.js` in Node. The package name below is generated metadata for eventual publication, not a claim that it is available on npm.

```ts
import { FrankfurterSDK } from '@albadawidev/voxgig-frankfurter-sdk'

const client = new FrankfurterSDK()
const rate = await client.Rate().load({ base: 'EUR', quote: 'USD' })
console.log(rate.data())
```

Currency details use the SDK's normalized identifier: `client.Currency().load({ id: 'EUR' })`.

## Reproduce generation

```bash
node scripts/regenerate.cjs
```

The script scaffolds an isolated `generated/` project with pinned Voxgig tools, applies the documented dependency compatibility correction and project metadata, generates TypeScript with the test feature, then builds and runs its generated tests. It does not publish packages or repositories.

The committed SDK source and tests are generator output. `openapi.json` is the unchanged official Frankfurter OpenAPI document downloaded on 7 October 2026. The corpus under `.sdk/test/` is retained because the generated tests read it. The repository excludes generator build output, caches, dependencies and environment logs.

## Results and limits

The verified generated suite passed 237 tests, skipped 12 and failed 0. Four live checks passed: EUR/USD pair, EUR/EUR identity, EUR currency details and invalid-currency rejection with HTTP 422. [Live evidence](evidence/live-validation.json) records request URLs and statuses. This is a small exercise, not exhaustive API coverage or production certification.

## Sources and license

- [Voxgig generator](https://voxgig.com/sdk) and [agent guide](https://voxgig.com/sdk/agents)
- [Frankfurter documentation](https://frankfurter.dev/)
- [Official OpenAPI](https://api.frankfurter.dev/v2/openapi.json)

MIT. Voxgig notices are preserved in [LICENSE](LICENSE) and [third-party/VOXGIG-LICENSE](third-party/VOXGIG-LICENSE). The upstream Frankfurter notice is in [third-party/FRANKFURTER-LICENSE](third-party/FRANKFURTER-LICENSE).

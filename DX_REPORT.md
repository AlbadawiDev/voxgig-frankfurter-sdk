# Mini task 1: developer experience report

Daniel Samir Al Badawi Aazar · 7 October 2026

First Voxgig mini task: generate and verify a Frankfurter SDK using the Voxgig toolchain. Preparation used AI assistance, as permitted by the exercise, within a 30-minute preparation window.

## Choice and method

Frankfurter v2 is a public, free API with no API key requirement and an official MIT OpenAPI specification. A read-only catalogue check enumerated 804 public repositories from the voxgig-sdk GitHub organization across nine REST API pages (100 each on eight pages, four on the last). No Frankfurter-named SDK was found. Currency-related possible aliases were checked and described other providers. This check concerns the public catalogue at that time, not private repositories.

The API spec was downloaded unchanged from https://api.frankfurter.dev/v2/openapi.json. The actual Voxgig generator, not a hand-written SDK, produced TypeScript for four semantic entities: Coverage, Currency, Provider and Rate. The spec contains nine GET paths. No paid trial, API account or secret was used.

AI-assisted tooling handled API research, generator execution, dependency troubleshooting, project configuration, smoke-test scripting and report preparation. Verification used the generated TypeScript types, automated tests, `doctor` and live API requests. The SDK runtime and tests were produced by the Voxgig generator. The root README and reproduction script package this source-only exercise.

## Commands and tool versions actually used

Node 24.19.0, npm 11.9.0; create-sdkgen 0.30.6, apidef 8.23.0, sdkgen 4.34.1, model 12.0.1, docgen 0.30.1.

1. Installed `@voxgig/create-sdkgen@0.30.6` locally and ran its CLI with `frankfurter -d ./input/frankfurter-openapi.json -o ./repo -t ts -f test`.
2. The initial dependency install failed; corrected the apidef constraint and installed the scaffold dependencies.
3. Ran `voxgig-sdkgen target add ts`, `voxgig-sdkgen feature add test` and `npm run generate` in the scaffold's `.sdk/` folder.
4. Declared the correct repository URL and publisher in `project.aontu`, then regenerated.
5. Ran TypeScript install, build and generated tests. After metadata regeneration the final suite again passed: 249 total, 237 passed, 12 skipped, 0 failures, 0 cancelled.
6. Ran `voxgig-sdkgen doctor`: exit 0, scaffold matched; warning about ignored copy records remained.
7. Executed real generated SDK calls against Frankfurter, with a 20-second request timeout: pair lookup, same-currency identity, currency lookup, and an invalid currency. All four final checks passed; statuses were 200, 200, 200 and 422. See the committed JSON evidence.

Reproduction script validation: syntax checked; end-to-end execution remains unverified. The generation, build and test commands listed above were executed separately.

## Friction and suggestions

**Dependency conflict.** create-sdkgen 0.30.6 scaffolded apidef `~8.22.1` and sdkgen `~4.34.0`. npm selected sdkgen 4.34.1, whose peer requires apidef `>=8.23.0`, and stopped with ERESOLVE. Changing apidef to `~8.23.0` resolved it. The committed toolchain lock freezes the versions used. Suggest a clean-install CI test of the scaffolder against the dependency ranges, or releases whose peer floors remain compatible within the pinned patch line.

**Normalized identifiers.** Passing the API's raw `code` parameter to `Currency.load` produced a missing `{id}` error. The generated `CurrencyLoadMatch` correctly declares `id`; using `{ id: 'EUR' }` succeeded. A per-entity first-call example showing the API-to-SDK identifier mapping would make this easier to discover.

**Warnings.** Generation disabled `BasicRateFlow#1` because its placeholder call did not supply a reachable route. It also warned that `.sdk/.gitignore` ignores generation/copy records; doctor returned zero despite that warning. Suggest either seed a valid pair in the inferred example flow or clearly label it as requiring input, and make fresh-clone reproducibility instructions explain which generated records must be committed.

**Source-only installation.** The generated language README assumes compiled `dist/` is committed. This exercise's root README explicitly requires building from source first. Offering a source-only documentation option would avoid that packaging assumption.

## Limits and remaining steps

The full official spec was supplied, but live checks covered a small subset. Historical ranges, provider filtering, streaming, CSV and every generated route were not tested. Twelve generated cases were skipped by the default suite; that count is reported rather than treated as a full pass of every API operation. No claim of production readiness is made.

Repository: https://github.com/AlbadawiDev/voxgig-frankfurter-sdk. This package is mini task 1; submission and task 2 are separate from this local preparation report. Richard's email says he will send task 2 after task 1. USD 50 is for both tasks, invoiced after task 2, with payment processing to start within seven days of receiving the invoice. No second task or invoice has been completed here.
